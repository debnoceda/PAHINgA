from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_save
from django.dispatch import receiver


class Journal(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    content = models.TextField()
    lastProcessedContent = models.TextField(null=True, blank=True) # For checking if the content has been processed to avoid processing the same content multiple times
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journals')
    moodStats = models.OneToOneField('MoodStat', on_delete=models.CASCADE, related_name='journal', null=True, blank=True)
    insights = models.OneToOneField('Insight', on_delete=models.CASCADE, related_name='journal', null=True, blank=True)

    def __str__(self):
        return self.title

class MoodStat(models.Model):
    percentHappiness = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentFear = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentSadness = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentDisgust = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentAnger = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    dominantMood = models.CharField(max_length=200)

    def __str__(self):
        return self.dominantMood

class Insight(models.Model):
    insightContent = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='insights')

    def __str__(self):
        return self.insightContent

class UserStreak(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='streak')
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_journal_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s streak: {self.current_streak}"

    def update_streak(self, journal_date):
        if not self.last_journal_date:
            self.current_streak = 1
        else:
            # Calculate days between last journal and new journal
            days_diff = (journal_date - self.last_journal_date).days
            
            if days_diff == 1:  # Consecutive day
                self.current_streak += 1
            elif days_diff > 1:  # Streak broken
                self.current_streak = 1
            # If days_diff == 0, it's the same day, don't update streak
        
        # Update longest streak if current streak is higher
        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak
        
        self.last_journal_date = journal_date
        self.save()

@receiver(post_save, sender=User)
def create_user_streak(sender, instance, created, **kwargs):
    if created:
        UserStreak.objects.create(user=instance)
