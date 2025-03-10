from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import ChatRoom


@receiver(post_save, sender=settings.AUTH_USER_MODEL )
def create_chatroom_for_new_user(sender, **kwargs):
    if kwargs['created']:
        ChatRoom.objects.create(user=kwargs['instance'])

