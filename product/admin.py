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
        'is_new',
        'is_best',
        'created_at',
    )
    list_filter = (
        'category',
        'is_new',
        'is_best',
    )
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)


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
