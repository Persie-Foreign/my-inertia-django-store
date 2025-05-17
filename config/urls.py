from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from users import views as user_views
from django.conf import settings
from django.conf.urls.static import static
from config.views import home, custom_logout
from inertia.middleware import InertiaMiddleware


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('accounts/pending/', user_views.pending_page, name='account_pending'),
    path('dashboard/', user_views.dashboard_page, name='dashboard'),

    path('products/', include('product.urls')),
    path('logout/', custom_logout, name='custom_logout'),
    path('accounts/', include('allauth.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)