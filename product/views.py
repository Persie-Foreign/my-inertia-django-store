from inertia import render
from django.http import JsonResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.db.models import Count, Avg
import json

from .models import Product, Review, ReviewMedia


def home(request):
    """
    Renders the homepage with best-seller listing.
    Only in-stock best-sellers (is_best=True, stock_quantity>0) are shown.
    """
    qs = (
        Product.objects
        .filter(is_best=True, stock_quantity__gt=0, images__isnull=False)
        .distinct()
        .prefetch_related('images', 'reviews')
    )

    products = []
    for p in qs:
        images = [img.image.url for img in p.images.all()]
        products.append({
            'id':             p.id,
            'title':          p.title,
            'slug':           p.slug,
            'image1':         images[0] if images else '',
            'image2':         (images[1] if len(images) > 1 else (images[0] if images else '')),
            'images':         images,
            'price':          float(p.price),
            'original_price': float(p.original_price) if p.original_price else None,
            'reviews_count':  p.review_count,
            'average_rating': round(p.average_rating, 1),
            'stock_quantity': p.stock_quantity,
            'is_new':         p.is_new,
            'is_best':        p.is_best,
            'save_amount':    p.save_amount,
        })

    return render(request, 'Home', {'products': products})


def product_list(request):
    """
    Renders /products/ grouped by category → parent → children.
    Accepts optional ?category=<category_name> to filter.
    """
    qs = (
        Product.objects
        .filter(stock_quantity__gt=0, images__isnull=False)
        .distinct()
        .prefetch_related('category__parent', 'images', 'reviews')
    )

    category_filter = request.GET.get('category')
    if category_filter:
        qs = qs.filter(category__name__iexact=category_filter)

    products = []
    for p in qs:
        products.append({
            'id':    p.id,
            'title': p.title,
            'slug':  p.slug,
            'category': {
                'name':   p.category.name,
                'parent': p.category.parent.name if p.category.parent else None,
            },
            'images': [img.image.url for img in p.images.all()],
            'price':  float(p.price),
            'stock':  p.stock_quantity,
        })
    return render(request, 'ProductList', {'products': products})


def shop_all(request):
    """
    Renders /products/shopall/ with all in-stock products.
    """
    qs = (
        Product.objects
        .filter(stock_quantity__gt=0)
        .prefetch_related('images', 'reviews')
    )

    products = []
    for p in qs:
        images = [img.image.url for img in p.images.all()]
        products.append({
            'id':         p.id,
            'slug':       p.slug,
            'title':      p.title,
            'category':   p.category.name,
            'image1':     images[0] if images else '',
            'image2':     (images[1] if len(images) > 1 else (images[0] if images else '')),
            'price':      float(p.price),
            'oldPrice':   float(p.original_price) if p.original_price else None,
            'discount':   float(p.original_price - p.price) if p.original_price else 0,
            'reviews':    p.review_count,
            'avgRating':  round(p.average_rating, 1),
            'date':       p.created_at.isoformat(),
            'is_new':     p.is_new,
            'stock':      p.stock_quantity,
        })
    return render(request, 'ShopAll', {'products': products})


def product_detail(request, slug):
    """
    Renders /products/<slug>/ with full details, reviews,
    and a list of related products in the same category.
    """
    p = get_object_or_404(
        Product.objects
        .select_related('category__parent', 'seller')
        .prefetch_related('images', 'reviews__author', 'reviews__media_files'),
        slug=slug
    )

    # Helper to serialize related products
    def serialize(prod):
        img_url = prod.images.first().image.url if prod.images.exists() else ''
        return {
            'id':    prod.id,
            'title': prod.title,
            'slug':  prod.slug,
            'price': float(prod.price),
            'image': img_url,
            'stock': prod.stock_quantity,
        }

    related_qs = (
        Product.objects
        .filter(category=p.category, stock_quantity__gt=0)
        .exclude(id=p.id)
        .prefetch_related('images')[:5]
    )
    related_products = [serialize(rp) for rp in related_qs]

    reviews = []
    for r in p.reviews.all().order_by('-created_at'):
        media_list = []
        for m in r.media_files.all():
            media_list.append({
                'id':   m.id,
                'url':  m.file.url,
                'type': 'video' if m.file.name.lower().endswith(('.mp4', '.mov', '.webm')) else 'image'
            })
        reviews.append({
            'id':          r.id,
            'user':        r.author.username if r.author else 'Anonymous',
            'rating':      r.rating,
            'title':       r.review_title,
            'description': r.review_description,
            'created_at':  r.created_at.isoformat(),
            'media':       media_list,
        })

    data = {
        'id':              p.id,
        'title':           p.title,
        'slug':            p.slug,
        'description':     p.description,
        'price':           float(p.price),
        'original_price':  float(p.original_price) if p.original_price else None,
        'images':          [img.image.url for img in p.images.all()],
        'seller':          p.seller.username if p.seller else None,
        'category': {
            'name':   p.category.name,
            'parent': p.category.parent.name if p.category.parent else None,
        } if p.category else None,
        'reviews':         reviews,
        'can_review':      request.user.is_authenticated,
        'relatedProducts': related_products,
        'stock_quantity':  p.stock_quantity,
        'average_rating':  round(p.average_rating, 1),
        'review_count':    p.review_count,
    }

    return render(request, 'ProductDetail', data)


