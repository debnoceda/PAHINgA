from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Journal, MoodStat, Insight

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class MoodStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodStat
        fields = ['id', 'percentHappiness', 'percentFear', 'percentSadness', 'percentSurprise', 'percentDisgust', 'percentAnger', 'dominantMood']

class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = ['id', 'insightContent', 'user']

class JournalSerializer(serializers.ModelSerializer):
    moodStats = MoodStatSerializer(read_only=True)
    insights = InsightSerializer(read_only=True)
    
    class Meta:
        model = Journal
        fields = ['id', 'title', 'date', 'content', 'user', 'moodStats', 'insights']
