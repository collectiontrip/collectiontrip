from rest_framework import serializers
from .models import ChatRoom, Message


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'user', 'staff', 'status', 'created_at']


class CreateChatRoomSerializer(serializers.Serializer):
    def save(self, **kwargs):
        user_id = self.context['user_id']
        chatroom = ChatRoom.objects.create(user_id=user_id)
        return chatroom


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.username", read_only=True)  # Fetch username

    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'sender', 'content', 'message_type', 'file', 'timestamp']
        
class CreateMessageSerializer(serializers.Serializer):
    content = serializers.CharField(required=False, allow_blank=True)
    file = serializers.FileField(required=False)

    def validate(self, data):
        if not data.get('content') and not data.get('file'):
            raise serializers.ValidationError("At least content or file is required.")

        file = data.get('file')
        if file:
            file_extension = file.name.split(".")[-1].lower()
            allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp3', 'wav', 'ogg', 'mp4', 'webm']
            if file_extension not in allowed_extensions:
                raise serializers.ValidationError("Unsupported file type.")
        return data

    def save(self, **kwargs):
        sender = self.context['sender']
        chat_room = self.context['chat_room']
        content = self.validated_data.get('content', '')
        file = self.validated_data.get('file', None)

        message = Message.objects.create(
            sender=sender,
            chat_room=chat_room,
            content=content,
            file=file
        )
        return message
