from inertia import render
from django.contrib.auth.decorators import login_required

@login_required
def dashboard_page(request):
    page = 'DashboardAuthor' if request.user.role=='author' else 'DashboardViewer'
    return render(request, page, {'auth': {'user': request.user}})


def pending_page(request):
    return render(request, 'ApprovalPending')
