import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
pi
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender_id']
        message_type = data.get('message_type', 'text')  # Default to text

        # Import models inside the function
        from .models import ChatRoom, Message  

        user_model = get_user_model()
        sender = await self.get_user(sender_id)
        chat_room = await self.get_chat_room(self.room_name)

        if sender and chat_room:
            new_message = Message(
                chat_room=chat_room,
                sender=sender,
                content=message if message_type == 'text' else '',
                message_type=message_type
            )
            await self.save_message(new_message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_id': sender_id,
                    'message_type': message_type
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'message_type': event['message_type']
        }))

    async def get_user(self, user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            return await User.objects.aget(id=user_id)
        except User.DoesNotExist:
            return None

    async def get_chat_room(self, room_id):
        from .models import ChatRoom
        try:
            return await ChatRoom.objects.aget(id=room_id)
        except ChatRoom.DoesNotExist:
            return None

    async def save_message(self, message):
        await message.asave()  