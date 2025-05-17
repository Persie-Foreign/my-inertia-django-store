from django import forms
from allauth.account.forms import SignupForm
from django.contrib.auth import get_user_model
from allauth.account.utils import send_email_confirmation

User = get_user_model()

class CustomSignupForm(SignupForm):
    ROLE_CHOICES = User.ROLE_CHOICES  # [('author','Author'),('viewer','Viewer')]
    role = forms.ChoiceField(
        choices=ROLE_CHOICES,
        label="Register as",
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    def save(self, request):
        user = super().save(request)
        # save role & inactive flag …
        user.save()
        # trigger the email
        send_email_confirmation(request, user, signup=True)
        return user
