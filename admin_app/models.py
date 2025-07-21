
from django.db import models
from django.contrib.auth.models import User # Import Django's built-in User model

class Post(models.Model):
    """
    Represents a news blog post.
    """
    headline = models.CharField(max_length=255) # The main title of the post
    content = models.TextField(blank=True, null=True) # The full content of the post (optional for now, but good to have)
    tags = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated tags (e.g., politics, sports)") # Tags for categorization
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True) # Link to the User who authored the post
    published_date = models.DateTimeField(auto_now_add=True) # Automatically set when post is created
    updated_date = models.DateTimeField(auto_now=True) # Automatically updated on each save

    class Meta:
        ordering = ['-published_date'] # Default ordering: newest posts first

    def __str__(self):
        return self.headline