@csrf_exempt
@login_required
def submit_review(request, product_id):
    """
    Create a new Review. Accepts multipart/form-data with optional media files.
    """
    if request.method != 'POST':
        return HttpResponseBadRequest("POST only")

    product = get_object_or_404(Product, id=product_id)

    raw_concerns = request.POST.get('concerns') or '[]'
    try:
        concerns_list = json.loads(raw_concerns)
    except json.JSONDecodeError:
        concerns_list = []

    review = Review.objects.create(
        product            = product,
        author             = request.user,
        review_title       = request.POST.get('reviewTitle', ''),
        review_description = request.POST.get('reviewDescription', ''),
        email              = request.POST.get('email', ''),
        age                = request.POST.get('age', ''),
        skin_type          = request.POST.get('skinType', ''),
        rating             = request.POST.get('rating'),
        concerns           = concerns_list,
    )

    for f in request.FILES.getlist('media'):
        ReviewMedia.objects.create(review=review, file=f)

    return JsonResponse({'message': 'Review submitted successfully!'})


@csrf_exempt
@login_required
@require_http_methods(["POST", "PUT"])
def update_review(request, review_id):
    """
    Update an existing Review. Only the author may update.
    """
    review = get_object_or_404(Review, id=review_id)
    if review.author != request.user:
        return HttpResponseForbidden("Not allowed")

    review.rating = request.POST.get("rating", review.rating)
    review.review_description = request.POST.get("review_description", review.review_description)
    review.save()

    return JsonResponse({'success': True})


@csrf_exempt
@login_required
@require_http_methods(["POST", "DELETE"])
def delete_review(request, review_id):
    """
    Delete a Review. Only the author may delete.
    """
    review = get_object_or_404(Review, id=review_id)
    if review.author != request.user:
        return HttpResponseForbidden("Not allowed")

    review.delete()
    return JsonResponse({'success': True})


@login_required
def show_review_form(request, product_id):
    """
    Renders a partial containing the review form for a given product.
    """
    product = get_object_or_404(Product.objects.prefetch_related('images'), id=product_id)
    image_url = product.images.first().image.url if product.images.exists() else None

    return render(request, 'ReviewFormSection', {
        'product': {
            'id':    product.id,
            'title': product.title,
            'image': image_url,
        }
    })


@login_required
def review_thanks(request, product_id):
    """
    Renders a “thank you” page after a review is submitted.
    """
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'ReviewConfirmationPage', {
        'product': {'id': product.id, 'title': product.title}
    })


def review_updated(request, product_id):
    """
    After a review is updated, show related products in the same category,
    ordered by their review count. Limited to top 10.
    """
    product = get_object_or_404(Product, pk=product_id)

    related_qs = (
        Product.objects
        .filter(category=product.category, stock_quantity__gt=0)
        .exclude(pk=product.pk)
        .annotate(reviews_count=Count('reviews'))
        .order_by('-reviews_count')[:10]
        .prefetch_related('images')
    )

    products = []
    for p in related_qs:
        products.append({
            'id':      p.id,
            'title':   p.title,
            'slug':    p.slug,
            'image':   p.images.first().image.url if p.images.exists() else '',
            'reviews': p.reviews_count,
            'price':   float(p.price),
            'stock':   p.stock_quantity,
        })

    return render(request, 'ReviewUpdatedPage', {
        'product': {
            'id':    product.id,
            'title': product.title,
        },
        'products': products,
    })


@csrf_exempt
@login_required
def submit_review_media(request, product_id):
    """
    Upload media (image/video) to an existing review by the current user for a given product.
    """
    if request.method == 'POST':
        product = get_object_or_404(Product, id=product_id)
        review_qs = Review.objects.filter(product=product, author=request.user).order_by('-created_at')
        if not review_qs.exists():
            return JsonResponse({'error': 'Review not found'}, status=404)

        review = review_qs.first()
        for uploaded_file in request.FILES.getlist('media'):
            ReviewMedia.objects.create(review=review, file=uploaded_file)

        return JsonResponse({'message': 'Media uploaded successfully'})

    return JsonResponse({'error': 'Invalid method'}, status=405)
