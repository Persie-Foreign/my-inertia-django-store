# transactions/models.py

from django.db import models
from django.conf import settings
from product.models import Product

class Transaction(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('COD', 'Cash on Delivery'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='transactions'
    )
    quantity = models.PositiveIntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=10,
        choices=PAYMENT_METHOD_CHOICES,
        default='COD'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )

    # Shipping/contact info:
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name  = models.CharField(max_length=100, blank=True, null=True)
    email      = models.EmailField( blank=True, null=True)
    phone      = models.CharField(max_length=20, blank=True, null=True)
    address    = models.TextField( blank=True, null=True)
    city       = models.CharField(max_length=100, blank=True, null=True)
    state      = models.CharField(max_length=100, blank=True, null=True)
    zip_code   = models.CharField(max_length=20, blank=True, null=True)
    country    = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        buyer_name = self.buyer.username if self.buyer else "Anonymous"
        return f"Order #{self.id} – {self.product.title} × {self.quantity} by {buyer_name}"
