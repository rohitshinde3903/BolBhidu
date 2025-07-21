
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Post instances.
    Requires authentication for all actions except listing and retrieving individual posts.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # Default permission is IsAuthenticated, but overridden in get_permissions for GET requests

    def perform_create(self, serializer):
        """
        Automatically sets the author of the post to the currently logged-in user.
        """
        serializer.save(author=self.request.user)

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        For listing posts (GET /api/admin/posts/) and retrieving a single post (GET /api/admin/posts/{id}/),
        we want to allow anyone to see them.
        For creating, updating, or deleting posts (POST, PUT, PATCH, DELETE),
        only authenticated users are allowed.
        """
        if self.action in ['list', 'retrieve']:
            # Allow any user (even unauthenticated) to view posts
            permission_classes = [AllowAny]
        else:
            # Require authentication for create, update, delete actions
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

