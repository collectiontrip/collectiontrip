from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now

class User(AbstractUser):
    email = models.EmailField(unique=True)
    last_seen = models.DateTimeField(default=now)  # Stores last seen timestamp
    is_online = models.BooleanField(default=False)  # True if user is online

    def update_last_seen(self):
        """Update last seen timestamp and set online status."""
        self.last_seen = now()
        self.is_online = True
        self.save(update_fields=['last_seen', 'is_online'])

    def set_offline(self):
        """Set user as offline."""
        self.is_online = False
        self.save(update_fields=['is_online'])
