from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Journal, MoodStat, Insight
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserSerializer, JournalSerializer, MoodStatSerializer, InsightSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from gemini_wrapper.gemini_utils import get_emotion_probabilities, get_thought_advice
from django.utils import timezone
from django.db import transaction

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class JournalViewSet(viewsets.ModelViewSet):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Journal.objects.filter(user=self.request.user)

    def _process_journal_content(self, content: str):
        """Process journal content to get emotions and advice"""
        emotions = get_emotion_probabilities(content)
        advice_list = get_thought_advice(content)
        
        # Convert emotion probabilities to percentages
        mood_stats = {
            'percentHappiness': emotions['happy'] * 100,
            'percentFear': emotions['fear'] * 100,
            'percentSadness': emotions['sad'] * 100,
            'percentSurprise': emotions.get('surprise', 0.0) * 100,
            'percentDisgust': emotions['disgust'] * 100,
            'percentAnger': emotions['anger'] * 100,
            'dominantMood': max(emotions.items(), key=lambda x: x[1])[0]
        }
        
        # Create insight from advice
        insight = {
            'insightContent': '\n'.join(advice_list)
        }
        
        return mood_stats, insight

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Get all journals for today
        today = timezone.now().date()
        today_journals = Journal.objects.filter(
            user=request.user,
            date=today
        )
        
        # Process the new journal content
        mood_stats, insight = self._process_journal_content(request.data.get('content', ''))
        
        # Create MoodStat
        mood_stat = MoodStat.objects.create(**mood_stats)
        
        # Create Insight
        insight_obj = Insight.objects.create(
            insightContent=insight['insightContent'],
            user=request.user
        )
        
        # Create Journal with the processed data
        journal = Journal.objects.create(
            title=request.data.get('title'),
            content=request.data.get('content'),
            date=request.data.get('date'),
            user=request.user,
            moodStats=mood_stat,
            insights=insight_obj
        )
        
        serializer = self.get_serializer(journal)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Process the updated journal content
        mood_stats, insight = self._process_journal_content(request.data.get('content', ''))
        
        # Update MoodStat
        if instance.moodStats:
            for key, value in mood_stats.items():
                setattr(instance.moodStats, key, value)
            instance.moodStats.save()
        else:
            instance.moodStats = MoodStat.objects.create(**mood_stats)
        
        # Update Insight
        if instance.insights:
            instance.insights.insightContent = insight['insightContent']
            instance.insights.save()
        else:
            instance.insights = Insight.objects.create(
                insightContent=insight['insightContent'],
                user=request.user
            )
        
        # Update Journal fields
        instance.title = request.data.get('title', instance.title)
        instance.content = request.data.get('content', instance.content)
        instance.date = request.data.get('date', instance.date)
        instance.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class MoodStatViewSet(viewsets.ModelViewSet):
    queryset = MoodStat.objects.all()
    serializer_class = MoodStatSerializer 
    permission_classes = [IsAuthenticated]

class InsightViewSet(viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer
    permission_classes = [IsAuthenticated]