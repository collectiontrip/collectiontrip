from rest_framework import viewsets
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
    queryset = Message.objects.all()
    
    def create(self, request, *args, **kwargs):
        chatroom_id = kwargs.get('chatroom_pk')

        # Validate chat room existence
        try:
            chat_room = ChatRoom.objects.get(id=chatroom_id)
        except ChatRoom.DoesNotExist:
            return Response({"detail": "ChatRoom not found."}, status=404)

        serializer = CreateMessageSerializer(
            data=request.data, context={'sender': request.user}
        )
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        return Response(MessageSerializer(message).data, status=201)