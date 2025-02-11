
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from channels.auth import AuthMiddlewareStack
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.utils.timezone import now
from django.core.exceptions import AppRegistryNotReady
from django.apps import apps

User = None

def get_user_model():
    global User
    if User is None:
        try:
            User = apps.get_model('auth', 'User')
        except AppRegistryNotReady:
            pass
    return User

@database_sync_to_async
def get_user(token):
    try:
        decoded_token = AccessToken(token)
        user = get_user_model().objects.get(id=decoded_token['user_id'])
        user.last_seen = now()
        user.is_online = True
        user.save(update_fields=['last_seen', 'is_online'])
        return user
    except Exception:
        return AnonymousUser()

@database_sync_to_async
def set_user_offline(user):
    if user.is_authenticated:
        user.is_online = False
        user.save(update_fields=['is_online'])

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        token = query_params.get("token", [None])[0]
        user = await get_user(token) if token else AnonymousUser()
        scope["user"] = user
        return await self.inner(scope, receive, send)

