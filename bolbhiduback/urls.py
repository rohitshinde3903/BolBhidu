from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls), # Keep for initial superuser creation, will not be used for custom admin
    path('api/auth/', include('auth_app.urls')), # Include URLs from our auth_app
    # path('api/posts/', include('posts_app.urls')), # Will be added in the next step
]
