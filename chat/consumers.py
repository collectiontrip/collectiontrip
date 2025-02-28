import json
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from urllib.parse import parse_qs

from .models import ChatRoom, Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract JWT token from query parameters
        query_params = parse_qs(self.scope["query_string"].decode())
        token = query_params.get("token", [None])[0]

        self.user = await self.authenticate_user(token)

        if not self.user:
            await self.close()
            return

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Mark user as online
        await self.set_user_online(self.user)

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if self.user:
            await self.set_user_offline(self.user)

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")
        message_type = data.get("message_type", "text")

        if not message and message_type == "text":
            return

        chat_room = await self.get_chat_room(self.room_name)
        if chat_room:
            new_message = await self.save_message(chat_room, self.user, message, message_type)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender_id": self.user.id,
                    "sender_username": self.user.username,
                    "message_type": message_type,
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_username": event["sender_username"],
            "message_type": event["message_type"]
        }))

    async def authenticate_user(self, token):
        if not token:
            return None
        try:
            decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_data.get("user_id")
            return await self.get_user(user_id)
        except (jwt.ExpiredSignatureError, jwt.DecodeError):
            return None

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_chat_room(self, room_id):
        try:
            return ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, chat_room, sender, content, message_type):
        return Message.objects.create(chat_room=chat_room, sender=sender, content=content, message_type=message_type)

    @database_sync_to_async
    def set_user_online(self, user):
        user.is_online = True
        user.save(update_fields=["is_online"])

    @database_sync_to_async
    def set_user_offline(self, user):
        user.is_online = False
        user.last_seen = now()
        user.save(update_fields=["is_online", "last_seen"])