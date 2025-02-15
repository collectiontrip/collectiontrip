from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, CreateChatRoomSerializer, MessageSerializer, CreateMessageSerializer


class ChatRoomViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatRoomSerializer

    def create(self, request, *args, **kwargs):
        if ChatRoom.objects.filter(user=request.user).exists():
            return Response({"detail": "ChatRoom already exists for this user."}, status=400)
        serializer = CreateChatRoomSerializer(
            data=request.data, context={'user_id': request.user.id}
        )
        serializer.is_valid(raise_exception=True)
        chatroom = serializer.save()
        serializer = ChatRoomSerializer(chatroom)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ChatRoom.objects.all()
        return ChatRoom.objects.filter(user=user)
  
class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        chat_room_id = self.request.query_params.get('chat_room')
        if chat_room_id:
            return Message.objects.filter(chat_room_id=chat_room_id)
        return Message.objects.all()

    def create(self, request, *args, **kwargs):
        chatroom_id = request.data.get('chat_room')
        try:
            chat_room = ChatRoom.objects.get(id=chatroom_id)
        except ChatRoom.DoesNotExist:
            return Response({"detail": "ChatRoom not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateMessageSerializer(
            data=request.data,
            context={'sender': request.user, 'chat_room': chat_room}
        )
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)