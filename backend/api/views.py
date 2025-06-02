from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Journal, MoodStat, Insight
from rest_framework import viewsets
from .serializers import UserSerializer, JournalSerializer, MoodStatSerializer, InsightSerializer
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

class MoodStatViewSet(viewsets.ModelViewSet):
    queryset = MoodStat.objects.all()
    serializer_class = MoodStatSerializer 
    permission_classes = [IsAuthenticated]

class InsightViewSet(viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer
    permission_classes = [IsAuthenticated]