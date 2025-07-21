from django.db import models

class Message(models.Model):
    """
    Represents a simple message with content and a timestamp.
    """
    content = models.TextField() # The actual message text
    timestamp = models.DateTimeField(auto_now_add=True) # Automatically set when created

    def __str__(self):
        return f"Message from {self.timestamp.strftime('%Y-%m-%d %H:%M')}: {self.content[:50]}..."
