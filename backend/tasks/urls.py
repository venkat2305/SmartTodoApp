from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

# The API URLs are determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]