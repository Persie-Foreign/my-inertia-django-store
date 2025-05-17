# config/views.py

from inertia import render as inertia_render
from config.utils import render  # our helper that injects `auth`
from django.views.generic import TemplateView
from django.contrib.auth import logout
from django.views.decorators.http import require_POST
from django.shortcuts import redirect

from product.models import Product

def home(request):
    # 1) Best sellers: is_best=True
    best_qs = Product.objects.filter(is_best=True).prefetch_related('images','reviews')
    best_sellers = [{
        'id':          p.id,
        'slug':        p.slug,
        'title':       p.title,
        'image_url':   p.images.first().image.url if p.images.exists() else '',
        'price':       float(p.price),
        'original_price': float(p.original_price) if p.original_price else None,
        'reviews_count':   p.reviews.count(),
        'is_new':      p.is_new,
        'is_best':     p.is_best,
        'save_amount': p.save_amount,
    } for p in best_qs]

    # 2) Products by category (for tabs)
    cats = ['Heartleaf','Rice','Peach']
    products_by_category = {}
    for cat in cats:
        qs = Product.objects.filter(category__name=cat).prefetch_related('images','reviews')
        products_by_category[cat] = [{
            'id':            p.id,
            'slug':          p.slug,
            'title':         p.title,
            'image_url':     p.images.first().image.url if p.images.exists() else '',
            'price':         float(p.price),
            'original_price': float(p.original_price) if p.original_price else None,
            'reviews_count': p.reviews.count(),
        } for p in qs]

    return render(request, 'Home', {
        'bestSellers': best_sellers,
        'productsByCategory': products_by_category
    })

@require_POST
def custom_logout(request):
    """
    Log out the user and redirect to home.
    """
    logout(request)
    return redirect('Home')


class AccountPendingView(TemplateView):
    """
    GET /accounts/pending/
    Renders the allauth “pending” page when admin approval is required.
    """
    template_name = "account/pending.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        # Inject auth so navbar still works here too
        user = self.request.user
        ctx['auth'] = {
            'user': user.is_authenticated and {
                'username': user.username,
            }
        }
        return ctx
