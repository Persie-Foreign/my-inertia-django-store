from inertia import render
from django.http import JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.http        import JsonResponse, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from .models           import Product, Review, ReviewMedia, Category
from django.db.models import Count

from django.shortcuts import get_object_or_404
from collections import defaultdict

# views.py
from django.http import JsonResponse
from django.db.models import Q


def product_list(request):
    """
    Renders /products/ grouped by category → parent → children.
    """
    qs = Product.objects.filter(images__isnull=False).distinct().prefetch_related('category__parent', 'images', 'reviews')

    # 🔥 Filter by multiple ?category=
    category_filter = request.GET.getlist('category')
    if category_filter:
        qs = qs.filter(category__name__in=category_filter)

    # Products list
    products = []
    for p in qs:
        products.append({
            'id': p.id,
            'title': p.title,
            'slug': p.slug,
            'category': {
                'name': p.category.name,
                'parent': p.category.parent.name if p.category.parent else None,
            },
            'images': [img.image.url for img in p.images.all()],
            'price': float(p.price),
            'reviews_count':  p.reviews.count(),
            'is_new':         p.is_new,
            'is_best':        p.is_best,
            'save_amount':    p.save_amount,
            'created_at':     p.created_at,
            'updated_at':     p.updated_at,
            'original_price': float(p.original_price) if hasattr(p, 'original_price') and p.original_price is not None else None
        })

    # Build products_by_category dictionary
    products_by_category = defaultdict(list)
    for p in qs:
        category_name = p.category.name

        # FIX: Safely handle original_price conversion
        original_price = None
        if hasattr(p, 'original_price') and p.original_price is not None:
            original_price = float(p.original_price)

        products_by_category[category_name].append({
            'id': p.id,
            'title': p.title,
            'slug': p.slug,
            'category': {
                'name': category_name,
                'parent': p.category.parent.name if p.category.parent else None,
            },
            'images': [img.image.url for img in p.images.all()],
            'price': float(p.price),
            'original_price': original_price,
            'image_url': p.images.first().image.url if p.images.exists() else '',
        })

    # Categories grouped by parent
    category_qs = Category.objects.select_related('parent')
    category_dict = defaultdict(list)
    for cat in category_qs:
        parent_name = cat.parent.name if cat.parent else cat.name
        category_dict[parent_name].append({
            'id': cat.id,
            'name': cat.name,
            'parent': cat.parent.name if cat.parent else None,
        })

    return render(request, 'ProductList', {
        'products': products,
        'categories': dict(category_dict),
        'activeCategories': category_filter,
        'productsByCategory': dict(products_by_category),  # Ensure this is included
    })


def product_search(request):
    query = request.GET.get('q', '')

    # Search products by name or description
    results = Product.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query)
    ).select_related('category')[:10]  # Limit to 10 results

    # Prepare response data
    products_data = []
    for product in results:
        products_data.append({
            'id': product.id,
            'name': product.name,
            'price': float(product.price),  # Convert to float for JSON serialization
            'image_url': request.build_absolute_uri(product.image.url) if product.image else '',
            'category': product.category.name if product.category else ''
        })

    return JsonResponse({'products': products_data})


def product_detail(request, slug):
    """
    Renders /products/<slug>/ with full details, reviews,
    and a list of related products in the same category.
    """
    # 1. Fetch the main product with its relations
    p = get_object_or_404(
        Product.objects
        .select_related('category__parent', 'seller')
        .prefetch_related('images', 'reviews__author', 'reviews__media_files'),
        slug=slug
    )

    # 2. Helper to serialize related products
    def serialize(prod):
        img_url = prod.images.first().image.url if prod.images.exists() else ''
        return {
            'id':    prod.id,
            'title': prod.title,
            'slug':  prod.slug,
            'price': float(prod.price),
            'image': img_url,
        }

    # 3. Build related products list
    related_qs = (
        Product.objects
        .filter(category=p.category)
        .exclude(id=p.id)
        .prefetch_related('images')[:5]
    )
    related_products = [serialize(rp) for rp in related_qs]

    # 4. Serialize reviews
    reviews = []
    for r in p.reviews.all():
        reviews.append({
            'id':          r.id,
            'user':        r.author.username if r.author else 'Anonymous',
            'rating':      r.rating,
            'title':       r.review_title,
            'description': r.review_description,
            'created_at':  r.created_at.isoformat(),
            'media': [
                {
                    'id':   m.id,
                    'url':  m.file.url,
                    'type': 'video' if m.file.name.lower().endswith(('.mp4','.mov','.webm')) else 'image'
                }
                for m in r.media_files.all()
            ],
        })

    # 5. Assemble payload
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
    }

    return render(request, 'ProductDetail', data)

