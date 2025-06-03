from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, JournalViewSet, MoodStatViewSet, InsightViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'journals', JournalViewSet, basename='journal')
router.register(r'moodstats', MoodStatViewSet, basename='moodstats')
router.register(r'insights', InsightViewSet, basename='insights')

urlpatterns = [
    path('', include(router.urls)),
    path('journals/<int:pk>/process_emotions/', JournalViewSet.as_view({'post': 'process_emotions'}), name='journal-process-emotions'),
]