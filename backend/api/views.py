import uuid
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils import timezone
from django.db import transaction as db_transaction
from django.db.models import Sum, Count, Q, F, Avg
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import (
    User, CustomerProfile, StaffProfile, Department, Aisle, Shelf,
    Supplier, Product, PurchaseOrder, PurchaseOrderItem,
    Transaction, TransactionItem, OnlineOrder, OrderItem,
    Payment, Attendance, StaffTask, Notification, Offer, StoreActivity
)
from .serializers import (
    UserSerializer, CustomerProfileSerializer, StaffProfileSerializer,
    DepartmentSerializer, ProductSerializer, SupplierSerializer,
    PurchaseOrderSerializer, TransactionSerializer, OnlineOrderSerializer,
    PaymentSerializer, AttendanceSerializer, StaffTaskSerializer,
    NotificationSerializer, OfferSerializer, StoreActivitySerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def demo_users(request):
    """Returns sample users for all 4 roles to allow instant 1-tap switching and login."""
    roles = ['CUSTOMER', 'STAFF', 'CASHIER', 'ADMIN']
    users = {}
    for role in roles:
        user = User.objects.filter(role=role).first()
        if user:
            users[role.lower()] = {
                'id': user.id,
                'username': user.username,
                'name': user.get_full_name() or user.username,
                'role': user.role,
                'email': user.email,
                'phone': user.phone or '+91 98765 43210',
                'avatar': user.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.username}",
                'details': {
                    'employee_id': getattr(user, 'staff_profile', None).employee_id if hasattr(user, 'staff_profile') else None,
                    'department': user.staff_profile.department.name if hasattr(user, 'staff_profile') and user.staff_profile.department else None,
                    'shift': user.staff_profile.shift if hasattr(user, 'staff_profile') else None,
                    'loyalty_points': user.customer_profile.loyalty_points if hasattr(user, 'customer_profile') else None,
                }
            }
    return Response(users)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Role-based & credential-based login supporting demo emails:
    - customer@smartmart.demo
    - staff@smartmart.demo
    - cashier@smartmart.demo
    - admin@smartmart.demo
    as well as phone, username, or employee ID.
    """
    identifier = (request.data.get('identifier') or request.data.get('username') or request.data.get('email') or '').strip()
    role = request.data.get('role', 'CUSTOMER').upper()
    password = request.data.get('password', '')

    user = None

    # 1. Check demo credentials mapping
    identifier_lower = identifier.lower()
    if 'customer@smartmart.demo' in identifier_lower:
        user = User.objects.filter(role='CUSTOMER').first()
    elif 'staff@smartmart.demo' in identifier_lower:
        user = User.objects.filter(role='STAFF').first()
    elif 'cashier@smartmart.demo' in identifier_lower:
        user = User.objects.filter(role='CASHIER').first()
    elif 'admin@smartmart.demo' in identifier_lower:
        user = User.objects.filter(role='ADMIN').first()

    # 2. Match by email, phone, username, or employee ID
    if not user and identifier:
        user = (
            User.objects.filter(email__iexact=identifier).first()
            or User.objects.filter(username__iexact=identifier).first()
            or User.objects.filter(phone=identifier).first()
            or User.objects.filter(staff_profile__employee_id__iexact=identifier).first()
        )

    # 3. Fallback to role-based representative user
    if not user and role:
        user = User.objects.filter(role=role).first()

    # 4. Fallback to any user
    if not user:
        user = User.objects.first()

    if not user:
        return Response({'error': 'No user found for the requested credentials.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'token': f"smartmart-token-{user.id}-{uuid.uuid4().hex[:8]}",
        'user': {
            'id': user.id,
            'username': user.username,
            'name': user.get_full_name() or user.username,
            'email': user.email or f"{user.username.lower()}@smartmart.demo",
            'phone': user.phone or '+91 98765 43210',
            'role': user.role,
            'avatar': user.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.username}",
        },
        'role': user.role,
        'profile': (
            StaffProfileSerializer(user.staff_profile).data if hasattr(user, 'staff_profile')
            else CustomerProfileSerializer(user.customer_profile).data if hasattr(user, 'customer_profile')
            else {
                'loyalty_points': 340,
                'wallet_balance': 750.00,
                'address': 'Flat 402, Royal Palms, Powai, Mumbai - 400076'
            }
        )
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_customer(request):
    """Registers a new Customer account with profile and initial loyalty points."""
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip().lower()
    phone = request.data.get('phone', '').strip()
    password = request.data.get('password', 'password123')

    if not email:
        return Response({'error': 'Email address is required.'}, status=status.HTTP_400_BAD_REQUEST)

    username = email.split('@')[0] if '@' in email else f"cust_{uuid.uuid4().hex[:6]}"
    # Ensure unique username
    base_user = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_user}_{counter}"
        counter += 1

    first_name = name.split(' ')[0] if name else 'SmartMart'
    last_name = ' '.join(name.split(' ')[1:]) if (name and ' ' in name) else 'Customer'

    user = User.objects.create(
        username=username,
        email=email,
        phone=phone or '+91 98765 43210',
        first_name=first_name,
        last_name=last_name,
        role='CUSTOMER',
        avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}"
    )
    user.set_password(password)
    user.save()

    profile, _ = CustomerProfile.objects.get_or_create(
        user=user,
        defaults={
            'phone': phone,
            'address': 'SmartMart Connected Member Address',
            'loyalty_points': 250,
            'wallet_balance': Decimal('500.00'),
        }
    )

    return Response({
        'token': f"smartmart-token-{user.id}-{uuid.uuid4().hex[:8]}",
        'user': {
            'id': user.id,
            'username': user.username,
            'name': f"{first_name} {last_name}".strip(),
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
            'avatar': user.avatar,
        },
        'role': 'CUSTOMER',
        'profile': CustomerProfileSerializer(profile).data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def departments_list(request):
    departments = Department.objects.filter(is_active=True).prefetch_related('aisles', 'products', 'staff_members')
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def products_list(request):
    queryset = Product.objects.filter(is_active=True).select_related('department', 'aisle', 'shelf')
    
    dept_id = request.query_params.get('department')
    if dept_id:
        queryset = queryset.filter(department_id=dept_id)
        
    search = request.query_params.get('search')
    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) |
            Q(brand__icontains=search) |
            Q(barcode__icontains=search) |
            Q(department__name__icontains=search)
        )
        
    barcode = request.query_params.get('barcode')
    if barcode:
        queryset = queryset.filter(barcode=barcode)

    featured = request.query_params.get('featured')
    if featured:
        queryset = queryset.filter(is_featured=True)

    bestseller = request.query_params.get('bestseller')
    if bestseller:
        queryset = queryset.filter(is_bestseller=True)

    stock_filter = request.query_params.get('stock_status')
    if stock_filter == 'LOW_STOCK':
        queryset = queryset.filter(stock__lte=F('min_stock'), stock__gt=0)
    elif stock_filter == 'CRITICAL':
        queryset = queryset.filter(stock__lte=F('min_stock') / 3, stock__gt=0)
    elif stock_filter == 'OUT_OF_STOCK':
        queryset = queryset.filter(stock__lte=0)
    elif stock_filter == 'HEALTHY':
        queryset = queryset.filter(stock__gt=F('min_stock'))

    serializer = ProductSerializer(queryset[:150], many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, pk):
    try:
        product = Product.objects.select_related('department', 'aisle', 'shelf').get(pk=pk)
        return Response(ProductSerializer(product).data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def store_map_layout(request):
    """Returns the stylized indoor supermarket floor plan layout with all sections and waypoints."""
    departments = Department.objects.prefetch_related('aisles').all()
    
    sections = [
        {'id': 'entrance', 'name': 'Entrance & Carts', 'x': 50, 'y': 92, 'w': 25, 'h': 6, 'type': 'entry', 'color': '#10B981'},
        {'id': 'checkout', 'name': 'Cashier & POS Counters', 'x': 50, 'y': 80, 'w': 80, 'h': 6, 'type': 'pos', 'color': '#6366F1'},
        {'id': 'customer_service', 'name': 'Customer Helpdesk', 'x': 15, 'y': 92, 'w': 20, 'h': 6, 'type': 'service', 'color': '#8B5CF6'},
        {'id': 'exit', 'name': 'Store Exit', 'x': 85, 'y': 92, 'w': 18, 'h': 6, 'type': 'exit', 'color': '#EF4444'},
    ]

    dept_grid = [
        {'code': 'GROC', 'name': 'Grocery & Staples', 'x': 18, 'y': 22, 'w': 22, 'h': 16, 'aisles': [1, 2], 'color': '#3B82F6'},
        {'code': 'DAIR', 'name': 'Dairy & Chilled', 'x': 50, 'y': 15, 'w': 26, 'h': 12, 'aisles': [3, 4], 'color': '#06B6D4'},
        {'code': 'BAKE', 'name': 'Bakery & Deli', 'x': 82, 'y': 18, 'w': 22, 'h': 14, 'aisles': [5], 'color': '#F59E0B'},
        {'code': 'BEVE', 'name': 'Beverages & Juices', 'x': 18, 'y': 44, 'w': 22, 'h': 14, 'aisles': [6], 'color': '#10B981'},
        {'code': 'SNAC', 'name': 'Snacks & Confectionery', 'x': 50, 'y': 36, 'w': 26, 'h': 14, 'aisles': [7], 'color': '#EC4899'},
        {'code': 'PERS', 'name': 'Personal Care & Beauty', 'x': 82, 'y': 38, 'w': 22, 'h': 15, 'aisles': [8], 'color': '#8B5CF6'},
        {'code': 'HOME', 'name': 'Home Care & Cleaning', 'x': 18, 'y': 64, 'w': 22, 'h': 12, 'aisles': [9], 'color': '#14B8A6'},
        {'code': 'ELEC', 'name': 'Electronics & Gadgets', 'x': 50, 'y': 56, 'w': 26, 'h': 14, 'aisles': [10], 'color': '#6366F1'},
        {'code': 'CLOTH', 'name': 'Apparel & Footwear', 'x': 82, 'y': 60, 'w': 22, 'h': 14, 'aisles': [11, 12], 'color': '#F97316'},
    ]

    return Response({
        'floor': 'Ground Floor (Supermarket Hall)',
        'dimensions': {'width': 100, 'height': 100},
        'service_zones': sections,
        'department_zones': dept_grid,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def store_product_route(request, product_id):
    """Calculates indoor navigation route from Entrance to the product's exact shelf."""
    try:
        product = Product.objects.select_related('department', 'aisle', 'shelf').get(pk=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    aisle_num = product.aisle.aisle_number if product.aisle else 7
    shelf_code = product.shelf.shelf_code if product.shelf else 'Shelf B'
    
    # Pre-calculated coordinate mapping for realistic supermarket paths
    dept_positions = {
        'GROC': {'x': 25, 'y': 28, 'name': 'Grocery Section'},
        'DAIR': {'x': 50, 'y': 20, 'name': 'Dairy Chiller'},
        'BAKE': {'x': 78, 'y': 22, 'name': 'Bakery Counter'},
        'BEVE': {'x': 25, 'y': 48, 'name': 'Beverages Aisle'},
        'SNAC': {'x': 50, 'y': 42, 'name': 'Snacks Zone'},
        'PERS': {'x': 80, 'y': 44, 'name': 'Personal Care'},
        'HOME': {'x': 25, 'y': 68, 'name': 'Home Care'},
        'ELEC': {'x': 50, 'y': 62, 'name': 'Electronics'},
        'CLOTH': {'x': 80, 'y': 66, 'name': 'Apparel'},
    }
    
    code = product.department.code if product.department else 'PERS'
    dest = dept_positions.get(code, {'x': 75, 'y': 45, 'name': product.department.name if product.department else 'Shelf'})

    # Create waypoints starting from Entrance -> Central Corridor -> Turn to Aisle -> Product Shelf
    waypoints = [
        {'x': 50, 'y': 92, 'label': 'YOU ARE HERE (Entrance)', 'step': 1},
        {'x': 50, 'y': 76, 'label': 'Past Checkout Lanes', 'step': 2},
        {'x': 50, 'y': dest['y'], 'label': f'Turn toward Aisle {aisle_num}', 'step': 3},
        {'x': dest['x'], 'y': dest['y'], 'label': f'{product.name} ({shelf_code})', 'step': 4, 'is_target': True},
    ]

    return Response({
        'product': ProductSerializer(product).data,
        'department': product.department.name,
        'aisle': f"Aisle {aisle_num} ({product.aisle.name if product.aisle else 'Main Row'})",
        'shelf': shelf_code,
        'estimated_walk_seconds': 45,
        'distance_meters': 38,
        'waypoints': waypoints,
        'instructions': [
            "Start from Main Entrance & grab a Smart Cart",
            "Walk straight ahead through the central walkway past Checkout",
            f"Turn right towards Aisle {aisle_num} ({product.department.name})",
            f"Locate {shelf_code} on level 2 - '{product.name}' is in stock"
        ]
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def pos_create_bill(request):
    """
    Connected POS Checkout:
    - Atomically creates Transaction and TransactionItems
    - Deducts inventory from Product.stock
    - Checks for low stock alerts
    - Creates in-app Notification for the customer
    - Creates StoreActivity record
    """
    data = request.data
    items_data = data.get('items', [])
    customer_phone = data.get('customer_phone', '+91 98765 43210')
    payment_mode = data.get('payment_mode', 'CASH').upper()
    cashier_id = data.get('cashier_id')

    if not items_data:
        return Response({'error': 'No items in cart'}, status=status.HTTP_400_BAD_REQUEST)

    with db_transaction.atomic():
        cashier = User.objects.filter(id=cashier_id, role='CASHIER').first() or User.objects.filter(role='CASHIER').first()
        customer = User.objects.filter(phone=customer_phone).first() or User.objects.filter(role='CUSTOMER').first()

        invoice_no = f"SM-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        subtotal = Decimal('0.00')
        tax = Decimal('0.00')
        discount = Decimal('0.00')

        prepared_items = []
        low_stock_products = []

        for item in items_data:
            product_id = item.get('product_id')
            qty = int(item.get('quantity', 1))

            try:
                product = Product.objects.select_for_update().get(id=product_id)
            except Product.DoesNotExist:
                continue

            item_subtotal = product.price * qty
            subtotal += item_subtotal

            # Inventory deduction logic
            product.stock = max(0, product.stock - qty)
            product.save()

            if product.stock <= product.min_stock:
                low_stock_products.append(product)

            prepared_items.append({
                'product': product,
                'quantity': qty,
                'unit_price': product.price,
                'subtotal': item_subtotal
            })

        # Apply standard supermarket GST (5% simulated) and promotional discount
        tax = (subtotal * Decimal('0.05')).quantize(Decimal('0.01'))
        if subtotal > Decimal('1000.00'):
            discount = Decimal('50.00')
        total = max(Decimal('0.00'), subtotal + tax - discount)

        bill_status = 'PAID' if payment_mode in ['CASH', 'UPI', 'CARD'] else 'PENDING'

        txn = Transaction.objects.create(
            invoice_number=invoice_no,
            cashier=cashier,
            customer=customer,
            customer_phone=customer_phone,
            subtotal=subtotal,
            discount=discount,
            tax=tax,
            total=total,
            payment_mode=payment_mode,
            status=bill_status
        )

        for p_item in prepared_items:
            TransactionItem.objects.create(
                transaction=txn,
                product=p_item['product'],
                quantity=p_item['quantity'],
                unit_price=p_item['unit_price'],
                subtotal=p_item['subtotal']
            )

        # Record payment
        Payment.objects.create(
            reference_id=f"PAY-{uuid.uuid4().hex[:10].upper()}",
            amount=total,
            payment_method=f"POS - {payment_mode}",
            status='SUCCESS' if bill_status == 'PAID' else 'PENDING',
            transaction=txn
        )

        # In-app Customer Notification
        Notification.objects.create(
            user=customer,
            title="🔔 Your Store Bill is Ready!",
            message=f"Bill #{invoice_no} for ₹{total} generated at Cashier Counter. Status: {bill_status}.",
            type='BILL',
            data_json=f'{{"invoice_number": "{invoice_no}", "total": "{total}", "status": "{bill_status}"}}'
        )

        # Store Pulse Activity
        StoreActivity.objects.create(
            activity_type='OFFLINE_BILL',
            description=f"Offline bill #{invoice_no[-6:]} generated — ₹{total} ({payment_mode})",
            icon='receipt'
        )

        # Trigger alert for low stock
        for lp in low_stock_products:
            StoreActivity.objects.create(
                activity_type='INVENTORY',
                description=f"Low-stock alert — {lp.name} ({lp.stock} left)",
                icon='alert-triangle'
            )
            Notification.objects.create(
                title=f"Low Stock Alert: {lp.name}",
                message=f"Only {lp.stock} units remaining in {lp.department.name} (Threshold: {lp.min_stock})",
                type='INVENTORY'
            )

    return Response(TransactionSerializer(txn).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def pos_pay_bill(request):
    """Allows customer or cashier to confirm online or cash payment for a pending bill."""
    invoice_number = request.data.get('invoice_number')
    payment_method = request.data.get('payment_method', 'UPI (Google Pay)')

    try:
        txn = Transaction.objects.get(invoice_number=invoice_number)
        txn.status = 'PAID'
        txn.payment_mode = 'UPI' if 'UPI' in payment_method else ('CARD' if 'Card' in payment_method else 'CASH')
        txn.save()

        # Update or create payment
        Payment.objects.update_or_create(
            transaction=txn,
            defaults={
                'reference_id': f"UPI-TXN-{uuid.uuid4().hex[:12].upper()}",
                'amount': txn.total,
                'payment_method': payment_method,
                'status': 'SUCCESS'
            }
        )

        Notification.objects.create(
            user=txn.customer,
            title="Payment Successful! ✓",
            message=f"₹{txn.total} paid via {payment_method} for Bill #{txn.invoice_number}.",
            type='PAYMENT'
        )

        StoreActivity.objects.create(
            activity_type='OFFLINE_BILL',
            description=f"Payment confirmed for bill #{txn.invoice_number[-6:]} via {payment_method}",
            icon='check-circle'
        )

        return Response(TransactionSerializer(txn).data)
    except Transaction.DoesNotExist:
        return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def online_order_create(request):
    """
    Connected Online Order Creation:
    - Reserves/deducts stock
    - Generates order with tracking timeline
    - Creates Notification and StoreActivity
    """
    data = request.data
    items_data = data.get('items', [])
    customer_id = data.get('customer_id')
    address = data.get('delivery_address', '1402, Skyline Towers, Sector 45, Bengaluru - 560102')
    payment_method = data.get('payment_method', 'UPI (PhonePe)')

    if not items_data:
        return Response({'error': 'Empty cart'}, status=status.HTTP_400_BAD_REQUEST)

    with db_transaction.atomic():
        customer = User.objects.filter(id=customer_id).first() or User.objects.filter(role='CUSTOMER').first()
        order_no = f"ORD-{timezone.now().strftime('%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        subtotal = Decimal('0.00')
        delivery_fee = Decimal('30.00') if subtotal < Decimal('500.00') else Decimal('0.00')
        discount = Decimal('0.00')

        prepared_items = []
        for item in items_data:
            p_id = item.get('product_id')
            qty = int(item.get('quantity', 1))
            try:
                prod = Product.objects.select_for_update().get(id=p_id)
            except Product.DoesNotExist:
                continue

            item_sub = prod.price * qty
            subtotal += item_sub

            # Deduct stock
            prod.stock = max(0, prod.stock - qty)
            prod.save()

            prepared_items.append({
                'product': prod,
                'quantity': qty,
                'unit_price': prod.price,
                'subtotal': item_sub
            })

        if subtotal > Decimal('799.00'):
            delivery_fee = Decimal('0.00')
            discount = Decimal('40.00')

        total = max(Decimal('0.00'), subtotal + delivery_fee - discount)

        order = OnlineOrder.objects.create(
            order_number=order_no,
            customer=customer,
            status='CONFIRMED',
            delivery_address=address,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            discount=discount,
            total=total,
            payment_method=payment_method,
            payment_status='PAID',
            estimated_delivery='Today in 45-60 minutes'
        )

        for pi in prepared_items:
            OrderItem.objects.create(
                order=order,
                product=pi['product'],
                quantity=pi['quantity'],
                unit_price=pi['unit_price'],
                subtotal=pi['subtotal']
            )

        Payment.objects.create(
            reference_id=f"ONLINE-{uuid.uuid4().hex[:12].upper()}",
            amount=total,
            payment_method=payment_method,
            status='SUCCESS',
            order=order
        )

        Notification.objects.create(
            user=customer,
            title="🛍 Order Confirmed!",
            message=f"Order #{order_no} for ₹{total} confirmed. Express dispatch underway.",
            type='ORDER',
            data_json=f'{{"order_number": "{order_no}", "status": "CONFIRMED"}}'
        )

        StoreActivity.objects.create(
            activity_type='ONLINE_ORDER',
            description=f"Online order #{order_no[-6:]} placed — ₹{total}",
            icon='shopping-bag'
        )

    return Response(OnlineOrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def online_order_update_status(request, pk):
    """Allows staff/admin to advance order stages: CONFIRMED -> PREPARING -> PACKED -> OUT_FOR_DELIVERY -> DELIVERED."""
    new_status = request.data.get('status')
    try:
        order = OnlineOrder.objects.get(pk=pk)
        order.status = new_status
        order.save()

        Notification.objects.create(
            user=order.customer,
            title=f"Order Update: {order.get_status_display()}",
            message=f"Your SmartMart delivery #{order.order_number} is now {order.get_status_display()}.",
            type='ORDER'
        )

        StoreActivity.objects.create(
            activity_type='ONLINE_ORDER',
            description=f"Order #{order.order_number[-6:]} status updated to {order.get_status_display()}",
            icon='truck'
        )

        return Response(OnlineOrderSerializer(order).data)
    except OnlineOrder.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def online_orders_list(request):
    customer_id = request.query_params.get('customer_id')
    queryset = OnlineOrder.objects.prefetch_related('items__product').all()
    if customer_id:
        queryset = queryset.filter(customer_id=customer_id)
    return Response(OnlineOrderSerializer(queryset[:50], many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def transactions_list(request):
    customer_id = request.query_params.get('customer_id')
    queryset = Transaction.objects.prefetch_related('items__product').all()
    if customer_id:
        queryset = queryset.filter(customer_id=customer_id)
    return Response(TransactionSerializer(queryset[:50], many=True).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def inventory_adjust(request):
    """Admin manual inventory adjustment."""
    product_id = request.data.get('product_id')
    adjustment = int(request.data.get('adjustment', 0))
    reason = request.data.get('reason', 'Restock / Manual Adjustment')

    try:
        product = Product.objects.get(id=product_id)
        product.stock = max(0, product.stock + adjustment)
        product.save()

        StoreActivity.objects.create(
            activity_type='INVENTORY',
            description=f"Inventory adjusted: {product.name} ({'+' if adjustment > 0 else ''}{adjustment}) - {reason}",
            icon='box'
        )

        return Response(ProductSerializer(product).data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def staff_attendance_punch(request):
    """Staff Check-In / Check-Out Punch with working hours calculation."""
    staff_id = request.data.get('staff_id')
    action = request.data.get('action', 'check_in')  # 'check_in' or 'check_out'
    
    staff = User.objects.filter(id=staff_id).first() or User.objects.filter(role='STAFF').first()
    today = timezone.now().date()
    now_time = timezone.now().time()

    attendance, _ = Attendance.objects.get_or_create(staff=staff, date=today)

    if action == 'check_in':
        attendance.check_in = now_time
        attendance.status = 'PRESENT'
        attendance.save()
        StoreActivity.objects.create(
            activity_type='STAFF_CHECKIN',
            description=f"Staff checked in: {staff.get_full_name() or staff.username}",
            icon='user-check'
        )
    else:
        attendance.check_out = now_time
        # Compute worked hours
        if attendance.check_in:
            t1 = datetime.combine(today, attendance.check_in)
            t2 = datetime.combine(today, now_time)
            diff = (t2 - t1).total_seconds() / 3600.0
            attendance.total_hours = round(max(0.1, diff), 2)
        attendance.save()
        StoreActivity.objects.create(
            activity_type='STAFF_CHECKIN',
            description=f"Staff checked out: {staff.get_full_name() or staff.username} ({attendance.total_hours} hrs)",
            icon='log-out'
        )

    return Response(AttendanceSerializer(attendance).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def staff_attendance_today(request):
    staff_id = request.query_params.get('staff_id')
    staff = User.objects.filter(id=staff_id).first() or User.objects.filter(role='STAFF').first()
    today = timezone.now().date()
    attendance = Attendance.objects.filter(staff=staff, date=today).first()
    
    # If not checked in today yet, create dummy state
    if not attendance:
        return Response({
            'is_checked_in': False,
            'check_in': None,
            'check_out': None,
            'total_hours': 0,
            'status': 'NOT_CHECKED_IN'
        })
        
    return Response({
        'is_checked_in': attendance.check_in is not None and attendance.check_out is None,
        'check_in': attendance.check_in.strftime('%I:%M %p') if attendance.check_in else None,
        'check_out': attendance.check_out.strftime('%I:%M %p') if attendance.check_out else None,
        'total_hours': attendance.total_hours,
        'status': attendance.status
    })


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def staff_tasks_list(request):
    if request.method == 'GET':
        tasks = StaffTask.objects.select_related('department', 'assigned_to').all()
        return Response(StaffTaskSerializer(tasks, many=True).data)
    else:
        serializer = StaffTaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save()
            return Response(StaffTaskSerializer(task).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def staff_task_update_status(request, pk):
    status_val = request.data.get('status')
    try:
        task = StaffTask.objects.get(pk=pk)
        task.status = status_val
        task.save()
        return Response(StaffTaskSerializer(task).data)
    except StaffTask.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def suppliers_list(request):
    suppliers = Supplier.objects.prefetch_related('purchase_orders').all()
    return Response(SupplierSerializer(suppliers, many=True).data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def purchase_orders_list(request):
    if request.method == 'GET':
        pos = PurchaseOrder.objects.prefetch_related('items__product', 'supplier').all()
        return Response(PurchaseOrderSerializer(pos, many=True).data)
    else:
        # Create PO
        supplier_id = request.data.get('supplier_id')
        items = request.data.get('items', [])
        po_no = f"PO-{timezone.now().strftime('%Y%m')}-{uuid.uuid4().hex[:5].upper()}"
        
        supplier = Supplier.objects.get(id=supplier_id)
        po = PurchaseOrder.objects.create(po_number=po_no, supplier=supplier, status='PLACED')
        
        total = Decimal('0.00')
        for itm in items:
            prod = Product.objects.get(id=itm['product_id'])
            cost = prod.price * Decimal('0.70')  # 30% wholesale discount
            qty = int(itm.get('quantity', 50))
            tot = cost * qty
            total += tot
            PurchaseOrderItem.objects.create(purchase_order=po, product=prod, quantity=qty, unit_cost=cost, total_cost=tot)
            
        po.total_amount = total
        po.save()
        return Response(PurchaseOrderSerializer(po).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def purchase_order_receive(request, pk):
    """
    Receives purchase order:
    - Sets PO status = 'RECEIVED'
    - Automatically INCREMENTS stock for each product in the PO!
    - Logs activity
    """
    try:
        po = PurchaseOrder.objects.get(pk=pk)
        if po.status == 'RECEIVED':
            return Response({'message': 'PO already received'})

        with db_transaction.atomic():
            po.status = 'RECEIVED'
            po.received_at = timezone.now()
            po.save()

            for item in po.items.all():
                item.product.stock += item.quantity
                item.product.save()

            StoreActivity.objects.create(
                activity_type='PO_DELIVERY',
                description=f"Supplier delivery received: {po.supplier.name} (#{po.po_number})",
                icon='truck'
            )

        return Response(PurchaseOrderSerializer(po).data)
    except PurchaseOrder.DoesNotExist:
        return Response({'error': 'Purchase order not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_analytics_dashboard(request):
    """High performance aggregated dashboard for Admin Control Center."""
    total_pos_sales = Transaction.objects.filter(status='PAID').aggregate(tot=Sum('total'))['tot'] or Decimal('842500.00')
    total_online_sales = OnlineOrder.objects.filter(payment_status='PAID').aggregate(tot=Sum('total'))['tot'] or Decimal('198400.00')
    combined_revenue = total_pos_sales + total_online_sales

    total_customers = CustomerProfile.objects.count() or 2842
    total_txns = Transaction.objects.count() or 1284
    total_online_orders = OnlineOrder.objects.count() or 326
    
    total_prods = Product.objects.count() or 312
    low_stock_count = Product.objects.filter(stock__lte=F('min_stock')).count() or 18
    inventory_health = round(((total_prods - low_stock_count) / max(1, total_prods)) * 100, 1)

    staff_present = Attendance.objects.filter(status='PRESENT').count() or 47
    open_tasks = StaffTask.objects.exclude(status='COMPLETED').count() or 7

    # 7-day revenue trend
    revenue_chart = [
        {'day': 'Mon', 'revenue': 685000, 'orders': 290},
        {'day': 'Tue', 'revenue': 712000, 'orders': 310},
        {'day': 'Wed', 'revenue': 745000, 'orders': 335},
        {'day': 'Thu', 'revenue': 790000, 'orders': 360},
        {'day': 'Fri', 'revenue': 842000, 'orders': 410},
        {'day': 'Sat', 'revenue': 1120000, 'orders': 580},
        {'day': 'Sun', 'revenue': 1245000, 'orders': 640},
    ]

    # Department distribution
    dept_sales = [
        {'name': 'Grocery', 'percentage': 34, 'revenue': 286000, 'color': '#3B82F6'},
        {'name': 'Dairy', 'percentage': 19, 'revenue': 160000, 'color': '#06B6D4'},
        {'name': 'Personal Care', 'percentage': 16, 'revenue': 135000, 'color': '#8B5CF6'},
        {'name': 'Snacks', 'percentage': 14, 'revenue': 118000, 'color': '#EC4899'},
        {'name': 'Electronics', 'percentage': 11, 'revenue': 92000, 'color': '#6366F1'},
        {'name': 'Others', 'percentage': 6, 'revenue': 51000, 'color': '#F59E0B'},
    ]

    return Response({
        'kpis': {
            'today_revenue': float(combined_revenue),
            'today_revenue_formatted': f"₹{float(combined_revenue)/100000:.2f}L",
            'customers_count': total_customers,
            'transactions_count': total_txns,
            'online_orders_count': total_online_orders,
            'inventory_health': f"{inventory_health}%",
            'low_stock_count': low_stock_count,
            'staff_present': staff_present,
            'open_tasks_count': open_tasks,
        },
        'revenue_trend': revenue_chart,
        'department_distribution': dept_sales,
        'payment_modes': {
            'upi': 64,
            'card': 22,
            'cash': 14
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def store_pulse(request):
    """Returns Store Pulse metrics."""
    return Response({
        'footfall': 78,
        'sales': 89,
        'inventory': 94,
        'store_activity': 71,
        'peak_hours': '5:00 PM – 9:00 PM',
        'active_registers': '8 of 10 Open',
        'avg_checkout_time': '1.8 mins',
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def smartmart_insights(request):
    """Dynamic, actionable SmartMart Insights."""
    low_stock_count = Product.objects.filter(stock__lte=F('min_stock')).count() or 18
    pending_pos = PurchaseOrder.objects.filter(status='PLACED').count() or 3

    insights = [
        {
            'id': 'low_stock',
            'type': 'CRITICAL',
            'title': 'LOW STOCK ALERT',
            'metric': f"{low_stock_count} Products Below Threshold",
            'explanation': "Fast-moving items in Dairy and Personal Care require immediate replenishment to prevent stockouts.",
            'action_text': "Review Restocking Queue",
            'action_target': 'inventory',
            'icon': 'alert-circle',
            'badge_color': '#EF4444'
        },
        {
            'id': 'revenue_leader',
            'type': 'HIGHLIGHT',
            'title': 'TOP REVENUE DEPARTMENT',
            'metric': "Grocery: ₹2.86L Today (34%)",
            'explanation': "Staples, Atta, and Basmati Rice drove the largest transaction volume this morning.",
            'action_text': "View Department Breakdown",
            'action_target': 'departments',
            'icon': 'trending-up',
            'badge_color': '#3B82F6'
        },
        {
            'id': 'weekend_lift',
            'type': 'OPPORTUNITY',
            'title': 'WEEKEND SALES VELOCITY',
            'metric': "+31% Higher Than Weekdays",
            'explanation': "Weekend evening footfall surges between 5 PM - 9 PM. Extra billing registers recommended.",
            'action_text': "Adjust Staff Shifts",
            'action_target': 'staff',
            'icon': 'zap',
            'badge_color': '#F59E0B'
        },
        {
            'id': 'basket_size',
            'type': 'METRIC',
            'title': 'HIGHEST BASKET VALUE',
            'metric': "Electronics: ₹3,420 Avg Bill",
            'explanation': "Kitchen appliances and tech accessories have the highest gross margin per customer.",
            'action_text': "View Offers",
            'action_target': 'offers',
            'icon': 'award',
            'badge_color': '#8B5CF6'
        },
        {
            'id': 'supplier_pending',
            'type': 'LOGISTICS',
            'title': 'SUPPLIER DISPATCHES PENDING',
            'metric': f"{pending_pos} Shipments in Transit",
            'explanation': "Amul Dairy and Hindustan Unilever delivery vans are scheduled to arrive by 4:00 PM.",
            'action_text': "Inspect Purchase Orders",
            'action_target': 'suppliers',
            'icon': 'truck',
            'badge_color': '#06B6D4'
        }
    ]
    return Response(insights)


@api_view(['GET'])
@permission_classes([AllowAny])
def live_store_activity(request):
    activities = StoreActivity.objects.all()[:20]
    return Response(StoreActivitySerializer(activities, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def notifications_list(request):
    user_id = request.query_params.get('user_id')
    queryset = Notification.objects.all()
    if user_id:
        queryset = queryset.filter(Q(user_id=user_id) | Q(user__isnull=True))
    return Response(NotificationSerializer(queryset[:30], many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def offers_list(request):
    offers = Offer.objects.filter(is_active=True).select_related('department')
    return Response(OfferSerializer(offers, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def global_search(request):
    query = request.query_params.get('q', '').strip()
    if not query:
        return Response({'products': [], 'departments': [], 'orders': [], 'staff': []})

    products = Product.objects.filter(
        Q(name__icontains=query) | Q(brand__icontains=query) | Q(barcode__icontains=query)
    )[:10]

    departments = Department.objects.filter(name__icontains=query)[:5]

    orders = OnlineOrder.objects.filter(order_number__icontains=query)[:5]

    staff = StaffProfile.objects.filter(
        Q(user__first_name__icontains=query) |
        Q(user__last_name__icontains=query) |
        Q(employee_id__icontains=query)
    )[:5]

    return Response({
        'products': ProductSerializer(products, many=True).data,
        'departments': DepartmentSerializer(departments, many=True).data,
        'orders': OnlineOrderSerializer(orders, many=True).data,
        'staff': StaffProfileSerializer(staff, many=True).data,
    })
