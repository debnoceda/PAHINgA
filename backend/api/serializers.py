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
        fields = ['id', 'percentHappiness', 'percentFear', 'percentSadness', 'percentDisgust', 'percentAnger', 'dominantMood']

class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = ['id', 'insightContent', 'user']

class JournalSerializer(serializers.ModelSerializer):
    title = serializers.CharField(allow_blank=True)
    content = serializers.CharField(allow_blank=True)
    moodStats = MoodStatSerializer(read_only=True)
    insights = InsightSerializer(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Journal
        fields = ['id', 'title', 'date', 'content', 'user', 'moodStats', 'insights']

    def validate(self, data):
        if not data.get('title') and not data.get('content'):
            raise serializers.ValidationError("Either title or content must be provided.")
        return data
