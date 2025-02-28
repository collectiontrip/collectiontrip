from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from djoser.views import UserViewSet
from .serializers import UserSerializer
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from core.utils.twilio_utils import send_sms 





User = get_user_model()

class UpdateUserStatus(APIView):
    """Updates the last seen status of the authenticated user"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if hasattr(user, 'update_last_seen'):
            user.update_last_seen()
        else:
            user.last_seen = timezone.now()
            user.save()
            
        return Response({"message": "User status updated successfully"})

class CustomUserViewSet(UserViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # Allow only authenticated users

    def get_queryset(self):
        """Override to allow all users to be listed"""
        return User.objects.all()

    def list(self, request, *args, **kwargs):
        """Manually return all users"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def send_sms(self, request):
        """Send an SMS via Twilio"""
        to = request.data.get("to")
        message = request.data.get("message", "Hello, Welcome on collectiontrip!")
        
        if not to:
            return Response({"error": "Recipient number is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = send_sms(to, message)
        return Response(response, status=status.HTTP_200_OK)
        
