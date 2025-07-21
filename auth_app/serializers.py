from rest_framework import serializers
from django.contrib.auth.models import User # Import Django's built-in User model

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Expects 'username' and 'password' fields.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True) # write_only means it won't be returned in responses

