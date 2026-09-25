import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/theme/colors';
import { UserRole, Product, Department, Transaction, OnlineOrder, StaffTask, SmartMartInsight, StorePulseData, AdminDashboardData, StoreActivityItem, NotificationItem, AuthResponse } from './src/types';
import { SmartMartApi } from './src/services/api';
import { AuthScreen } from './src/screens/auth/AuthScreen';

// Components
import { MobileFrame } from './src/components/MobileFrame';
import { RoleSwitcherBar } from './src/components/RoleSwitcherBar';
import { FloatingBottomNav } from './src/components/FloatingBottomNav';
import { IndoorStoreMap } from './src/components/IndoorStoreMap';
import { BarcodeScannerSimulator } from './src/components/BarcodeScannerSimulator';
import { DigitalInvoiceModal } from './src/components/DigitalInvoiceModal';
import { DigitalBillPaymentModal } from './src/components/DigitalBillPaymentModal';
import { GlobalSearchModal } from './src/components/GlobalSearchModal';

// Screens
import { OnboardingScreen } from './src/screens/customer/OnboardingScreen';
import { CustomerHomeScreen } from './src/screens/customer/CustomerHomeScreen';
import { ShopOnlineScreen } from './src/screens/customer/ShopOnlineScreen';
import { CustomerCartScreen } from './src/screens/customer/CustomerCartScreen';
import { OrderTrackingScreen } from './src/screens/customer/OrderTrackingScreen';
import { CustomerProfileScreen } from './src/screens/customer/CustomerProfileScreen';

import { StaffDashboardScreen } from './src/screens/staff/StaffDashboardScreen';
import { StaffAttendanceScreen } from './src/screens/staff/StaffAttendanceScreen';
import { StaffTasksScreen } from './src/screens/staff/StaffTasksScreen';
import { StaffDepartmentScreen } from './src/screens/staff/StaffDepartmentScreen';

import { CashierPOSScreen } from './src/screens/cashier/CashierPOSScreen';

