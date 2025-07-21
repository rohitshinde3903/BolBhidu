
from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Message model.
    Converts Message model instances to JSON and vice-versa.
    """
    class Meta:
        model = Message
        fields = ['id', 'content', 'timestamp'] # Fields to include in the API output
        read_only_fields = ['id', 'timestamp'] # These fields are read-only for incoming data
