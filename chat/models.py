from django.db import models
from django.conf import settings

# Reference to the custom user model
User = settings.AUTH_USER_MODEL

class ChatRoom(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='chat_user'
    )
    staff = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='chat_staff', null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='active'
    )

    def __str__(self):
        return f"ChatRoom {self.id} - {self.user.username} ({self.status})"

    class Meta:
        ordering = ['-created_at']  # Most recent chat rooms first


class Message(models.Model):
    MESSAGE_TYPES = [
        ('text', 'Text'),
        ('voice', 'Voice'),
        ('media', 'Media'),
    ]

    chat_room = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name='messages'
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)  # Allows empty or null
    message_type = models.CharField(
        max_length=10, choices=MESSAGE_TYPES, default='text'
    )
    file = models.FileField(
        upload_to='chat_files/', blank=True, null=True
    )  # Optional file field
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id} in ChatRoom {self.chat_room.id} by {self.sender.username}"

    def save(self, *args, **kwargs):
        # Ensure either content or file is provided
        if not self.content and not self.file:
            raise ValueError("A message must have either content or a file.")
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['timestamp']  # Messages ordered by timestamp