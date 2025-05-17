# config/utils.py

from inertia import render as inertia_render

def render(request, component, props=None):
    """
    Wrap Inertia’s render to automatically inject `auth.user`
    into every page’s props.
    """
    data = props.copy() if props else {}
    data['auth'] = {
        'user': request.user.is_authenticated and {
            'username': request.user.username,
        }
    }
    return inertia_render(request, component, data)
