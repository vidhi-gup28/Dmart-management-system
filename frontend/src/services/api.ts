import {
  Department, Product, Transaction, OnlineOrder,
  StaffTask, AttendanceRecord, NotificationItem, OfferItem,
  StoreActivityItem, SmartMartInsight, StorePulseData, AdminDashboardData,
  ProductRouteInfo, AuthResponse, UserRole
} from '../types';
import {
  MOCK_DEPARTMENTS, MOCK_PRODUCTS, MOCK_TRANSACTIONS, MOCK_ORDERS,
  MOCK_STAFF_TASKS, MOCK_SUPPLIERS, MOCK_PURCHASE_ORDERS, MOCK_ADMIN_DASHBOARD,
  MOCK_STORE_PULSE, MOCK_INSIGHTS, MOCK_ACTIVITIES, MOCK_NOTIFICATIONS
} from './mockData';

const BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://localhost:8000/api';

async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (err) {
    return null;
  }
}

export const SmartMartApi = {
  login: async (credentials: { identifier: string; password?: string; role?: UserRole }): Promise<AuthResponse | null> => {
    const res = await safeFetch<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return res;
  },

  register: async (userData: { name: string; email: string; phone: string; password?: string }): Promise<AuthResponse | null> => {
    return safeFetch<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getDemoUsers: async () => {
    return safeFetch<any>('/auth/demo-users/');
  },

  getDepartments: async (): Promise<Department[]> => {
    const res = await safeFetch<Department[]>('/departments/');
    return res && res.length > 0 ? res : MOCK_DEPARTMENTS;
  },

  getProducts: async (params?: { department?: number; search?: string; barcode?: string; stock_status?: string }): Promise<Product[]> => {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.department) searchParams.append('department', params.department.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.barcode) searchParams.append('barcode', params.barcode);
      if (params.stock_status) searchParams.append('stock_status', params.stock_status);
      query = `?${searchParams.toString()}`;
    }
    const res = await safeFetch<Product[]>(`/products/${query}`);
    if (res && res.length > 0) return res;

    let filtered = [...MOCK_PRODUCTS];
    if (params?.department) filtered = filtered.filter(p => p.department === params.department);
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (params?.barcode) filtered = filtered.filter(p => p.barcode === params.barcode);
    return filtered;
  },

  getProductDetail: async (id: number): Promise<Product | null> => {
    return safeFetch<Product>(`/products/${id}/`);
  },

  getStoreMap: async () => {
    return safeFetch<any>('/store/map/');
  },

  getProductRoute: async (productId: number): Promise<ProductRouteInfo | null> => {
    return safeFetch<ProductRouteInfo>(`/store/route/${productId}/`);
  },

  createPosBill: async (items: Array<{ product_id: number; quantity: number }>, customerPhone: string, paymentMode: string, cashierId?: number, customerName?: string): Promise<Transaction | null> => {
    const res = await safeFetch<Transaction>('/pos/create-bill/', {
      method: 'POST',
      body: JSON.stringify({
        items,
        customer_phone: customerPhone,
        customer_name: customerName,
        payment_mode: paymentMode,
        cashier_id: cashierId
      })
    });
    if (res) return res;

    // Standalone fallback: build real transaction
    const billItems = items.map((itm, idx) => {
      const prod = MOCK_PRODUCTS.find(p => p.id === itm.product_id) || MOCK_PRODUCTS[0];
      return {
        id: Date.now() + idx,
        product_name: prod.name,
        product_barcode: prod.barcode,
        product_unit: prod.unit,
        quantity: itm.quantity,
        unit_price: prod.price,
        subtotal: prod.price * itm.quantity,
      };
    });
    const subtotal = billItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    const tax = Math.round(subtotal * 0.05);
    const discount = subtotal > 800 ? 50 : 0;
    const total = subtotal + tax - discount;

    return {
      id: Date.now(),
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_phone: customerPhone,
      customer_name: customerName || 'Walk-in Customer',
      subtotal,
      tax_amount: tax,
      discount_amount: discount,
      total,
      payment_mode: paymentMode as any,
      status: paymentMode === 'CASH' ? 'PAID' : 'PENDING',
      cashier_id: cashierId || 1,
      cashier_name: 'Lane 3 (Demo Register)',
      created_at: new Date().toISOString(),
      items: billItems,
    };
  },

  payBill: async (invoiceNumber: string, paymentMethod: string): Promise<Transaction | null> => {
    return safeFetch<Transaction>('/pos/pay-bill/', {
      method: 'POST',
      body: JSON.stringify({
        invoice_number: invoiceNumber,
        payment_method: paymentMethod
      })
    });
  },

  createOnlineOrder: async (items: Array<{ product_id: number; quantity: number }>, address: string, paymentMethod: string, customerId?: number): Promise<OnlineOrder | null> => {
    const res = await safeFetch<OnlineOrder>('/orders/create/', {
      method: 'POST',
      body: JSON.stringify({
        items,
        delivery_address: address,
        payment_method: paymentMethod,
        customer_id: customerId
      })
    });
    if (res) return res;

    const orderItems = items.map((itm, idx) => {
      const prod = MOCK_PRODUCTS.find(p => p.id === itm.product_id) || MOCK_PRODUCTS[0];
      return {
        id: Date.now() + idx,
        product_name: prod.name,
        product_unit: prod.unit,
        quantity: itm.quantity,
        unit_price: prod.price,
        subtotal: prod.price * itm.quantity,
      };
    });
    const subtotal = orderItems.reduce((acc, curr) => acc + curr.subtotal, 0);

    return {
      id: Date.now(),
      order_number: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'CONFIRMED',
      delivery_address: address,
      delivery_slot: 'Today, 2-Hour Express Delivery',
      subtotal,
      delivery_fee: 0,
      discount: subtotal > 500 ? 50 : 0,
      total: Math.max(0, subtotal - (subtotal > 500 ? 50 : 0)),
      payment_method: paymentMethod,
      payment_status: 'PAID',
      created_at: new Date().toISOString(),
      estimated_delivery: 'Arriving in 35 mins',
      items: orderItems,
    };
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<OnlineOrder | null> => {
    return safeFetch<OnlineOrder>(`/orders/${orderId}/status/`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  },

  getOnlineOrders: async (customerId?: number): Promise<OnlineOrder[]> => {
    const q = customerId ? `?customer_id=${customerId}` : '';
    const res = await safeFetch<OnlineOrder[]>(`/orders/${q}`);
    return res && res.length > 0 ? res : MOCK_ORDERS;
  },

  getTransactions: async (customerId?: number): Promise<Transaction[]> => {
    const q = customerId ? `?customer_id=${customerId}` : '';
    const res = await safeFetch<Transaction[]>(`/transactions/${q}`);
    return res && res.length > 0 ? res : MOCK_TRANSACTIONS;
  },

  adjustInventory: async (productId: number, adjustment: number, reason: string): Promise<Product | null> => {
    return safeFetch<Product>('/inventory/adjust/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, adjustment, reason })
    });
  },

  punchAttendance: async (staffId: number, action: 'check_in' | 'check_out'): Promise<AttendanceRecord | null> => {
    return safeFetch<AttendanceRecord>('/staff/attendance/punch/', {
      method: 'POST',
      body: JSON.stringify({ staff_id: staffId, action })
    });
  },

  getStaffAttendanceToday: async (staffId?: number) => {
    const q = staffId ? `?staff_id=${staffId}` : '';
    return safeFetch<any>(`/staff/attendance/today/${q}`);
  },

  getStaffTasks: async (): Promise<StaffTask[]> => {
    const res = await safeFetch<StaffTask[]>('/staff/tasks/');
    return res && res.length > 0 ? res : MOCK_STAFF_TASKS;
  },

  updateStaffTaskStatus: async (taskId: number, status: string): Promise<StaffTask | null> => {
    return safeFetch<StaffTask>(`/staff/tasks/${taskId}/status/`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  },

  getSuppliers: async () => {
    const res = await safeFetch<any[]>('/suppliers/');
    return res && res.length > 0 ? res : MOCK_SUPPLIERS;
  },

  getPurchaseOrders: async () => {
    const res = await safeFetch<any[]>('/purchase-orders/');
    return res && res.length > 0 ? res : MOCK_PURCHASE_ORDERS;
  },

  receivePurchaseOrder: async (poId: number) => {
    return safeFetch<any>(`/purchase-orders/${poId}/receive/`, {
      method: 'POST'
    });
  },

  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    const res = await safeFetch<AdminDashboardData>('/analytics/dashboard/');
    return res || MOCK_ADMIN_DASHBOARD;
  },

  getStorePulse: async (): Promise<StorePulseData> => {
    const res = await safeFetch<StorePulseData>('/analytics/pulse/');
    return res || MOCK_STORE_PULSE;
  },

  getInsights: async (): Promise<SmartMartInsight[]> => {
    const res = await safeFetch<SmartMartInsight[]>('/analytics/insights/');
    return res && res.length > 0 ? res : MOCK_INSIGHTS;
  },

  getLiveActivity: async (): Promise<StoreActivityItem[]> => {
    const res = await safeFetch<StoreActivityItem[]>('/analytics/live-activity/');
    return res && res.length > 0 ? res : MOCK_ACTIVITIES;
  },

  getNotifications: async (userId?: number): Promise<NotificationItem[]> => {
    const q = userId ? `?user_id=${userId}` : '';
    const res = await safeFetch<NotificationItem[]>(`/notifications/${q}`);
    return res && res.length > 0 ? res : (MOCK_NOTIFICATIONS as any);
  },

  getOffers: async (): Promise<OfferItem[] | null> => {
    return safeFetch<OfferItem[]>('/offers/');
  },

  globalSearch: async (query: string) => {
    return safeFetch<any>(`/search/?q=${encodeURIComponent(query)}`);
  }
};
