# transactions/views.py

import json
from decimal import Decimal

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

from .models import Transaction
from product.models import Product


@csrf_exempt
@login_required
def create_order(request):
    """
    Expects a POST with JSON body:
    {
      "shipping": {
        "first_name": "...",
        "last_name": "...",
        "email": "...",
        "phone": "...",
        "address": "...",
        "city": "...",
        "state": "...",
        "zip": "...",
        "country": "..."
      },
      "items": [
        { "id": 12, "quantity": 2 },
        { "id": 34, "quantity": 1 }
      ]
    }

    For each item:
      - check stock
      - deduct stock_quantity
      - create a Transaction row (payment_method='COD')
    At the end, send a confirmation email to the buyer and notify all ADMINS.
    Returns JSON { success: true, transaction_ids: [ ... ] } on success,
    or an error message on failure.
    """
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST is allowed.")

    try:
        data = json.loads(request.body)
        shipping = data.get('shipping', {})
        items = data.get('items', [])
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON payload.")

    # Validate shipping fields
    required_fields = [
        'first_name', 'last_name', 'email',
        'phone', 'address', 'city', 'state', 'zip', 'country'
    ]
    for f in required_fields:
        if not shipping.get(f) or not str(shipping.get(f)).strip():
            return HttpResponseBadRequest(f"Missing shipping field: {f}.")

    if not items or not isinstance(items, list):
        return HttpResponseBadRequest("Items list is required.")

    created_ids = []
    order_summary = []  # We'll build a list of “Product Title (×qty) – $amount” strings
    total_amount_sum = Decimal('0.00')

    # Process each cart item:
    for item in items:
        product_id = item.get('id')
        quantity = item.get('quantity')
        if not product_id or not quantity:
            continue

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return HttpResponseBadRequest("Quantity must be an integer.")

        product = get_object_or_404(Product, pk=product_id)

        if quantity < 1 or quantity > product.stock_quantity:
            return HttpResponseBadRequest(f"Insufficient stock for “{product.title}.”")

        # Deduct stock
        product.stock_quantity -= quantity
        product.save()

        total_amount = product.price * Decimal(quantity)

        # Create transaction row
        tx = Transaction.objects.create(
            buyer=request.user,
            product=product,
            quantity=quantity,
            total_amount=total_amount,
            payment_method='COD',
            status='pending',
            first_name=shipping['first_name'].strip(),
            last_name =shipping['last_name'].strip(),
            email     =shipping['email'].strip(),
            phone     =shipping['phone'].strip(),
            address   =shipping['address'].strip(),
            city      =shipping['city'].strip(),
            state     =shipping['state'].strip(),
            zip_code  =shipping['zip'].strip(),
            country   =shipping['country'].strip(),
        )
        created_ids.append(tx.id)
        order_summary.append(f"{product.title} (×{quantity}) – ${total_amount:.2f}")
        total_amount_sum += total_amount

    if not created_ids:
        return HttpResponseBadRequest("No valid items were processed.")

    # ──────────────────── SEND EMAIL TO BUYER ────────────────────
    buyer_subject = "DevStore Order Confirmation"
    buyer_message = (
            f"Hello {request.user.username},\n\n"
            "Thank you for your order. Here are the details:\n\n"
            + "\n".join(order_summary)
            + f"\n\nOrder Total: ${total_amount_sum:.2f}\n\n"
              "We will begin processing your order shortly.\n\n"
              "— DevStore Team"
    )
    send_mail(
        subject=buyer_subject,
        message=buyer_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[request.user.email],
        fail_silently=True,
    )

    # ──────────────────── NOTIFY ADMINS ────────────────────
    admin_emails = [email for _, email in settings.ADMINS]
    if admin_emails:
        admin_subject = f"New Order Placed by {request.user.username}"
        admin_message = (
                f"A new order has been placed by {request.user.username} ({request.user.email}):\n\n"
                + "\n".join(order_summary)
                + f"\n\nOrder Total: ${total_amount_sum:.2f}\n\n"
                  f"Transaction IDs: {', '.join(map(str, created_ids))}\n"
        )
        send_mail(
            subject=admin_subject,
            message=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=admin_emails,
            fail_silently=True,
        )

    return JsonResponse({'success': True, 'transaction_ids': created_ids})
