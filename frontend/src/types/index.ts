export type UserRole = 'CUSTOMER' | 'STAFF' | 'CASHIER' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    avatar?: string;
  };
  role: UserRole;
  profile?: any;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  floor: string;
  icon_name: string;
  theme_color: string;
  description: string;
  products_count: number;
  staff_count: number;
  aisles?: Aisle[];
}

export interface Shelf {
  id: number;
  shelf_code: string;
  level: number;
}

export interface Aisle {
  id: number;
  aisle_number: number;
  name: string;
  shelves?: Shelf[];
}

export interface Product {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  brand: string;
  department: number;
  department_name: string;
  department_code: string;
  department_color: string;
  aisle_number?: number;
  aisle_name?: string;
  shelf_code?: string;
  price: number;
  mrp: number;
  discount_percent: number;
  stock: number;
  min_stock: number;
  stock_status: 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK';
  unit: string;
  image_url: string;
  description: string;
  rating: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TransactionItem {
  id: number;
  product_name: string;
  product_barcode: string;
  product_unit: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Transaction {
  id: number;
  invoice_number: string;
  cashier_name?: string;
  customer_name?: string;
  customer_phone?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_mode: 'CASH' | 'UPI' | 'CARD';
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  created_at: string;
  items: TransactionItem[];
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_image?: string;
  product_unit: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OnlineOrder {
  id: number;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  status: 'CONFIRMED' | 'PREPARING' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  delivery_address: string;
  delivery_slot: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  estimated_delivery: string;
  items: OrderItem[];
}

export interface StaffTask {
  id: number;
  title: string;
  description: string;
  department_name: string;
  assigned_name: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  due_time: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  staff_name: string;
  employee_id: string;
  department: string;
  date: string;
  check_in?: string;
  check_out?: string;
  total_hours: number;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT';
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'BILL' | 'PAYMENT' | 'ORDER' | 'ALERT' | 'OFFER' | 'INVENTORY';
  is_read: boolean;
  data_json?: string;
  created_at: string;
}

export interface OfferItem {
  id: number;
  title: string;
  code: string;
  discount_percent: number;
  department_name?: string;
  description: string;
  valid_until: string;
  banner_color: string;
  is_active: boolean;
}

export interface StoreActivityItem {
  id: number;
  activity_type: string;
  description: string;
  formatted_time: string;
  icon: string;
}

export interface SmartMartInsight {
  id: string;
  type: string;
  title: string;
  metric: string;
  explanation: string;
  action_text: string;
  action_target: string;
  icon: string;
  badge_color: string;
}

export interface StorePulseData {
  footfall: number;
  sales: number;
  inventory: number;
  store_activity: number;
  peak_hours: string;
  active_registers: string;
  avg_checkout_time: string;
}

export interface AdminDashboardData {
  kpis: {
    today_revenue: number;
    today_revenue_formatted: string;
    customers_count: number;
    transactions_count: number;
    online_orders_count: number;
    inventory_health: string;
    low_stock_count: number;
    staff_present: number;
    open_tasks_count: number;
  };
  revenue_trend: Array<{ day: string; revenue: number; orders: number }>;
  department_distribution: Array<{ name: string; percentage: number; revenue: number; color: string }>;
  payment_modes: {
    upi: number;
    card: number;
    cash: number;
  };
}

export interface RouteWaypoint {
  x: number;
  y: number;
  label: string;
  step: number;
  is_target?: boolean;
}

export interface ProductRouteInfo {
  product: Product;
  department: string;
  aisle: string;
  shelf: string;
  estimated_walk_seconds: number;
  distance_meters: number;
  waypoints: RouteWaypoint[];
  instructions: string[];
}
