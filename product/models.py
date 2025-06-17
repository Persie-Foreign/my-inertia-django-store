from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.conf import settings
from django.db.models import Avg


class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        related_name="children",
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    seller         = models.ForeignKey('users.User', on_delete=models.CASCADE)
    category       = models.ForeignKey(Category, on_delete=models.PROTECT)
    title          = models.CharField(max_length=200)
    slug           = models.SlugField(max_length=200, unique=True, blank=True)
    description    = models.TextField()
    price          = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_new         = models.BooleanField(default=False)
    is_best        = models.BooleanField(default=False)
    stock_quantity = models.PositiveIntegerField(default=0)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['category']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def save_amount(self):
        if self.original_price and self.original_price > self.price:
            return float(self.original_price - self.price)
        return None

    @property
    def average_rating(self):
        """
        Returns the average rating (float) across all related Review objects.
        Returns 0.0 if no reviews exist.
        """
        result = self.reviews.aggregate(avg=Avg("rating"))
        avg = result.get("avg")
        return float(avg) if avg is not None else 0.0

    @property
    def review_count(self):
        """
        Returns the total number of reviews for this product.
        """
        return self.reviews.count()

    @property
    def total_units_sold(self):
        """
        Sums the 'quantity' field of all related Transaction objects.
        Assumes Transaction model has ForeignKey to Product with related_name='transactions'.
        """
        result = self.transactions.aggregate(total=Sum("quantity"))
        total = result.get("total")
        return int(total) if total is not None else 0


    def get_absolute_url(self):
        return reverse('product_detail', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image   = models.ImageField(upload_to='products/')
    alt     = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name_plural = "Product Images"

    def __str__(self):
        return f"{self.product.title} Image"



class Review(models.Model):
    CONCERN_CHOICES = [
        ('acne', 'Acne'),
        ('ageing', 'Ageing'),
        # …etc
    ]

    product            = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    author             = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    rating             = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], null=True)
    review_title       = models.CharField(max_length=255, default='Untitled Review')
    review_description = models.TextField(default='No description provided.')
    comment            = models.TextField(blank=True)
    email              = models.EmailField(default='example@example.com')
    age                = models.CharField(max_length=50, blank=True, null=True)
    skin_type          = models.CharField(max_length=50, blank=True, null=True)
    concerns           = models.JSONField(blank=True, null=True)  # list of keys from CONCERN_CHOICES
    created_at         = models.DateTimeField(auto_now_add=True)   # <-- no default here

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        who = self.author.username if self.author else self.email
        return f"{self.product.title} review by {who}"


class ReviewMedia(models.Model):
    review      = models.ForeignKey(Review, related_name='media_files', on_delete=models.CASCADE)
    file        = models.FileField(upload_to='review_media/')
    uploaded_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    def __str__(self):
        return f"Media for review {self.review.id}"





