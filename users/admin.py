from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff', 'is_approved')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'role', 'is_approved')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Approval & Role', {'fields': ('role', 'is_approved')}),
    )

admin.site.register(User, UserAdmin)
