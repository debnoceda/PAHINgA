from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Journal, MoodStat, Insight, UserStreak, UserProfile
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserSerializer, JournalSerializer, MoodStatSerializer, InsightSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from gemini_wrapper.gemini_utils import get_emotion_probabilities, get_thought_advice
from django.utils import timezone
from django.db import transaction
from rest_framework.decorators import action

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['me', 'delete_account', 'update', 'mark_welcome_seen']:
            return [IsAuthenticated()]
        return super().get_permissions()

    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        if request.method == 'PUT':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def delete_account(self, request):
        try:
            user = request.user
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": f"Failed to delete account: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def mark_welcome_seen(self, request):
        try:
            user_profile, created = UserProfile.objects.get_or_create(user=request.user)
            user_profile.has_seen_welcome = True
            user_profile.save()
            return Response({'status': 'success'})
        except Exception as e:
            return Response(
                {"error": f"Failed to update welcome status: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class JournalViewSet(viewsets.ModelViewSet):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Journal.objects.filter(user=self.request.user).order_by('-id', '-date')

    def perform_create(self, serializer):
        journal = serializer.save(user=self.request.user)
        # Get or create user's streak
        user_streak, created = UserStreak.objects.get_or_create(user=self.request.user)
        user_streak.update_streak(journal.date)

    def _process_journal_content(self, content: str):
        """Process journal content to get emotions and advice"""
        try:
            emotions = get_emotion_probabilities(content)
            advice_list = get_thought_advice(content)
            
            # Convert emotion probabilities to percentages
            max_val = max(emotions.values())
            top_emotions = [k for k, v in emotions.items() if v == max_val]
            
            mood_stats = {
                'percentHappiness': emotions['happy'] * 100,
                'percentFear': emotions['fear'] * 100,
                'percentSadness': emotions['sad'] * 100,
                'percentDisgust': emotions['disgust'] * 100,
                'percentAnger': emotions['anger'] * 100,
                'dominantMood': top_emotions[0] if len(top_emotions) == 1 else ''
            }
            
            # Create insight from advice
            insight = {
                'insightContent': '\n'.join(advice_list)
            }
            
            return mood_stats, insight
        except Exception as e:
            print(f"Error in _process_journal_content: {str(e)}")
            print(f"Content: {content}")
            print(f"Emotions: {emotions if 'emotions' in locals() else 'Not created'}")
            raise

    @transaction.atomic
    def process_emotions(self, request, *args, **kwargs):
        """Process emotions and generate insights for a journal entry"""
        try:
            instance = self.get_object()
            current_content = instance.content
            
            print(f"Processing emotions for journal {instance.id}")
            print(f"Content: {current_content}")
            
            # Store last processed content in Journal model
            if hasattr(instance, 'lastProcessedContent') and instance.lastProcessedContent == current_content:
                print("Content already processed, skipping")
                serializer = self.get_serializer(instance)
                return Response(serializer.data)
            
            # Process the journal content
            print("Processing journal content...")
            mood_stats, insight = self._process_journal_content(instance.content)
            print(f"Mood stats: {mood_stats}")
            print(f"Insight: {insight}")
            
            # Create or update MoodStat
            try:
                if instance.moodStats:
                    print("Updating existing MoodStat")
                    for key, value in mood_stats.items():
                        setattr(instance.moodStats, key, value)
                    instance.moodStats.save()
                else:
                    print("Creating new MoodStat")
                    instance.moodStats = MoodStat.objects.create(**mood_stats)
            except Exception as e:
                print(f"Error with MoodStat: {str(e)}")
                raise
            
            # Create or update Insight
            try:
                if instance.insights:
                    print("Updating existing Insight")
                    instance.insights.advice_messages = insight['insightContent'].split('\n')
                    instance.insights.save()
                else:
                    print("Creating new Insight")
                    instance.insights = Insight.objects.create(
                        advice_messages=insight['insightContent'].split('\n'),
                        user=request.user
                    )
            except Exception as e:
                print(f"Error with Insight: {str(e)}")
                raise
            
            instance.lastProcessedContent = current_content
            instance.save()
            print("Successfully processed emotions")
            
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error processing emotions: {str(e)}")
            import traceback
            print(traceback.format_exc())
            return Response(
                {"error": f"Failed to process emotions: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MoodStatViewSet(viewsets.ModelViewSet):
    queryset = MoodStat.objects.all()
    serializer_class = MoodStatSerializer 
    permission_classes = [IsAuthenticated]

class InsightViewSet(viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer
    permission_classes = [IsAuthenticated]