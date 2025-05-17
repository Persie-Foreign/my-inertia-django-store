# config/middleware.py

from django.utils.deprecation import MiddlewareMixin
from allauth.account.models import EmailAddress

class InertiaUserMiddleware(MiddlewareMixin):
    """
    Adds `auth.user` and `cartCount` into `request.inertia.props`
    so they are available to every Inertia page.
    """
    def process_request(self, request):
        # The Inertia middleware puts an `inertia` attribute on request
        # with a `.props` dict we can mutate.
        if not hasattr(request, "inertia"):
            return

        user = request.user
        if user.is_authenticated:
            verified = EmailAddress.objects.filter(
                user=user, email=user.email, verified=True
            ).exists()
            auth_user = {
                "id":             user.id,
                "username":       user.username,
                "email":          user.email,
                "is_active":      user.is_active,
                "email_verified": verified,
                # include role if you have one on your User model
                "role": getattr(user, "role", "viewer"),
            }
        else:
            auth_user = None

        cart_count = request.session.get("cart_count", 0)

        # Inject into the Inertia props
        request.inertia.props["auth"]      = {"user": auth_user}
        request.inertia.props["cartCount"] = cart_count
