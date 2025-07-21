from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Post instances.
    Requires authentication for all actions.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated] # Only authenticated users can manage posts

    def perform_create(self, serializer):
        """
        Automatically sets the author of the post to the currently logged-in user.
        """
        serializer.save(author=self.request.user)

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        For listing posts (GET), we want to allow anyone to see them.
        For creating/updating/deleting (POST, PUT, PATCH, DELETE), only authenticated users.
        """
        if self.action == 'list' or self.action == 'retrieve':
            # Allow any user (even unauthenticated) to view posts
            permission_classes = [AllowAny]
        else:
            # Require authentication for create, update, delete actions
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]