# transactions/views.py

import json
from decimal import Decimal

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

from .models import Transaction
from product.models import Product


@csrf_exempt
@login_required
def create_order(request):
    """
    Expects a POST with JSON body:
    {
      "shipping": {
        "first_name": "...",
        "last_name": "...",
        "email": "...",
        "phone": "...",
        "address": "...",
        "city": "...",
        "state": "...",
        "zip": "...",
        "country": "..."
      },
      "items": [
        { "id": 12, "quantity": 2 },
        { "id": 34, "quantity": 1 }
      ]
    }

    For each item:
      - check stock
      - deduct stock_quantity
      - create a Transaction row (payment_method='COD')
    At the end, send a confirmation email to the buyer and notify all ADMINS.
    Returns JSON { success: true, transaction_ids: [ ... ] } on success,
    or an error message on failure.
    """
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST is allowed.")

    try:
        data = json.loads(request.body)
        shipping = data.get('shipping', {})
        items = data.get('items', [])
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON payload.")

    # Validate shipping fields
    required_fields = [
        'first_name', 'last_name', 'email',
        'phone', 'address', 'city', 'state', 'zip', 'country'
    ]
    for f in required_fields:
        if not shipping.get(f) or not str(shipping.get(f)).strip():
            return HttpResponseBadRequest(f"Missing shipping field: {f}.")

    if not items or not isinstance(items, list):
        return HttpResponseBadRequest("Items list is required.")

    created_ids = []
    order_summary = []  # We'll build a list of “Product Title (×qty) – $amount” strings
    total_amount_sum = Decimal('0.00')

    # Process each cart item:
    for item in items:
        product_id = item.get('id')
        quantity = item.get('quantity')
        if not product_id or not quantity:
            continue

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return HttpResponseBadRequest("Quantity must be an integer.")

        product = get_object_or_404(Product, pk=product_id)

        if quantity < 1 or quantity > product.stock_quantity:
            return HttpResponseBadRequest(f"Insufficient stock for “{product.title}.”")

        # Deduct stock
        product.stock_quantity -= quantity
        product.save()

        total_amount = product.price * Decimal(quantity)

        # Create transaction row
        tx = Transaction.objects.create(
            buyer=request.user,
            product=product,
            quantity=quantity,
            total_amount=total_amount,
            payment_method='COD',
            status='pending',
            first_name=shipping['first_name'].strip(),
            last_name =shipping['last_name'].strip(),
            email     =shipping['email'].strip(),
            phone     =shipping['phone'].strip(),
            address   =shipping['address'].strip(),
            city      =shipping['city'].strip(),
            state     =shipping['state'].strip(),
            zip_code  =shipping['zip'].strip(),
            country   =shipping['country'].strip(),
        )
        created_ids.append(tx.id)
        order_summary.append(f"{product.title} (×{quantity}) – ${total_amount:.2f}")
        total_amount_sum += total_amount

    if not created_ids:
        return HttpResponseBadRequest("No valid items were processed.")

    # ──────────────────── SEND EMAIL TO BUYER ────────────────────
    buyer_subject = "DevStore Order Confirmation"
    buyer_message = (
            f"Hello {request.user.username},\n\n"
            "Thank you for your order. Here are the details:\n\n"
            + "\n".join(order_summary)
            + f"\n\nOrder Total: ${total_amount_sum:.2f}\n\n"
              "We will begin processing your order shortly.\n\n"
              "— DevStore Team"
    )
    send_mail(
        subject=buyer_subject,
        message=buyer_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[request.user.email],
        fail_silently=True,
    )

    # ──────────────────── NOTIFY ADMINS ────────────────────
    admin_emails = [email for _, email in settings.ADMINS]
    if admin_emails:
        admin_subject = f"New Order Placed by {request.user.username}"
        admin_message = (
                f"A new order has been placed by {request.user.username} ({request.user.email}):\n\n"
                + "\n".join(order_summary)
                + f"\n\nOrder Total: ${total_amount_sum:.2f}\n\n"
                  f"Transaction IDs: {', '.join(map(str, created_ids))}\n"
        )
        send_mail(
            subject=admin_subject,
            message=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=admin_emails,
            fail_silently=True,
        )

    return JsonResponse({'success': True, 'transaction_ids': created_ids})
