from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    ROLE_CHOICES = (
        ('CUSTOMER', 'Customer'),
        ('STAFF', 'Staff'),
        ('CASHIER', 'Cashier'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    loyalty_points = models.IntegerField(default=150)
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)

    def __str__(self):
        return f"Customer: {self.user.get_full_name() or self.user.username}"


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    floor = models.CharField(max_length=50, default='Ground Floor')
    icon_name = models.CharField(max_length=50, default='shopping-bag')
    theme_color = models.CharField(max_length=20, default='#6366F1')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff_members')
    role_title = models.CharField(max_length=100, default='Store Associate')
    shift = models.CharField(max_length=50, default='9 AM - 5 PM')
    status = models.CharField(max_length=20, default='Active')

    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name() or self.user.username}"


class Aisle(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='aisles')
    aisle_number = models.IntegerField()
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ['aisle_number']

    def __str__(self):
        return f"Aisle {self.aisle_number} ({self.name})"


class Shelf(models.Model):
    aisle = models.ForeignKey(Aisle, on_delete=models.CASCADE, related_name='shelves')
    shelf_code = models.CharField(max_length=20)  # e.g., 'Shelf A', 'Shelf B'
    level = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.aisle} - {self.shelf_code}"


class Supplier(models.Model):
    name = models.CharField(max_length=150)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    category = models.CharField(max_length=100, default='FMCG & Groceries')
    rating = models.FloatField(default=4.8)

    def __str__(self):
        return self.name


class Product(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='products')
    aisle = models.ForeignKey(Aisle, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    shelf = models.ForeignKey(Shelf, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percent = models.IntegerField(default=0)
    stock = models.IntegerField(default=50)
    min_stock = models.IntegerField(default=15)
    unit = models.CharField(max_length=50, default='1 unit')
    image_url = models.TextField(blank=True)
    description = models.TextField(blank=True)
    rating = models.FloatField(default=4.5)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    @property
    def stock_status(self):
        if self.stock <= 0:
            return 'OUT_OF_STOCK'
        if self.stock <= max(2, self.min_stock // 3):
            return 'CRITICAL'
        if self.stock <= self.min_stock:
            return 'LOW_STOCK'
        return 'HEALTHY'

    def __str__(self):
        return f"{self.name} (₹{self.price})"


class PurchaseOrder(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PLACED', 'Placed'),
        ('DISPATCHED', 'Dispatched'),
        ('RECEIVED', 'Received'),
    )
    po_number = models.CharField(max_length=50, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='purchase_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLACED')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    received_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.po_number} - {self.supplier.name} ({self.status})"


class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=50)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class Transaction(models.Model):
    PAYMENT_CHOICES = (
        ('CASH', 'Cash'),
        ('UPI', 'UPI'),
        ('CARD', 'Credit/Debit Card'),
    )
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
    )
    invoice_number = models.CharField(max_length=50, unique=True, db_index=True)
    cashier = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='cashier_transactions')
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='customer_transactions')
    customer_phone = models.CharField(max_length=20, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='CASH')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PAID')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Bill #{self.invoice_number} - ₹{self.total}"


class TransactionItem(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class OnlineOrder(models.Model):
    STATUS_CHOICES = (
        ('CONFIRMED', 'Order Confirmed'),
        ('PREPARING', 'Preparing'),
        ('PACKED', 'Packed'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    )
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='online_orders')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='CONFIRMED')
    delivery_address = models.TextField()
    delivery_slot = models.CharField(max_length=100, default='Today, Express 2-Hour Delivery')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=30, default='UPI')
    payment_status = models.CharField(max_length=20, default='PAID')
    created_at = models.DateTimeField(auto_now_add=True)
    estimated_delivery = models.CharField(max_length=100, default='In 45-60 mins')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.order_number} ({self.status}) - ₹{self.total}"


class OrderItem(models.Model):
    order = models.ForeignKey(OnlineOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


class Payment(models.Model):
    reference_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)  # e.g., 'UPI (Google Pay)', 'UPI (PhonePe)', 'Credit Card', 'Cash'
    status = models.CharField(max_length=20, default='SUCCESS')
    transaction = models.ForeignKey(Transaction, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    order = models.ForeignKey(OnlineOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.payment_method} - ₹{self.amount} ({self.status})"


class Attendance(models.Model):
    STATUS_CHOICES = (
        ('PRESENT', 'Present'),
        ('LATE', 'Late'),
        ('HALF_DAY', 'Half Day'),
        ('ABSENT', 'Absent'),
    )
    staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    total_hours = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PRESENT')

    class Meta:
        unique_together = ('staff', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.staff.username} - {self.date} ({self.status})"


class StaffTask(models.Model):
    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    )
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='tasks')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    due_time = models.CharField(max_length=50, default='Today, 5:00 PM')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Task: {self.title} ({self.status})"


class Notification(models.Model):
    TYPE_CHOICES = (
        ('BILL', 'Bill Generated'),
        ('PAYMENT', 'Payment Received'),
        ('ORDER', 'Order Update'),
        ('ALERT', 'Store Alert'),
        ('OFFER', 'Special Offer'),
        ('INVENTORY', 'Inventory Alert'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    title = models.CharField(max_length=150)
    message = models.TextField()
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='ALERT')
    is_read = models.BooleanField(default=False)
    data_json = models.TextField(blank=True, default='{}')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.type})"


class Offer(models.Model):
    title = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    discount_percent = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='offers')
    description = models.TextField(blank=True)
    valid_until = models.CharField(max_length=50, default='30 September')
    banner_color = models.CharField(max_length=30, default='#6366F1')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} - {self.discount_percent}% OFF"


class StoreActivity(models.Model):
    activity_type = models.CharField(max_length=50)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    icon = models.CharField(max_length=50, default='activity')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp.strftime('%H:%M')} - {self.description}"