import { AdminDashboardScreen } from './src/screens/admin/AdminDashboardScreen';
import { AdminInventoryScreen } from './src/screens/admin/AdminInventoryScreen';
import { AdminSuppliersScreen } from './src/screens/admin/AdminSuppliersScreen';
import { AdminStaffScreen } from './src/screens/admin/AdminStaffScreen';
import { AdminReportsScreen } from './src/screens/admin/AdminReportsScreen';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Data Store
  const [departments, setDepartments] = useState<Department[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<OnlineOrder[]>([]);
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [pulse, setPulse] = useState<StorePulseData | null>(null);
  const [insights, setInsights] = useState<SmartMartInsight[]>([]);
  const [activities, setActivities] = useState<StoreActivityItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Interactive Overlays
  const [targetProductForMap, setTargetProductForMap] = useState<Product | null>(null);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Transaction | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<OnlineOrder | null>(null);
  const [shopCategoryFilter, setShopCategoryFilter] = useState<number | null>(null);

  // Initial Data Fetching from Django REST Backend
  const loadData = async () => {
    try {
      const [
        deptsData,
        prodsData,
        txnsData,
        ordersData,
        tasksData,
        supsData,
        posData,
        dashData,
        pulseData,
        insightsData,
        actData,
        notifData,
      ] = await Promise.all([
        SmartMartApi.getDepartments(),
        SmartMartApi.getProducts(),
        SmartMartApi.getTransactions(),
        SmartMartApi.getOnlineOrders(),
        SmartMartApi.getStaffTasks(),
        SmartMartApi.getSuppliers(),
        SmartMartApi.getPurchaseOrders(),
        SmartMartApi.getAdminDashboard(),
        SmartMartApi.getStorePulse(),
        SmartMartApi.getInsights(),
        SmartMartApi.getLiveActivity(),
        SmartMartApi.getNotifications(),
      ]);

      if (deptsData) setDepartments(deptsData);
      if (prodsData) setProducts(prodsData);
      if (txnsData) setTransactions(txnsData);
      if (ordersData) setOrders(ordersData);
      if (tasksData) setTasks(tasksData);
      if (supsData) setSuppliers(supsData);
      if (posData) setPurchaseOrders(posData);
      if (dashData) setDashboard(dashData);
      if (pulseData) setPulse(pulseData);
      if (insightsData) setInsights(insightsData);
      if (actData) setActivities(actData);
      if (notifData) setNotifications(notifData);
    } catch (e) {
      console.warn('Error loading initial data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // URL Portal Route Detection (e.g. #/admin, #/cashier, #/staff, ?portal=admin)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectPortalFromUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (hash.includes('admin') || search.includes('portal=admin') || pathname.endsWith('/admin')) {
        setCurrentRole('ADMIN');
      } else if (hash.includes('cashier') || search.includes('portal=cashier') || pathname.endsWith('/cashier')) {
        setCurrentRole('CASHIER');
      } else if (hash.includes('staff') || search.includes('portal=staff') || pathname.endsWith('/staff')) {
        setCurrentRole('STAFF');
      } else {
        setCurrentRole('CUSTOMER');
      }
    };

    detectPortalFromUrl();
    window.addEventListener('hashchange', detectPortalFromUrl);
    window.addEventListener('popstate', detectPortalFromUrl);
    return () => {
      window.removeEventListener('hashchange', detectPortalFromUrl);
      window.removeEventListener('popstate', detectPortalFromUrl);
    };
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handlePortalSwitch = (role: UserRole) => {
    setCurrentRole(role);
    if (typeof window !== 'undefined') {
      if (role === 'CUSTOMER') {
        window.location.hash = '';
      } else {
        window.location.hash = `#/${role.toLowerCase()}`;
      }
    }
  };

  // Authentication Handlers
  const handleLoginSuccess = (authData: AuthResponse) => {
    setCurrentUser(authData.user);
    setCurrentRole(authData.role);
    setIsAuthenticated(true);
    setTrackedOrder(null);
    if (authData.role === 'CUSTOMER') setActiveTab('home');
    else if (authData.role === 'STAFF') setActiveTab('dashboard');
    else if (authData.role === 'CASHIER') setActiveTab('pos');
    else if (authData.role === 'ADMIN') setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCart({});
    setTrackedOrder(null);
    setSelectedInvoice(null);
    setSelectedBillForPayment(null);
    if (typeof window !== 'undefined' && currentRole !== 'CUSTOMER') {
      window.location.hash = `#/${currentRole.toLowerCase()}`;
    }
  };

  // When Role switches, set default active tab
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    setTrackedOrder(null);
    if (role === 'CUSTOMER') setActiveTab('home');
    else if (role === 'STAFF') setActiveTab('dashboard');
    else if (role === 'CASHIER') setActiveTab('pos');
    else if (role === 'ADMIN') setActiveTab('dashboard');
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart(prev => {
      const current = prev[product.id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[product.id];
        return next;
      }
      return { ...prev, [product.id]: current - 1 };
    });
  };

  const handleClearCart = () => setCart({});

  // Connected Flow: Customer Online Checkout
  const handleOnlineCheckout = async (address: string, slot: string, promoDiscount: number) => {
    const items = Object.entries(cart).map(([id, qty]) => ({
      product_id: parseInt(id),
      quantity: qty
    }));

    const newOrder = await SmartMartApi.createOnlineOrder(items, address, 'UPI (PhonePe)');
    if (newOrder) {
      setOrders(prev => [newOrder, ...prev]);
      setTrackedOrder(newOrder);
      setCart({});
      // Refresh inventory & pulse
      loadData();
    } else {
      // Fallback offline mock order
      const mockOrder: OnlineOrder = {
        id: Date.now(),
        order_number: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'CONFIRMED',
        delivery_address: address,
        delivery_slot: slot,
        subtotal: 650,
        delivery_fee: 0,
        discount: promoDiscount,
        total: 650 - promoDiscount,
        payment_method: 'UPI (PhonePe)',
        payment_status: 'PAID',
        created_at: new Date().toISOString(),
        estimated_delivery: 'Today in 45 mins',
        items: []
      };
      setOrders(prev => [mockOrder, ...prev]);
      setTrackedOrder(mockOrder);
      setCart({});
    }
  };

  // Connected Flow: Cashier POS Generates Offline Bill
  const handleGeneratePosBill = async (
    items: Array<{ product_id: number; quantity: number }>,
    customerPhone: string,
    paymentMode: string,
    customerName?: string
  ): Promise<Transaction | null> => {
    const txn = await SmartMartApi.createPosBill(items, customerPhone, paymentMode, 1, customerName);
    if (txn) {
      setTransactions(prev => [txn, ...prev]);
      // Also update products stock locally
      items.forEach(i => {
        setProducts(curr =>
          curr.map(p => p.id === i.product_id ? { ...p, stock: Math.max(0, p.stock - i.quantity) } : p)
        );
      });
      loadData(); // Re-sync analytics & pulse
      return txn;
    }
    return null;
  };

  // Connected Flow: Confirm Bill Payment (Online or Cash)
  const handlePaymentComplete = async (invoiceNumber: string, method: string) => {
    await SmartMartApi.payBill(invoiceNumber, method);
    setTransactions(prev =>
      prev.map(t => t.invoice_number === invoiceNumber ? { ...t, status: 'PAID', payment_mode: method as any } : t)
    );
    loadData();
  };

  // Connected Flow: Staff Attendance Punch
  const handlePunchAttendance = async (action: 'check_in' | 'check_out') => {
    return await SmartMartApi.punchAttendance(1, action);
  };

  // Connected Flow: Staff Task Status Update
  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    await SmartMartApi.updateStaffTaskStatus(taskId, newStatus);
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t)
    );
  };

  // Connected Flow: Admin Inventory Stock Adjustment
  const handleAdjustStock = async (productId: number, adjustment: number, reason: string) => {
    const updated = await SmartMartApi.adjustInventory(productId, adjustment, reason);
    if (updated) {
      setProducts(curr => curr.map(p => p.id === productId ? updated : p));
    } else {
      setProducts(curr =>
        curr.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock + adjustment) } : p)
      );
    }
    loadData();
  };

  // Connected Flow: Admin Receive Supplier Purchase Order
  const handleReceivePO = async (poId: number) => {
    await SmartMartApi.receivePurchaseOrder(poId);
    setPurchaseOrders(prev =>
      prev.map(po => po.id === poId ? { ...po, status: 'RECEIVED' } : po)
    );
    loadData(); // Will refresh product stock counts!
  };

  // Calculate total cart items count
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // Render Role Views
  const renderCurrentView = () => {
    if (showOnboarding) {
      return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
    }

    if (trackedOrder) {
      return (
        <OrderTrackingScreen
          order={trackedOrder}
          onBack={() => setTrackedOrder(null)}
        />
      );
    }

    // Role 1: CUSTOMER
    if (currentRole === 'CUSTOMER') {
      switch (activeTab) {
        case 'home':
          return (
            <CustomerHomeScreen
              departments={departments}
              products={products}
              recentBills={transactions}
              onNavigateToShop={(deptId) => {
                setShopCategoryFilter(deptId || null);
                setActiveTab('shop');
              }}
              onNavigateToMap={(prod) => {
                setTargetProductForMap(prod || null);
                setActiveTab('store');
              }}
              onAddToCart={handleAddToCart}
              onOpenBillPayment={(txn) => setSelectedBillForPayment(txn)}
              onOpenInvoice={(txn) => setSelectedInvoice(txn)}
              onSearchFocus={() => setIsSearchOpen(true)}
              currentUser={currentUser}
            />
          );
        case 'shop':
          return (
            <ShopOnlineScreen
              products={products}
              departments={departments}
              selectedDeptId={shopCategoryFilter}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onNavigateToMap={(prod) => {
                setTargetProductForMap(prod);
                setActiveTab('store');
              }}
              onNavigateToCart={() => setActiveTab('cart')}
            />
          );
        case 'store':
          return (
            <IndoorStoreMap
              targetProduct={targetProductForMap}
              onClearTarget={() => setTargetProductForMap(null)}
              onSelectProduct={(p) => setTargetProductForMap(p)}
            />
          );
        case 'cart':
          return (
            <CustomerCartScreen
              products={products}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onCheckout={handleOnlineCheckout}
              onContinueShopping={() => setActiveTab('shop')}
            />
          );
        case 'profile':
          return (
            <CustomerProfileScreen
              transactions={transactions}
              orders={orders}
              notifications={notifications}
              onOpenInvoice={(txn) => setSelectedInvoice(txn)}
              onSelectOrder={(ord) => setTrackedOrder(ord)}
              onLogout={() => setShowOnboarding(true)}
            />
          );
      }
    }

    // Role 2: STAFF
    if (currentRole === 'STAFF') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <StaffDashboardScreen
              tasks={tasks}
              onNavigateToAttendance={() => setActiveTab('attendance')}
              onNavigateToTasks={() => setActiveTab('tasks')}
              onNavigateToDepartment={() => setActiveTab('department')}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          );
        case 'attendance':
          return <StaffAttendanceScreen onPunch={handlePunchAttendance} />;
        case 'tasks':
          return <StaffTasksScreen tasks={tasks} onUpdateStatus={handleUpdateTaskStatus} />;
        case 'department':
          return (
            <StaffDepartmentScreen
              department={departments[0] || ({} as Department)}
              products={products}
              onNavigateToMap={(p) => {
                setTargetProductForMap(p);
                setCurrentRole('CUSTOMER');
                setActiveTab('store');
              }}
            />
          );
        case 'profile':
          return (
            <CustomerProfileScreen
              transactions={[]}
              orders={[]}
              notifications={notifications}
              onOpenInvoice={() => {}}
              onSelectOrder={() => {}}
              onLogout={() => handleSelectRole('CUSTOMER')}
            />
          );
      }
    }

    // Role 3: CASHIER
    if (currentRole === 'CASHIER') {
      switch (activeTab) {
        case 'home':
        case 'pos':
          return (
            <CashierPOSScreen
              products={products}
              onOpenScanner={() => setIsScannerOpen(true)}
              onGenerateBill={handleGeneratePosBill}
              onViewInvoice={(txn) => setSelectedInvoice(txn)}
            />
          );
        case 'transactions':
          return (
            <CustomerProfileScreen
              transactions={transactions}
              orders={[]}
              notifications={notifications}
              onOpenInvoice={(txn) => setSelectedInvoice(txn)}
              onSelectOrder={() => {}}
              onLogout={handleLogout}
              currentUser={currentUser}
            />
          );
        case 'notifications':
        case 'profile':
          return (
            <CustomerProfileScreen
              transactions={transactions}
              orders={orders}
              notifications={notifications}
              onOpenInvoice={(txn) => setSelectedInvoice(txn)}
              onSelectOrder={(ord) => setTrackedOrder(ord)}
              onLogout={handleLogout}
              currentUser={currentUser}
            />
          );
      }
    }

    // Role 4: ADMIN
    if (currentRole === 'ADMIN') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <AdminDashboardScreen
              dashboard={dashboard || ({} as any)}
              pulse={pulse || ({} as any)}
              insights={insights}
              activities={activities}
              onNavigateToInventory={() => setActiveTab('inventory')}
              onNavigateToSuppliers={() => setActiveTab('orders')}
              onNavigateToStaff={() => setActiveTab('staff')}
              onNavigateToReports={() => setActiveTab('more')}
            />
          );
        case 'inventory':
          return (
            <AdminInventoryScreen
              products={products}
              onAdjustStock={handleAdjustStock}
              onAddNewProduct={(newProd) => {
                const prodWithId: Product = {
                  id: Date.now(),
                  sku: `SKU-${Date.now().toString().slice(-4)}`,
                  barcode: newProd.barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                  name: newProd.name || 'New D-Mart Item',
                  brand: newProd.brand || 'D-Mart Select',
                  department: 1,
                  department_name: newProd.department_name || 'Grocery & Staples',
                  department_code: 'GROCERY',
                  department_color: '#EBD6DC',
                  price: newProd.price || 99,
                  mrp: newProd.mrp || 120,
                  discount_percent: Math.round((((newProd.mrp || 120) - (newProd.price || 99)) / (newProd.mrp || 120)) * 100),
                  stock: newProd.stock || 100,
                  min_stock: 20,
                  stock_status: 'HEALTHY',
                  unit: newProd.unit || '1 kg Pack',
                  image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
                  description: 'Fresh quality verified D-Mart supermarket inventory stock item.',
                  rating: 4.8,
                  is_featured: false,
                  is_bestseller: false,
                  is_active: true,
                };
                setProducts(prev => [prodWithId, ...prev]);
              }}
            />
          );
        case 'orders':
          return (
            <AdminSuppliersScreen
              suppliers={suppliers}
              purchaseOrders={purchaseOrders}
              onReceivePO={handleReceivePO}
            />
          );
        case 'staff':
          return <AdminStaffScreen />;
        case 'more':
          return <AdminReportsScreen />;
      }
    }

    return null;
  };

  // First Screen Gate: Unauthenticated users see the Premium SmartMart Auth Screen
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.appContainer}>
        <StatusBar style="dark" />
        <MobileFrame>
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            initialRole={currentRole}
            onSwitchPortal={handlePortalSwitch}
          />
        </MobileFrame>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar style="dark" />

      {/* Sleek Mobile Device Frame */}
      <MobileFrame>
        {/* Top 1-Tap Quick Role Switcher Bar (Only visible for internal staff/admin/cashier, NOT for customers) */}
        {!showOnboarding && !trackedOrder && currentRole !== 'CUSTOMER' && (
          <RoleSwitcherBar
            currentRole={currentRole}
            onSelectRole={handleSelectRole}
            notificationCount={notifications.length}
            onOpenNotifications={() => {
              if (currentRole === 'CUSTOMER') setActiveTab('profile');
            }}
            onLogout={handleLogout}
          />
        )}

        {/* Viewport Content */}
        <View style={styles.viewportContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Connecting to SmartMart Ecosystem...</Text>
            </View>
          ) : (
            renderCurrentView()
          )}
        </View>

        {/* Floating Light Glass Bottom Navigation */}
        {!showOnboarding && !trackedOrder && (
          <FloatingBottomNav
            role={currentRole}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab !== 'store') setTargetProductForMap(null);
            }}
            cartCount={cartItemCount}
            badgeCount={notifications.length}
          />
        )}

        {/* Barcode Scanner Simulator Modal */}
        <BarcodeScannerSimulator
          visible={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          products={products}
          onScanSuccess={(barcode) => {
            const found = products.find(p => p.barcode === barcode);
            if (found) {
              if (currentRole === 'CASHIER') {
                // Handled in POS view
              } else {
                setTargetProductForMap(found);
                setActiveTab('store');
              }
            }
          }}
        />

        {/* Digital Bill Payment Modal (UPI/Card/Cash) */}
        <DigitalBillPaymentModal
          visible={!!selectedBillForPayment}
          transaction={selectedBillForPayment}
          onClose={() => setSelectedBillForPayment(null)}
          onPaymentComplete={handlePaymentComplete}
        />

        {/* Official Digital Invoice Receipt Modal */}
        <DigitalInvoiceModal
          visible={!!selectedInvoice}
          transaction={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />

        {/* Global Search Modal */}
        <GlobalSearchModal
          visible={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={products}
          departments={departments}
          onSelectProduct={(p) => {
            setTargetProductForMap(p);
            setActiveTab('store');
          }}
          onSelectDepartment={(dId) => {
            setShopCategoryFilter(dId);
            setActiveTab('shop');
          }}
        />
      </MobileFrame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#352134',
  },
  viewportContent: {
    flex: 1,
    backgroundColor: '#674D66',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  }
});
