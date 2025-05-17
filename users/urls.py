from django.urls import path, include
import
urlpatterns = [
    path('accounts/', include('allauth.urls')),
    # … your other routes
]
