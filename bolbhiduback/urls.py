from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls), # Keep for initial superuser creation, will not be used for custom admin
    path('api/auth/', include('auth_app.urls')), # Include URLs from our auth_app
    path('api/admin/', include('admin_app.urls')), # Include URLs from our new admin_app
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
