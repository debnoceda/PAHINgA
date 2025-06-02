from django.contrib import admin
from .models import Journal, MoodStat, Insight

# Register your models here.
admin.site.register(Journal)
admin.site.register(MoodStat)
admin.site.register(Insight)