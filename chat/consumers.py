import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from .models import ChatRoom

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        from .models import ChatRoom, Message

        data = json.loads(text_data)
        event_type = data.get('type')

        if event_type == 'message':
            message = data.get('message', '')
            sender_username = data.get('sender')

            # Save the message to the database
            sender = await sync_to_async(User.objects.get)(username=sender_username)
            chat_room = await sync_to_async(ChatRoom.objects.get)(id=self.room_name)

            new_message = await sync_to_async(Message.objects.create)(
                chat_room=chat_room,
                sender=sender,
                content=message,
                message_type='text'
            )

            # Send the message to the group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': sender_username,
                    'timestamp': new_message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
                }
            )

        elif event_type == 'typing':
            sender_username = data.get('sender')
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_typing',
                    'sender': sender_username,
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp']
        }))

    async def user_typing(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'sender': event['sender'],
        }))
