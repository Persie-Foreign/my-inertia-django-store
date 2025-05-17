from django.contrib import admin
from product.models import Product
from review.models import Review  # Adjust based on your apps

admin.site.site_header = "My Shop Admin"
admin.site.site_title = "Shop Admin Portal"
admin.site.index_title = "Welcome to the Shop Admin Dashboard"

