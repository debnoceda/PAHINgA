from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Journal(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journals')
    moodStats = models.OneToOneField('MoodStats', on_delete=models.CASCADE, related_name='journal', null=True, blank=True)
    insights = models.OneToOneField('Insights', on_delete=models.CASCADE, related_name='journal', null=True, blank=True)

    def __str__(self):
        return self.title

class MoodStats(models.Model):
    percentHappiness = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentFear = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentSadness = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentSurprise = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentDisgust = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    percentAnger = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    dominantMood = models.CharField(max_length=200)

    def __str__(self):
        return self.dominantMood

class Insights(models.Model):
    insightContent = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='insights')

    def __str__(self):
        return self.insightContent


# Create your models here.
