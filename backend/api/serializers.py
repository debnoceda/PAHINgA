from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Journal, MoodStat, Insight, UserStreak

class UserStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStreak
        fields = ['current_streak', 'longest_streak']

class UserSerializer(serializers.ModelSerializer):
    streak = UserStreakSerializer(read_only=True)
    old_password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'old_password', 'streak']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False},
            'email': {'required': False}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Handle password update separately
        if 'password' in validated_data:
            # Verify old password
            old_password = validated_data.pop('old_password', None)
            if not old_password:
                raise serializers.ValidationError({'old_password': 'Old password is required to set a new password'})
            
            if not instance.check_password(old_password):
                raise serializers.ValidationError({'old_password': 'Old password is incorrect'})
            
            # Set new password
            instance.set_password(validated_data.pop('password'))
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class MoodStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodStat
        fields = ['id', 'percentHappiness', 'percentFear', 'percentSadness', 'percentDisgust', 'percentAnger', 'dominantMood']

class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = ['id', 'advice_messages', 'user']

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
