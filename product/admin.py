# product/admin.py

from django.contrib import admin
from .models import Category, Product, ProductImage, Review
from django.utils.html import format_html


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    search_fields = ('name',)
    list_filter = ('parent',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'seller',
        'category',
        'price',
        'stock_quantity',       # NEW: Show stock
        'average_rating_display',  # NEW: Show average rating
        'review_count_display',    # NEW: Show review count
        'is_new',
        'is_best',
        'created_at',
    )
    list_filter = (
        'category',
        'is_new',
        'is_best',
        'created_at',
    )
    search_fields = ('title', 'description', 'category__name')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

    @admin.display(description="Avg Rating")
    def average_rating_display(self, obj):
        return f"{obj.average_rating:.1f}"

    @admin.display(description="Reviews")
    def review_count_display(self, obj):
        return obj.review_count




@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_tag', 'alt')
    list_filter = ('product',)
    search_fields = ('product__title', 'alt')

    def image_tag(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 75px;"/>',
                obj.image.url
            )
        return ""
    image_tag.short_description = 'Preview'


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        'product',
        'author',
        'rating',
        'created_at',
    )
    list_filter = (
        'rating',
        'created_at',
    )
    search_fields = (
        'product__title',
        'author__username',
        'comment',
    )
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
