from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Journal, MoodStats, Insights
from rest_framework import viewsets
from .serializers import UserSerializer, JournalSerializer, MoodStatsSerializer, InsightsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

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

class MoodStatsViewSet(viewsets.ModelViewSet):
    queryset = MoodStats.objects.all()
    serializer_class = MoodStatsSerializer 
    permission_classes = [IsAuthenticated]

class InsightsViewSet(viewsets.ModelViewSet):
    queryset = Insights.objects.all()
    serializer_class = InsightsSerializer
    permission_classes = [IsAuthenticated]