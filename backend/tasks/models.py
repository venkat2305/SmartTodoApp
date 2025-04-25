import uuid
from django.db import models
from django.utils import timezone


class Task(models.Model):
    """
    Task model representing a todo item with deadline and status tracking
    """
    # Status choices
    ONGOING = 'ongoing'
    SUCCESS = 'success'
    FAILURE = 'failure'
    
    STATUS_CHOICES = [
        (ONGOING, 'Ongoing'),
        (SUCCESS, 'Success'),
        (FAILURE, 'Failure'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=ONGOING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        """
        Override save to update task status based on deadline and completion
        """
        # If status is already set to success, keep it
        if self.status == self.SUCCESS:
            super().save(*args, **kwargs)
            return
            
        # If deadline has passed and task isn't completed, mark as failure
        if self.deadline < timezone.now() and self.status != self.SUCCESS:
            self.status = self.FAILURE
        # Otherwise, keep it as ongoing if it's not already marked as success
        elif self.status != self.SUCCESS:
            self.status = self.ONGOING
            
        super().save(*args, **kwargs)
