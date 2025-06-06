from django.urls import path
from . import views


urlpatterns = [
    path('reviews/<int:review_id>/update/', views.update_review, name='update_review'),
    path('reviews/<int:review_id>/delete/', views.delete_review, name='delete_review'),
    path('<int:product_id>/review/', views.show_review_form, name='review_form'),
    path('<int:product_id>/review/thanks/', views.review_thanks,         name='review_thanks'),
    path('<int:product_id>/review-updated/', views.review_updated, name='review-updated' ),
    path('', views.product_list, name='product_list'),
    path('<slug:slug>/', views.product_detail, name='product_detail'),  # ← keep this at the end
    path('api/products/search/', views.product_search, name='api_products_search'),

]
