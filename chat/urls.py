from django.urls import path, include
from rest_framework_nested import routers
from . import views
router = routers.DefaultRouter()
router.register(r'chatrooms', views.ChatRoomViewSet, basename='chatroom')

chatrooms_router = routers.NestedDefaultRouter(router, 'chatrooms', lookup='chatroom')
chatrooms_router.register(r'messages', views.MessageViewSet, basename='chatroom-message')

urlpatterns = [
    
    path('', include(router.urls)),
    path('', include(chatrooms_router.urls)),
]

