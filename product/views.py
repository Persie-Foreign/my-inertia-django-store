from inertia import render
from django.shortcuts import get_object_or_404
from .models import Product, Category


def home(request):
    """
    Renders the homepage with best-seller listing.
    """
    qs = Product.objects.filter(is_best=True, images__isnull=False).distinct().prefetch_related('images','reviews')
    products = []
    for p in qs:
        products.append({
            'id':               p.id,
            'name':             p.title,
            'slug':             p.slug,
            'image_url':        p.images.first().image.url,
            'zoomed_image_url': p.images.first().image.url,
            'price':            float(p.price),
            'original_price':   float(p.original_price) if p.original_price else None,
            'reviews_count':    p.reviews.count(),
            'is_new':           p.is_new,
            'is_best':          p.is_best,
            'save_amount':      p.save_amount,
        })
    return render(request, 'Home', { 'products': products })


def product_list(request):
    """
    Renders /products/ grouped by category → parent → children.
    """
    qs = Product.objects.filter(images__isnull=False).distinct().prefetch_related('category__parent','images','reviews')
    products = []
    for p in qs:
        products.append({
            'id':               p.id,
            'title':            p.title,
            'slug':             p.slug,
            'category': {
                'name':   p.category.name,
                'parent': p.category.parent.name if p.category.parent else None,
            },
            'images':           [img.image.url for img in p.images.all()],
            'price':            float(p.price),
        })
    return render(request, 'ProductList', { 'products': products })

def shop_all(request):
    qs = (
        Product.objects
        .filter(is_active=True)          # only active products
        .prefetch_related('images','reviews')
    )
    products = []
    for p in qs:
        products.append({
            'id'            : p.id,
            'slug'          : p.slug,
            'title'         : p.title,
            'category'      : p.category.name,
            'image1'        : p.images[0].image.url if p.images.exists() else '',
            'image2'        : p.images[1].image.url if p.images.count()>1 else (p.images[0].image.url if p.images.exists() else ''),
            'price'         : float(p.price),
            'oldPrice'      : float(p.original_price) if p.original_price else None,
            'discount'      : float(p.original_price - p.price) if p.original_price else 0,
            'reviews'       : p.reviews.count(),
            'date'          : p.created_at.isoformat(),
            'is_new'        : p.is_new,
        })
    return render(request, 'ShopAll', {
        'products': products
    })

def product_detail(request, slug):
    """
    Renders /products/<slug>/ with full details & reviews.
    """
    p = get_object_or_404(Product.objects.prefetch_related('images','reviews__author'), slug=slug)
    data = {
        'id':            p.id,
        'title':         p.title,
        'slug':          p.slug,
        'description':   p.description,
        'price':         float(p.price),
        'original_price':float(p.original_price) if p.original_price else None,
        'images':        [img.image.url for img in p.images.all()],
        'reviews':       [{
            'id':        r.id,
            'author':    r.author.username,
            'rating':    r.rating,
            'comment':   r.comment,
            'created_at':r.created_at.isoformat(),
        } for r in p.reviews.all()],
    }
    return render(request, 'ProductDetail', data)


def product_lines(request):
    """
    Pass Heartleaf, Rice, Peach product sets to the front end.
    """
    # Adjust these slugs to match your real category slugs:
    cats = ['Heartleaf', 'Rice', 'Peach']
    products_by_cat = {}
    for cat in cats:
        qs = (
            Product.objects
            .filter(category__name=cat, images__isnull=False)
            .distinct()
            .prefetch_related('images','reviews')
        )
        products_by_cat[cat] = [
            {
                'id':               p.id,
                'title':            p.title,
                'slug':             p.slug,
                'image_url':        p.images.first().image.url if p.images.exists() else '',
                'price':            float(p.price),
                'original_price':   float(p.original_price) if p.original_price else None,
                'reviews_count':    p.reviews.count(),
            }
            for p in qs
        ]
    return render(request, 'ProductLines', {
        'productsByCategory': products_by_cat
    })