# CREATE Review
@csrf_exempt  # Use proper CSRF protection for real apps
@login_required
def submit_review(request, product_id):
    if request.method != 'POST':
        return HttpResponseBadRequest("POST only")

    product = get_object_or_404(Product, id=product_id)

    # JSON-decode the concerns list
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
        concerns           = concerns_list,#


    )

    # Save each uploaded media file
    for f in request.FILES.getlist('media'):
        ReviewMedia.objects.create(review=review, file=f)

    return JsonResponse({'message': 'Review submitted successfully!'})
# UPDATE Review
@csrf_exempt
@login_required
@require_http_methods(["POST", "PUT"])
def update_review(request, review_id):
    review = get_object_or_404(Review, id=review_id)

    if review.author != request.user:
        return HttpResponseForbidden("Not allowed")

    review.rating = request.POST.get("rating", review.rating)
    review.comment = request.POST.get("review_description", review.comment)
    review.save()

    return JsonResponse({'success': True})


# DELETE Review
@csrf_exempt
@login_required
@require_http_methods(["POST", "DELETE"])
def delete_review(request, review_id):
    review = get_object_or_404(Review, id=review_id)

    if review.author != request.user:
        return HttpResponseForbidden("Not allowed")

    review.delete()
    return JsonResponse({'success': True})

@login_required
def show_review_form(request, product_id):
    product = get_object_or_404(
        Product.objects.prefetch_related('images'),
        id=product_id
    )

    image_url = product.images.first().image.url if product.images.exists() else None

    return render(request, 'ReviewFormSection', {
        'product': {
            'id': product.id,
            'title': product.title,
            'image': image_url,
        }
    })

@login_required
def review_thanks(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'ReviewConfirmationPage', {
        'product': { 'id': product.id, 'title': product.title }
    })


def review_updated(request, product_id):
    # 1. Fetch the reviewed product
    product = get_object_or_404(Product, pk=product_id)

    # 2. Query up to 10 other products in the same category,
    #    ordered by descending review count.
    related_qs = (
        Product.objects
        .filter(category=product.category)            # same category
        .exclude(pk=product.pk)                       # not the same product
        .annotate(reviews_count=Count('reviews'))     # count their reviews
        .order_by('-reviews_count')[:10]
        .prefetch_related('images')
    )

    # 3. Serialize for the front-end
    products = []
    for p in related_qs:
        products.append({
            'id':      p.id,
            'title':   p.title,
            'slug':    p.slug,
            'image':   p.images.first().image.url if p.images.exists() else '',
            'reviews': p.reviews_count,
            'price':   float(p.price),
        })

    # 4. Render, passing both the single product and the list
    return render(request, 'ReviewUpdatedPage', {
        'product': {
            'id':    product.id,
            'title': product.title,
        },
        'products': products,
    })

def submit_review_media(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, id=product_id)
        user = request.user

        # Get the user's review for this product
        review = Review.objects.filter(product=product, user=user).last()
        if not review:
            return JsonResponse({'error': 'Review not found'}, status=404)

        for uploaded_file in request.FILES.getlist('media'):
            file_type = 'video' if uploaded_file.content_type.startswith('video') else 'image'
            ReviewMedia.objects.create(
                review=review,
                file=uploaded_file,
                type=file_type
            )

        return JsonResponse({'message': 'Media uploaded successfully'})

    return JsonResponse({'error': 'Invalid method'}, status=405)

