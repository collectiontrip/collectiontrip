import os
import django

# Ensure Django is set up before importing any Django-specific modules
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
import chat.routing
from core.middleware import TokenAuthMiddleware

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "collectiontrip.settings.dev")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddleware(
            AuthMiddlewareStack(
                URLRouter(chat.routing.websocket_urlpatterns)
            )
        )
    ),
})