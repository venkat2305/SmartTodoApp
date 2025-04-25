from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint for tasks with CRUD operations
    
    Provides functionality for managing todo tasks:
    - List all tasks
    - Retrieve a specific task
    - Create a new task
    - Update an existing task
    - Delete a task
    - Filter tasks by status
    - Mark task as complete/incomplete
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(detail=False, methods=['get'])
    def filter_by_status(self, request):
        """Filter tasks by status (ongoing, success, failure)"""
        status_param = request.query_params.get('status', None)
        if status_param is None:
            return Response(
                {"error": "Status parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if status_param not in [Task.ONGOING, Task.SUCCESS, Task.FAILURE]:
            return Response(
                {"error": f"Invalid status. Must be one of {[Task.ONGOING, Task.SUCCESS, Task.FAILURE]}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        tasks = self.queryset.filter(status=status_param)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def mark_complete(self, request, pk=None):
        """Mark a task as complete (success)"""
        task = self.get_object()
        task.status = Task.SUCCESS
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def mark_incomplete(self, request, pk=None):
        """Mark a task as incomplete (ongoing)"""
        task = self.get_object()
        # Only allow marking as ongoing if deadline hasn't passed
        if task.deadline < timezone.now():
            return Response(
                {"error": "Cannot mark as incomplete because deadline has passed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        task.status = Task.ONGOING
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)
