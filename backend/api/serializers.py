from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Journal, MoodStats, Insights

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class MoodStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodStats
        fields = ['id', 'percentHappiness', 'percentFear', 'percentSadness', 'percentSurprise', 'percentDisgust', 'percentAnger', 'dominantMood']

class InsightsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insights
        fields = ['id', 'insightContent', 'user']

class JournalSerializer(serializers.ModelSerializer):
    moodStats = MoodStatsSerializer(read_only=True)
    insights = InsightsSerializer(read_only=True)
    
    class Meta:
        model = Journal
        fields = ['id', 'title', 'date', 'content', 'user', 'moodStats', 'insights']
