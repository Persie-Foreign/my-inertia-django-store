# users/signals.py

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.contrib.sites.models import Site
from django.urls import reverse


User = get_user_model()

@receiver(post_save, sender=User)
def notify_admin_on_signup(sender, instance, created, **kwargs):
    """
    Send email to ADMIN_EMAIL whenever a new user signs up.
    """
    if created:
        send_mail(
            subject="New user awaiting approval",
            message=(
                f"Username: {instance.username}\n"
                f"Email:    {instance.email}\n"
                f"Role:     {instance.role}\n\n"
                "Please log in to the admin site to approve this user."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
        )

@receiver(pre_save, sender=User)
def cache_old_approval(sender, instance, **kwargs):
    if instance.pk:
        old = User.objects.get(pk=instance.pk)
        instance._was_approved = old.is_approved
    else:
        instance._was_approved = False

@receiver(post_save, sender=User)
def notify_user_on_approval(sender, instance, created, **kwargs):
    # Only fire when an existing user flips from not-approved → approved
    if not created and not getattr(instance, '_was_approved', False) and instance.is_approved:
        # Build a fully-qualified login URL
        site = Site.objects.get_current()  # uses SITE_ID
        protocol = getattr(settings, "ACCOUNT_DEFAULT_HTTP_PROTOCOL", "http")
        login_path = reverse('account_login')
        login_url = f"{protocol}://{site.domain}{login_path}"

        subject = "Your DevShop account has been approved"
        message = (
            f"Hi {instance.username},\n\n"
            "Your account has been approved by our team! You can now log in here:\n\n"
            f"{login_url}\n\n"
            "Welcome aboard,\nThe DevShop Team"
        )
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
        )