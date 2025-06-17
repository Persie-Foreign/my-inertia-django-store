# transactions/admin.py

from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'product_title',
        'buyer',
        'quantity',
        'total_amount_display',
        'payment_method',
        'status',
        'created_at',
    )
    list_filter = ('payment_method', 'status', 'created_at',)
    search_fields = (
        'product__title',
        'buyer__username',
        'first_name',
        'last_name',
        'email',
    )
    readonly_fields = ('created_at',)

    @admin.display(description="Product")
    def product_title(self, obj):
        return obj.product.title if obj.product else "-"

    @admin.display(description="Total Amount")
    def total_amount_display(self, obj):
        return f"${obj.total_amount:.2f}" if obj.total_amount is not None else "-"
