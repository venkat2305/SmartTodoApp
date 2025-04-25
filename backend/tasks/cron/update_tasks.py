from django.utils import timezone
from tasks.models import Task

def update_task_status():
    """
    Cron job to automatically update task statuses based on deadlines.
    - Tasks with passed deadlines that are not marked as completed will be set to 'failure'
    - Tasks already marked as 'success' remain unchanged
    """
    now = timezone.now()
    # Get all ongoing tasks whose deadlines have passed
    expired_tasks = Task.objects.filter(
        deadline__lt=now,
        status=Task.ONGOING
    )
    
    # Update them to failure status
    updated_count = expired_tasks.update(status=Task.FAILURE)
    
    return f"Updated {updated_count} tasks to failure status."