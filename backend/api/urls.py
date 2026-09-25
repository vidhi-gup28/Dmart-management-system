from django.urls import path
from . import views

urlpatterns = [
    # Auth & Roles
    path('auth/demo-users/', views.demo_users, name='demo-users'),
    path('auth/login/', views.login_user, name='login-user'),
    path('auth/register/', views.register_customer, name='register-customer'),

    # Catalog & Departments
    path('departments/', views.departments_list, name='departments-list'),
    path('products/', views.products_list, name='products-list'),
    path('products/<int:pk>/', views.product_detail, name='product-detail'),

    # Store Map & Route Navigation
    path('store/map/', views.store_map_layout, name='store-map'),
    path('store/route/<int:product_id>/', views.store_product_route, name='store-product-route'),

    # POS & Billing
    path('pos/create-bill/', views.pos_create_bill, name='pos-create-bill'),
    path('pos/pay-bill/', views.pos_pay_bill, name='pos-pay-bill'),
    path('transactions/', views.transactions_list, name='transactions-list'),

    # Online Orders
    path('orders/', views.online_orders_list, name='online-orders-list'),
    path('orders/create/', views.online_order_create, name='online-order-create'),
    path('orders/<int:pk>/status/', views.online_order_update_status, name='online-order-update-status'),

    # Inventory
    path('inventory/adjust/', views.inventory_adjust, name='inventory-adjust'),

    # Staff & Attendance & Tasks
    path('staff/attendance/punch/', views.staff_attendance_punch, name='staff-attendance-punch'),
    path('staff/attendance/today/', views.staff_attendance_today, name='staff-attendance-today'),
    path('staff/tasks/', views.staff_tasks_list, name='staff-tasks-list'),
    path('staff/tasks/<int:pk>/status/', views.staff_task_update_status, name='staff-task-update-status'),

    # Suppliers & Purchase Orders
    path('suppliers/', views.suppliers_list, name='suppliers-list'),
    path('purchase-orders/', views.purchase_orders_list, name='purchase-orders-list'),
    path('purchase-orders/<int:pk>/receive/', views.purchase_order_receive, name='purchase-order-receive'),

    # Analytics, Insights, Pulse & Live Activity
    path('analytics/dashboard/', views.admin_analytics_dashboard, name='analytics-dashboard'),
    path('analytics/pulse/', views.store_pulse, name='store-pulse'),
    path('analytics/insights/', views.smartmart_insights, name='smartmart-insights'),
    path('analytics/live-activity/', views.live_store_activity, name='live-store-activity'),

    # Notifications & Offers
    path('notifications/', views.notifications_list, name='notifications-list'),
    path('offers/', views.offers_list, name='offers-list'),

    # Global Search
    path('search/', views.global_search, name='global-search'),
]
