from django.db import models
from django.urls import reverse
from django.utils.text import slugify

class Category(models.Model):
    name   = models.CharField(max_length=100)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)

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
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def save_amount(self):
        if self.original_price and self.original_price > self.price:
            return float(self.original_price - self.price)
        return None

    def get_absolute_url(self):
        return reverse('product_detail', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image   = models.ImageField(upload_to='products/')
    alt     = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.product.title} Image"


class Review(models.Model):
    product   = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    author    = models.ForeignKey('users.User', on_delete=models.CASCADE, null=True)
    rating    = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], null=True)
    comment   = models.TextField(blank=True)
    created_at= models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.title} review by {self.author.username}"
