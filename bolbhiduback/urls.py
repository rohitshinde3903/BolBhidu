from django.contrib import admin
from django.urls import path, include

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls), # Keep for initial superuser creation, will not be used for custom admin
    path('api/auth/', include('auth_app.urls')), # Include URLs from our auth_app
    path('api/admin/', include('admin_app.urls')), # Include URLs from our new admin_app
]
