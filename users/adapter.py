from allauth.account.adapter import DefaultAccountAdapter
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class CustomAccountAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=True):
        user = super().save_user(request, user, form, commit=False)
        user.role = form.cleaned_data.get('role')
        user.is_active = False
        if commit:
            user.save()
        return user

    # Old hook (kept for backward compatibility)
    def get_email_confirmation_redirect_url(self, request):
        return '/accounts/pending/'

    # New hook — make email_address optional
    def get_email_verification_redirect_url(self, request, email_address=None):
        """
        After clicking the email-verification link, redirect here.
        We accept email_address=None so ConfirmEmailView won't error.
        """
        return '/accounts/pending/'

    def get_login_redirect_url(self, request):
        return '/dashboard/'

    def clean_authentication(self, request, user, login, password):
        if not user.is_approved:
            raise ValidationError(
                _("Your account is pending approval by an administrator."),
                code='account_not_approved'
            )
        return super().clean_authentication(request, user, login, password)
