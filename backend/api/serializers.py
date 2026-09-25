from rest_framework import serializers
from .models import (
    User, CustomerProfile, StaffProfile, Department, Aisle, Shelf,
    Supplier, Product, PurchaseOrder, PurchaseOrderItem,
    Transaction, TransactionItem, OnlineOrder, OrderItem,
    Payment, Attendance, StaffTask, Notification, Offer, StoreActivity
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'avatar']


class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CustomerProfile
        fields = '__all__'


class ShelfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelf
        fields = ['id', 'shelf_code', 'level']


class AisleSerializer(serializers.ModelSerializer):
    shelves = ShelfSerializer(many=True, read_only=True)

    class Meta:
        model = Aisle
        fields = ['id', 'aisle_number', 'name', 'shelves']


class DepartmentSerializer(serializers.ModelSerializer):
    aisles = AisleSerializer(many=True, read_only=True)
    products_count = serializers.SerializerMethodField()
    staff_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            'id', 'name', 'code', 'floor', 'icon_name', 'theme_color',
            'description', 'is_active', 'aisles', 'products_count', 'staff_count'
        ]

    def get_products_count(self, obj):
        return obj.products.count()

    def get_staff_count(self, obj):
        return obj.staff_members.count()


class StaffProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = StaffProfile
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_code = serializers.CharField(source='department.code', read_only=True)
    department_color = serializers.CharField(source='department.theme_color', read_only=True)
    aisle_number = serializers.IntegerField(source='aisle.aisle_number', read_only=True)
    aisle_name = serializers.CharField(source='aisle.name', read_only=True)
    shelf_code = serializers.CharField(source='shelf.shelf_code', read_only=True)
    stock_status = serializers.CharField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'barcode', 'name', 'brand',
            'department', 'department_name', 'department_code', 'department_color',
            'aisle', 'aisle_number', 'aisle_name',
            'shelf', 'shelf_code',
            'price', 'mrp', 'discount_percent',
            'stock', 'min_stock', 'stock_status',
            'unit', 'image_url', 'description', 'rating',
            'is_featured', 'is_bestseller', 'is_active'
        ]


class SupplierSerializer(serializers.ModelSerializer):
    active_po_count = serializers.SerializerMethodField()

    class Meta:
        model = Supplier
        fields = '__all__'

    def get_active_po_count(self, obj):
        return obj.purchase_orders.exclude(status='RECEIVED').count()


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_barcode = serializers.CharField(source='product.barcode', read_only=True)

    class Meta:
        model = PurchaseOrderItem
        fields = '__all__'


class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = '__all__'


class TransactionItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_barcode = serializers.CharField(source='product.barcode', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)

    class Meta:
        model = TransactionItem
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    items = TransactionItemSerializer(many=True, read_only=True)
    cashier_name = serializers.CharField(source='cashier.get_full_name', read_only=True)
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image_url', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'


class OnlineOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)

    class Meta:
        model = OnlineOrder
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.get_full_name', read_only=True)
    employee_id = serializers.CharField(source='staff.staff_profile.employee_id', read_only=True)
    department = serializers.CharField(source='staff.staff_profile.department.name', read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'


class StaffTaskSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    assigned_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)

    class Meta:
        model = StaffTask
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Offer
        fields = '__all__'


class StoreActivitySerializer(serializers.ModelSerializer):
    formatted_time = serializers.SerializerMethodField()

    class Meta:
        model = StoreActivity
        fields = '__all__'

    def get_formatted_time(self, obj):
        return obj.timestamp.strftime('%I:%M %p')
