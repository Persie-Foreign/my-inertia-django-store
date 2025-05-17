# config/context_processors.py
def auth(request):
    user = request.user
    return {
        "auth": {
            "user": user.is_authenticated and {
                "username":     user.username,
                "is_active":    user.is_active,
                "email_verified": user.emailaddress_set.filter(verified=True).exists()
            }
        }
    }
