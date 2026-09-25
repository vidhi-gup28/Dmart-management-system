import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Product, Transaction } from '../../types';
import {
  ScanBarcode, Search, Plus, Minus, Trash2, Receipt,
  CheckCircle2, CreditCard, Banknote, UserCheck, ShieldCheck,
  QrCode, Smartphone, X, User, Phone, ShoppingBag, Sparkles,
  ArrowRight, Check, AlertCircle, RefreshCw
} from 'lucide-react-native';

interface CashierPOSScreenProps {
  products: Product[];
  onOpenScanner: () => void;
  onGenerateBill: (
    items: Array<{ product_id: number; quantity: number }>,
    customerPhone: string,
    paymentMode: string,
    customerName?: string
  ) => Promise<Transaction | null>;
  onViewInvoice: (txn: Transaction) => void;
}

export const CashierPOSScreen: React.FC<CashierPOSScreenProps> = ({
  products,
  onOpenScanner,
  onGenerateBill,
  onViewInvoice,
}) => {
  // Step 1: Customer Information (Mandatory for D-Mart billing)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerSaved, setCustomerSaved] = useState(false);

  // Step 2: Items Cart
  const [posCart, setPosCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'CARD'>('UPI');
  const [isGenerating, setIsGenerating] = useState(false);
  const [latestGeneratedBill, setLatestGeneratedBill] = useState<Transaction | null>(null);

  // Dynamic UPI QR Modal state with auto-filled total amount
  const [showUpiQrModal, setShowUpiQrModal] = useState(false);
  const [upiPaymentCompleted, setUpiPaymentCompleted] = useState(false);
  const [isUpiSimulating, setIsUpiSimulating] = useState(false);

  // Categories extraction
  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.department_name).filter(Boolean)))];

  // Fast search suggestions and filter
  const searchResults = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.includes(searchQuery)
      ).slice(0, 6)
    : [];

  const catalogProducts = products.filter(p => {
    if (selectedCategory !== 'ALL' && p.department_name !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.barcode.includes(q);
    }
    return true;
  });

  const handleAddItem = (prod: Product) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.product.id === prod.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product: prod, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    setPosCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as Array<{ product: Product; quantity: number }>
    );
  };

  const handleRemove = (productId: number) => {
    setPosCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Calculations
  const subtotal = posCart.reduce((sum, itm) => sum + (itm.product.price || 0) * itm.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const discount = subtotal > 800 ? 50 : 0;
  const total = Math.max(0, subtotal + tax - discount);

  const handleSaveCustomerInfo = () => {
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setCustomerSaved(true);
  };

  const handleGenerateBillSubmit = async () => {
    if (!customerSaved && (!customerPhone.trim() || customerPhone.length < 10)) {
      alert('Please enter customer mobile number and name first.');
      return;
    }
    if (posCart.length === 0) {
      alert('POS Cart is empty! Please search & add D-Mart products first.');
      return;
    }

    if (paymentMode === 'UPI') {
      // Trigger dynamic UPI QR Code Modal with pre-filled amount
      setShowUpiQrModal(true);
      return;
    }

    await finalizeBillGeneration('CASH');
  };

  const finalizeBillGeneration = async (mode: string) => {
    setIsGenerating(true);
    const itemsPayload = posCart.map(i => ({ product_id: i.product.id, quantity: i.quantity }));
    const createdTxn = await onGenerateBill(
      itemsPayload,
      customerPhone || '+91 98765 43210',
      mode,
      customerName || 'Walk-in Customer'
    );
    setIsGenerating(false);

    if (createdTxn) {
      setLatestGeneratedBill(createdTxn);
      setPosCart([]);
      setCustomerSaved(false);
      setCustomerName('');
      setCustomerPhone('');
      setShowUpiQrModal(false);
      setUpiPaymentCompleted(false);
    }
  };

  const simulateCustomerUpiPayment = () => {
    setIsUpiSimulating(true);
    setTimeout(() => {
      setIsUpiSimulating(false);
      setUpiPaymentCompleted(true);
      setTimeout(async () => {
        await finalizeBillGeneration('UPI (Auto-Pay Verified)');
      }, 1200);
    }, 1800);
  };

  return (
    <View style={styles.container}>
      {/* Step 1: Customer Information Card (Mandatory before adding items) */}
      <View style={styles.customerCard}>
        <View style={styles.customerCardHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 1</Text>
          </View>
          <Text style={styles.customerCardTitle}>Customer Information (Billing)</Text>
          {customerSaved ? (
            <TouchableOpacity onPress={() => setCustomerSaved(false)} style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedTagText}>Required for Bill</Text>
            </View>
          )}
        </View>

        {customerSaved ? (
          <View style={styles.savedCustomerInfo}>
            <View style={styles.savedRow}>
              <User size={14} color="#2B152A" />
              <Text style={styles.savedName}>{customerName || 'Walk-in Customer'}</Text>
            </View>
            <View style={styles.savedRow}>
              <Phone size={14} color="#047857" />
              <Text style={styles.savedPhone}>+91 {customerPhone.replace('+91', '').trim()}</Text>
              <View style={styles.verifiedCheck}>
                <Check size={11} color="#FFFFFF" />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.customerForm}>
            <View style={styles.inputField}>
              <User size={15} color="#8C6E89" />
              <TextInput
                style={styles.textInput}
                placeholder="Customer Name (e.g. Rahul Sharma)"
                placeholderTextColor="#A88CA5"
                value={customerName}
                onChangeText={setCustomerName}
              />
            </View>
            <View style={styles.inputField}>
              <Phone size={15} color="#8C6E89" />
              <TextInput
                style={styles.textInput}
                placeholder="Mobile Number (10 Digits)*"
                placeholderTextColor="#A88CA5"
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
                maxLength={13}
              />
            </View>
            <TouchableOpacity
              style={styles.saveCustomerBtn}
              onPress={handleSaveCustomerInfo}
              activeOpacity={0.8}
            >
              <Text style={styles.saveCustomerBtnText}>Proceed to Add D-Mart Items</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* POS Top Bar: Search & Scan Barcode */}
      <View style={styles.topControlBar}>
        <View style={styles.searchBox}>
          <Search size={16} color="#EBD6DC" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search all D-Mart items, brands, barcodes..."
            placeholderTextColor="rgba(235, 214, 220, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={15} color="#EBD6DC" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.scannerLaunchBtn} onPress={onOpenScanner} activeOpacity={0.8}>
          <ScanBarcode size={18} color="#FFFFFF" />
          <Text style={styles.scannerBtnText}>Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills Filter for Quick D-Mart Browsing */}
      <View style={styles.categoryScrollWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryPillText, selectedCategory === cat && styles.categoryPillTextActive]}>
                {cat === 'ALL' ? '🛒 All D-Mart Items' : cat.split('&')[0].trim()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main POS Register Area */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Add D-Mart Catalogue Grid */}
        <View style={styles.catalogSection}>
          <View style={styles.sectionHeader}>
            <ShoppingBag size={14} color="#EBD6DC" />
            <Text style={styles.sectionTitle}>
              D-Mart Catalogue ({catalogProducts.length} Items Available)
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickAddScroll}>
            {catalogProducts.slice(0, 10).map((prod) => (
              <TouchableOpacity
                key={prod.id}
                style={styles.quickItemCard}
                onPress={() => handleAddItem(prod)}
                activeOpacity={0.8}
              >
                <View style={styles.quickItemBrand}>
                  <Text style={styles.quickItemBrandText} numberOfLines={1}>{prod.brand}</Text>
                </View>
                <Text style={styles.quickItemName} numberOfLines={2}>{prod.name}</Text>
                <View style={styles.quickItemBottom}>
                  <Text style={styles.quickItemPrice}>₹{prod.price}</Text>
                  <View style={styles.quickAddCircle}>
                    <Plus size={13} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Generated Bill Success Card if just created */}
        {latestGeneratedBill && (
          <View style={styles.generatedSuccessCard}>
            <View style={styles.successHeader}>
              <CheckCircle2 size={20} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.successTitle}>Bill #{latestGeneratedBill.invoice_number} Generated!</Text>
                <Text style={styles.successSub}>
                  Customer: {latestGeneratedBill.customer_name || 'Customer'} ({latestGeneratedBill.customer_phone})
                </Text>
              </View>
            </View>
            <View style={styles.successSummaryRow}>
              <Text style={styles.successAmount}>Paid: ₹{latestGeneratedBill.total}</Text>
              <Text style={styles.successModeBadge}>{latestGeneratedBill.payment_mode}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewBillReceiptBtn}
              onPress={() => onViewInvoice(latestGeneratedBill)}
            >
              <Receipt size={14} color="#FFFFFF" />
              <Text style={styles.viewBillReceiptText}>View & Print Official Tax Invoice</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Current Cart Items Table */}
        <View style={styles.cartCard}>
          <View style={styles.cartCardHeader}>
            <Text style={styles.cartHeading}>CURRENT BILL ITEMS ({posCart.length})</Text>
            {posCart.length > 0 && (
              <TouchableOpacity onPress={() => setPosCart([])}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {posCart.length === 0 ? (
            <View style={styles.emptyCartBox}>
              <ShoppingBag size={28} color="#8C6E89" style={{ marginBottom: 6 }} />
              <Text style={styles.emptyCartText}>No items added yet.</Text>
              <Text style={styles.emptyCartSub}>Search D-Mart products or scan barcodes above to build the bill.</Text>
            </View>
          ) : (
            posCart.map(({ product, quantity }) => (
              <View key={product.id} style={styles.cartRow}>
                <View style={{ flex: 1.8 }}>
                  <Text style={styles.cartProdName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.cartBarcode}>{product.barcode} • ₹{product.price} ({product.unit})</Text>
                </View>

                {/* Quantity modifier */}
                <View style={styles.qtyBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQty(product.id, -1)}
                  >
                    <Minus size={11} color={'#FFFFFF'} />
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQty(product.id, 1)}
                  >
                    <Plus size={11} color={'#FFFFFF'} />
                  </TouchableOpacity>
                </View>

                {/* Subtotal */}
                <Text style={styles.cartSubtotal}>₹{product.price * quantity}</Text>

                {/* Delete */}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleRemove(product.id)}
                >
                  <Trash2 size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Bill Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>BILL SUMMARY</Text>
          <View style={styles.summaryLine}>
            <Text style={styles.lineLabel}>Customer</Text>
            <Text style={styles.lineVal}>{customerName || 'Walk-in'} ({customerPhone || 'Not set'})</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.lineLabel}>Items Subtotal</Text>
            <Text style={styles.lineVal}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.lineLabel}>CGST + SGST (5%)</Text>
            <Text style={styles.lineVal}>₹{tax}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryLine}>
              <Text style={styles.discountLabel}>D-Mart Mega Saver Discount</Text>
              <Text style={styles.discountVal}>- ₹{discount}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.totalLine}>
            <Text style={styles.totalHeading}>TOTAL DUE</Text>
            <Text style={styles.totalAmount}>₹{total}</Text>
          </View>
        </View>

        {/* Payment Mode Selector */}
        <View style={styles.paymentModeSection}>
          <Text style={styles.paymentHeading}>SELECT PAYMENT MODE</Text>
          <View style={styles.paymentTabs}>
            <TouchableOpacity
              style={[styles.payTab, paymentMode === 'UPI' && styles.payTabActive]}
              onPress={() => setPaymentMode('UPI')}
            >
              <QrCode size={16} color={paymentMode === 'UPI' ? '#2B152A' : '#EBD6DC'} />
              <Text style={[styles.payTabText, paymentMode === 'UPI' && styles.payTabTextActive]}>UPI QR (Instant)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payTab, paymentMode === 'CASH' && styles.payTabActive]}
              onPress={() => setPaymentMode('CASH')}
            >
              <Banknote size={16} color={paymentMode === 'CASH' ? '#2B152A' : '#EBD6DC'} />
              <Text style={[styles.payTabText, paymentMode === 'CASH' && styles.payTabTextActive]}>Cash Counter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payTab, paymentMode === 'CARD' && styles.payTabActive]}
              onPress={() => setPaymentMode('CARD')}
            >
              <CreditCard size={16} color={paymentMode === 'CARD' ? '#2B152A' : '#EBD6DC'} />
              <Text style={[styles.payTabText, paymentMode === 'CARD' && styles.payTabTextActive]}>Debit/Credit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Button: Generate Bill */}
        <TouchableOpacity
          style={[styles.generateBillBtn, (isGenerating || posCart.length === 0) && styles.btnDisabled]}
          onPress={handleGenerateBillSubmit}
          disabled={isGenerating || posCart.length === 0}
          activeOpacity={0.85}
        >
          {paymentMode === 'UPI' ? (
            <QrCode size={18} color="#FFFFFF" />
          ) : (
            <Receipt size={18} color="#FFFFFF" />
          )}
          <Text style={styles.generateBillText}>
            {isGenerating
              ? 'Processing Bill...'
              : paymentMode === 'UPI'
              ? `SHOW UPI QR • ₹${total}`
              : `GENERATE CASH BILL • ₹${total}`}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Dynamic UPI QR Code Modal with Auto-filled Amount */}
      <Modal visible={showUpiQrModal} transparent animationType="fade" onRequestClose={() => setShowUpiQrModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalSheet}>
            <View style={styles.qrModalHeader}>
              <View>
                <Text style={styles.qrModalTitle}>D-Mart UPI QR Payment</Text>
                <Text style={styles.qrModalSub}>Pre-filled Amount for Customer</Text>
              </View>
              <TouchableOpacity onPress={() => setShowUpiQrModal(false)} style={styles.closeBtn}>
                <X size={18} color="#2B152A" />
              </TouchableOpacity>
            </View>

            {/* Customer & Bill Callout */}
            <View style={styles.qrCustomerPill}>
              <User size={13} color="#674D66" />
              <Text style={styles.qrCustomerText}>
                Billing to: <Text style={{ fontWeight: '800' }}>{customerName || 'Walk-in'}</Text> ({customerPhone || 'N/A'})
              </Text>
            </View>

            {/* Auto-filled Amount Banner */}
            <View style={styles.qrAmountBox}>
              <Text style={styles.qrAmountLabel}>PAYABLE AMOUNT (AUTO-FILLED)</Text>
              <Text style={styles.qrAmountValue}>₹{total}</Text>
              <Text style={styles.qrAmountNote}>No manual amount entry needed on scanner app</Text>
            </View>

            {/* Stylized Dynamic QR Code Frame */}
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeBorder}>
                <QrCode size={160} color="#2B152A" />
                <View style={styles.qrCenterBadge}>
                  <Text style={styles.qrCenterText}>DMART</Text>
                </View>
              </View>
              <Text style={styles.upiIdText}>UPI ID: dmart.pos.lane3@axisbank</Text>
            </View>

            {/* Supported UPI Apps Row */}
            <View style={styles.supportedAppsRow}>
              <Text style={styles.supportedAppsText}>Scan with Google Pay, PhonePe, Paytm or BHIM</Text>
            </View>

            {/* Payment Simulation Controls */}
            {isUpiSimulating ? (
              <View style={styles.simulatingBox}>
                <RefreshCw size={18} color="#C24379" style={{ transform: [{ rotate: '45deg' }] }} />
                <Text style={styles.simulatingText}>Customer scanned QR... confirming ₹{total} payment</Text>
              </View>
            ) : upiPaymentCompleted ? (
              <View style={styles.upiSuccessBox}>
                <CheckCircle2 size={20} color="#059669" />
                <Text style={styles.upiSuccessText}>Payment of ₹{total} Received Successfully!</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={simulateCustomerUpiPayment}
                activeOpacity={0.85}
              >
                <Smartphone size={16} color="#FFFFFF" />
                <Text style={styles.simulateScanText}>Simulate Customer Scan & Pay ₹{total}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#674D66',
  },
  // Step 1: Customer Card
  customerCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    borderRadius: 18,
    padding: 12,
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  customerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepBadge: {
    backgroundColor: '#C24379',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  stepBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  customerCardTitle: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  verifiedTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
  },
  editBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  editText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C24379',
  },
  customerForm: {
    gap: 8,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(103, 77, 102, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: 'rgba(103, 77, 102, 0.15)',
  },
  textInput: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2B152A',
  },
  saveCustomerBtn: {
    backgroundColor: '#674D66',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 2,
  },
  saveCustomerBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  savedCustomerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  savedName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  savedPhone: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#047857',
  },
  verifiedCheck: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // D-Mart Catalogue Section
  catalogSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EBD6DC',
    letterSpacing: 0.5,
  },
  quickAddScroll: {
    gap: 8,
  },
  quickItemCard: {
    width: 135,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 214, 220, 0.85)',
    justifyContent: 'space-between',
  },
  quickItemBrand: {
    backgroundColor: 'rgba(103, 77, 102, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  quickItemBrandText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#674D66',
  },
  quickItemName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2B152A',
    height: 30,
    lineHeight: 14,
  },
  quickItemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  quickItemPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#166534',
  },
  quickAddCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C24379',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScrollWrap: {
    marginVertical: 4,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  categoryPillActive: {
    backgroundColor: '#EBD6DC',
    borderColor: '#FFFFFF',
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  categoryPillTextActive: {
    color: '#2B152A',
    fontWeight: '800',
  },
  successSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  successAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
  },
  successModeBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    backgroundColor: '#DCFCE7',
    color: '#166534',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emptyCartSub: {
    fontSize: 9.5,
    color: '#8C6E89',
    textAlign: 'center',
    marginTop: 3,
    paddingHorizontal: 16,
  },
  // Dynamic UPI QR Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(43, 21, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  qrModalSheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  qrModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  qrModalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2B152A',
  },
  qrModalSub: {
    fontSize: 10.5,
    color: '#674D66',
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  qrCustomerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(103, 77, 102, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  qrCustomerText: {
    fontSize: 11,
    color: '#2B152A',
  },
  qrAmountBox: {
    backgroundColor: '#FDF2F8',
    borderColor: '#FBCFE8',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  qrAmountLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#BE185D',
    letterSpacing: 0.6,
  },
  qrAmountValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#9D174D',
    marginVertical: 2,
  },
  qrAmountNote: {
    fontSize: 9.5,
    color: '#BE185D',
    fontWeight: '600',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 6,
  },
  qrCodeBorder: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#EBD6DC',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenterBadge: {
    position: 'absolute',
    backgroundColor: '#C24379',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qrCenterText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  upiIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#674D66',
    marginTop: 6,
  },
  supportedAppsRow: {
    alignItems: 'center',
    marginVertical: 6,
  },
  supportedAppsText: {
    fontSize: 9.5,
    color: '#8C6E89',
    fontWeight: '600',
    textAlign: 'center',
  },
  simulateScanBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 14,
    marginTop: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  simulateScanText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  simulatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#FDF2F8',
    borderRadius: 14,
    marginTop: 6,
  },
  simulatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BE185D',
  },
  upiSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  upiSuccessText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  topControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#FFFFFF',
  },
  scannerLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C24379',
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 16,
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  scannerBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  searchDropdown: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 214, 220, 0.90)',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 5,
    zIndex: 99,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1E5EC',
  },
  dropdownName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2B152A',
  },
  dropdownSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#674D66',
    marginTop: 1,
  },
  dropdownPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#166534',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  customerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  customerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B152A',
  },
  customerInput: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#2B152A',
    height: 30,
  },
  generatedSuccessCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#10B981',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  successTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  successSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 3,
  },
  successSync: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#065F46',
    marginTop: 2,
  },
  viewBillReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#674D66',
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  viewBillReceiptText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  cartCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C386A',
    letterSpacing: 0.8,
  },
  clearText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#E11D48',
  },
  emptyCartBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 11,
    color: '#6A4F68',
    fontWeight: '600',
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1E5EC',
  },
  cartProdName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  cartBarcode: {
    fontSize: 9,
    color: '#6A4F68',
    fontWeight: '600',
    marginTop: 1,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(103, 77, 102, 0.10)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
  },
  qtyBtn: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#674D66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2B152A',
    paddingHorizontal: 6,
  },
  cartSubtotal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#166534',
    width: 48,
    textAlign: 'right',
  },
  deleteBtn: {
    marginLeft: 8,
    padding: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  summaryHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C386A',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  lineLabel: {
    fontSize: 11.5,
    color: '#6A4F68',
    fontWeight: '600',
  },
  lineVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  discountLabel: {
    fontSize: 11.5,
    color: '#059669',
    fontWeight: '700',
  },
  discountVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1E5EC',
    marginVertical: 8,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2B152A',
  },
  totalAmount: {
    fontSize: 19,
    fontWeight: '900',
    color: '#166534',
  },
  paymentModeSection: {
    marginBottom: 14,
  },
  paymentHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EBD6DC',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  paymentTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  payTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  payTabActive: {
    backgroundColor: '#EBD6DC',
    borderColor: '#FFFFFF',
  },
  payTabText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  payTabTextActive: {
    color: '#2B152A',
    fontWeight: '800',
  },
  generateBillBtn: {
    backgroundColor: '#C24379',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 18,
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  generateBillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  }
});
