from django.urls import path

def websocket_urlpatterns():
    from . import consumers  # Import inside the function to avoid AppRegistry issues
    return [
        path("ws/chat/<str:room_name>/", consumers.ChatConsumer.as_asgi()),
    ]
