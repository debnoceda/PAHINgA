from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, JournalViewSet, MoodStatsViewSet, InsightsViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'journals', JournalViewSet, basename='journal')
router.register(r'moodstats', MoodStatsViewSet, basename='moodstats')
router.register(r'insights', InsightsViewSet, basename='insights')

urlpatterns = [
    path('', include(router.urls)),
] 