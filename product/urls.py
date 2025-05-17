from django.urls import path
from . import views

urlpatterns = [

    path('<slug:slug>/',   views.product_detail,   name='product_detail'),
    path('',               views.product_list,     name='product_list'),
]
