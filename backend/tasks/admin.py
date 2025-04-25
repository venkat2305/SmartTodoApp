from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'deadline', 'status', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('title', 'description')
    ordering = ('-created_at',)
