# config/views.py

from inertia import render
from config.utils import render  # our helper that injects `auth`
from django.views.generic import TemplateView
from django.contrib.auth import logout
from django.views.decorators.http import require_POST
from django.shortcuts import redirect
from django.db.models import Q
from product.models import Product, Category
from collections import defaultdict


def home(request):
    """
    Renders the homepage with highlighted products, categorized products,
    and a global relatedProducts list based on a dynamic reference product.
    """

    def serialize(prod):
        img_url = prod.images.first().image.url if prod.images.exists() else ''
        return {
            'id':    prod.id,
            'title': prod.title,
            'slug':  prod.slug,
            'price': float(prod.price),
            'image': img_url,
        }

    # 1) Highlighted Products
    highlighted_qs = (
        Product.objects
        .filter(Q(is_best=True) | Q(is_new=True), images__isnull=False)
        .distinct()
        .prefetch_related('images', 'reviews', 'category')
    )

    highlighted_products = []
    all_flat_products = []

    for p in highlighted_qs:
        urls = [img.image.url for img in p.images.all()]
        product_data = {
            'id':             p.id,
            'slug':           p.slug,
            'title':          p.title,
            'image1':         urls[0] if urls else '',
            'image2':         urls[1] if len(urls) > 1 else (urls[0] if urls else ''),
            'images':         urls,
            'price':          float(p.price),
            'original_price': float(p.original_price) if p.original_price else None,
            'reviews_count':  p.reviews.count(),
            'is_new':         p.is_new,
            'is_best':        p.is_best,
            'save_amount':    p.save_amount,
            'category': {
                'name': p.category.name,
                'parent': p.category.parent.name if p.category and p.category.parent else None,
            } if p.category else None

        }
        highlighted_products.append(product_data)
        all_flat_products.append(p)

    # 2) Categorized Products
    cats = ['Cloths', 'Cosmetic', 'Electronics']
    products_by_category = {}

    for parent_name in cats:
        parent = Category.objects.filter(name=parent_name).first()
        if not parent:
            continue

        subcats = Category.objects.filter(parent=parent)
        cat_dict = {}
        all_products_list = []

        for subcat in subcats:
            products = Product.objects.filter(category=subcat).prefetch_related('images', 'reviews', 'category')

            product_list = []
            for p in products:
                urls = [img.image.url for img in p.images.all()]
                product_data = {
                    'id':              p.id,
                    'slug':            p.slug,
                    'title':           p.title,
                    'image_url':       urls[0] if urls else '',
                    'hover_image_url': urls[1] if len(urls) > 1 else (urls[0] if urls else ''),
                    'images':          urls,
                    'price':           float(p.price),
                    'original_price':  float(p.original_price) if p.original_price else None,
                    'reviews_count':   p.reviews.count(),
                    'is_new':          p.is_new,
                    'is_best':         p.is_best,
                    'save_amount':     p.save_amount,
                    'category': {
                        'name': p.category.name,
                        'parent': p.category.parent.name if p.category and p.category.parent else None,
                    } if p.category else None

                }

                product_list.append(product_data)
                all_products_list.append(p)

            if product_list:
                cat_dict[subcat.name] = product_list

        cat_dict['__all__'] = [serialize(prod) for prod in all_products_list]
        products_by_category[parent_name] = cat_dict
        all_flat_products.extend(all_products_list)

    # 3) Related Products (like product_detail)
    qs = Product.objects.filter(images__isnull=False).distinct().prefetch_related('category__parent', 'images')

    related_products = []

    for p in qs:
        if not p.category:
            continue

        related_products.append({
            'id': p.id,
            'title': p.title,
            'slug': p.slug,
            'category': {
                'name': p.category.name,
                'parent': p.category.parent.name if p.category.parent else None,
            },
            'images': [img.image.url for img in p.images.all()],
            'price': float(p.price),
            'original_price': float(p.original_price) if p.original_price else None,
            'image_url': p.images.first().image.url if p.images.exists() else '',
        })

    return render(request, 'Home', {
        'highlightedProducts': highlighted_products,
        'productsByCategory': products_by_category,
        'relatedProducts': related_products
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

def about(request):
    return render(request, 'BrandStory')

def checkout(request):
    return render(request, 'CheckoutSection')


