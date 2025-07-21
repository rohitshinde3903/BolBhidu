# This file defines how Django models are converted to/from JSON for the admin_app.

from rest_framework import serializers
from .models import Post
from django.contrib.auth.models import User

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for the Post model.
    Converts Post model instances to JSON and vice-versa.
    """
    # Display author's username instead of just their ID
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Post
        fields = ['id', 'headline', 'content', 'tags', 'author', 'author_username', 'published_date', 'updated_date']
        read_only_fields = ['id', 'author_username', 'published_date', 'updated_date'] # These fields are read-only for incoming data

