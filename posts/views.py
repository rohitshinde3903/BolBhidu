from rest_framework import viewsets
from .models import Message
from .serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for viewing and editing Message instances.
    Provides CRUD operations for Message objects via API endpoints.
    """
    queryset = Message.objects.all().order_by('-timestamp') # Get all messages, ordered by newest first
    serializer_class = MessageSerializer # Use our MessageSerializer
