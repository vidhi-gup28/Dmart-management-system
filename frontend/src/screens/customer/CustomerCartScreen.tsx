import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Product } from '../../types';
import { ShoppingCart, Plus, Minus, Trash2, Tag, MapPin, Truck, Check, ArrowRight, Edit3, X, Home, Navigation } from 'lucide-react-native';

interface CustomerCartScreenProps {
  products: Product[];
  cart: Record<number, number>;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onClearCart: () => void;
  onCheckout: (address: string, slot: string, promoDiscount: number) => void;
  onContinueShopping: () => void;
}

export const CustomerCartScreen: React.FC<CustomerCartScreenProps> = ({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  onContinueShopping,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // User delivery address state
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103');
  const [addressLabel, setAddressLabel] = useState('Home');
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Address form fields
  const [flatNo, setFlatNo] = useState('Flat 402, Green Glen Heights');
  const [areaStreet, setAreaStreet] = useState('Bellandur, Outer Ring Road');
  const [cityPincode, setCityPincode] = useState('Bengaluru - 560103');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const handleSaveAddress = () => {
    if (!flatNo.trim() || !areaStreet.trim()) {
      alert('Please enter your house/flat number and street area.');
      return;
    }
    const fullAddr = `${flatNo.trim()}, ${areaStreet.trim()}, ${cityPincode.trim()}`;
    setDeliveryAddress(fullAddr);
    setAddressLabel(addressType);
    setShowAddressModal(false);
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const prod = products.find(p => p.id === parseInt(id));
      return prod && qty > 0 ? { product: prod, quantity: qty } : null;
    })
    .filter(Boolean) as Array<{ product: Product; quantity: number }>;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 35;
  const memberDiscount = subtotal > 800 ? 50 : 0;
  const tax = Math.round(subtotal * 0.05);
  const finalTotal = Math.max(0, subtotal + deliveryFee + tax - memberDiscount - promoDiscount);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'GROCERY15' || promoCode.toUpperCase() === 'SMARTMART') {
      setAppliedPromo(promoCode.toUpperCase());
      setPromoDiscount(Math.round(subtotal * 0.15));
    } else {
      alert('Invalid promo code. Try "GROCERY15"');
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <ShoppingCart size={40} color={'#EBD6DC'} />
        </View>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySub}>Add fresh groceries and essentials to get instant delivery!</Text>
        <TouchableOpacity style={styles.startShopBtn} onPress={onContinueShopping} activeOpacity={0.85}>
          <Text style={styles.startShopText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>My Shopping Cart</Text>
        <TouchableOpacity onPress={onClearCart}>
          <Text style={styles.clearCartText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Delivery Address Card with Interactive Change/Add Button */}
      <View style={styles.addressCard}>
        <View style={styles.addressIconCircle}>
          <MapPin size={18} color={'#674D66'} />
        </View>
        <View style={{ flex: 1, marginRight: 8 }}>
          <View style={styles.addrHeaderRow}>
            <Text style={styles.addressLabel}>Delivering To: {addressLabel}</Text>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Default</Text>
            </View>
          </View>
          <Text style={styles.addressText} numberOfLines={2}>
            {deliveryAddress}
          </Text>
          <View style={styles.slotPill}>
            <Truck size={12} color="#FFFFFF" />
            <Text style={styles.slotText}>Express 45-Mins Slot Available</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.changeAddressBtn}
          onPress={() => setShowAddressModal(true)}
          activeOpacity={0.8}
        >
          <Edit3 size={13} color="#FFFFFF" />
          <Text style={styles.changeAddressBtnText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items List */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionHeading}>BASKET ITEMS ({cartItems.length})</Text>
        {cartItems.map(({ product, quantity }) => (
          <View key={product.id} style={styles.cartItemRow}>
            <View style={[styles.itemImg, { backgroundColor: 'rgba(103, 77, 102, 0.10)' }]}>
              <Text style={styles.itemImgText}>{product.brand.charAt(0)}</Text>
            </View>

            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={styles.itemTitle} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.itemSub}>{product.unit} • ₹{product.price} each</Text>
            </View>

            <View style={styles.qtyContainer}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => onRemoveFromCart(product)}>
                <Minus size={12} color={'#FFFFFF'} />
              </TouchableOpacity>
              <Text style={styles.qtyNumber}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => onAddToCart(product)}>
                <Plus size={12} color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>

            <Text style={styles.itemTotal}>₹{product.price * quantity}</Text>
          </View>
        ))}
      </View>

      {/* Promo Code Voucher Box */}
      <View style={styles.promoCard}>
        <View style={styles.promoRow}>
          <Tag size={16} color={'#674D66'} />
          <TextInput
            style={styles.promoInput}
            placeholder="Enter promo code (e.g. GROCERY15)"
            placeholderTextColor={COLORS.textMuted}
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyBtn} onPress={handleApplyPromo}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>
        {appliedPromo && (
          <View style={styles.appliedBanner}>
            <Check size={12} color="#1A6FA8" />
            <Text style={styles.appliedText}>Code {appliedPromo} applied: Saved ₹{promoDiscount}!</Text>
          </View>
        )}
      </View>

      {/* Order Summary Breakdown */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>BILL DETAILS</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items Subtotal</Text>
          <Text style={styles.summaryVal}>₹{subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryVal}>
            {deliveryFee === 0 ? <Text style={{ color: '#94A3B8' }}>FREE</Text> : `₹${deliveryFee}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Estimated GST (5%)</Text>
          <Text style={styles.summaryVal}>₹{tax}</Text>
        </View>
        {memberDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.discountLabel}>SmartMart Member Discount</Text>
            <Text style={styles.discountVal}>- ₹{memberDiscount}</Text>
          </View>
        )}
        {promoDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.discountLabel}>Voucher Discount</Text>
            <Text style={styles.discountVal}>- ₹{promoDiscount}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TO PAY</Text>
          <Text style={styles.totalVal}>₹{finalTotal}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={() => onCheckout(deliveryAddress, 'Express 45 Mins', promoDiscount)}
        activeOpacity={0.85}
      >
        <Text style={styles.checkoutText}>Proceed to Checkout • ₹{finalTotal}</Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={{ height: 100 }} />

      {/* Edit / Add Delivery Address Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} color="#C24379" />
                <Text style={styles.modalTitle}>Delivery Address</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddressModal(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Address Type Selector */}
            <Text style={styles.inputLabel}>SAVE ADDRESS AS</Text>
            <View style={styles.tagRow}>
              {(['Home', 'Work', 'Other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typePill, addressType === type && styles.typePillActive]}
                  onPress={() => setAddressType(type)}
                >
                  <Text style={[styles.typePillText, addressType === type && styles.typePillTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Flat / House Number */}
            <Text style={styles.inputLabel}>FLAT / HOUSE NO. / BUILDING *</Text>
            <TextInput
              style={styles.modalInput}
              value={flatNo}
              onChangeText={setFlatNo}
              placeholder="e.g. Flat 402, Green Glen Heights"
              placeholderTextColor="#94A3B8"
            />

            {/* Street / Locality */}
            <Text style={styles.inputLabel}>STREET / LOCALITY / AREA *</Text>
            <TextInput
              style={styles.modalInput}
              value={areaStreet}
              onChangeText={setAreaStreet}
              placeholder="e.g. Bellandur, Outer Ring Road"
              placeholderTextColor="#94A3B8"
            />

            {/* City & Pincode */}
            <Text style={styles.inputLabel}>CITY & PINCODE *</Text>
            <TextInput
              style={styles.modalInput}
              value={cityPincode}
              onChangeText={setCityPincode}
              placeholder="e.g. Bengaluru - 560103"
              placeholderTextColor="#94A3B8"
            />

            {/* Save Address Button */}
            <TouchableOpacity style={styles.saveAddressBtn} onPress={handleSaveAddress} activeOpacity={0.85}>
              <Check size={16} color="#FFFFFF" />
              <Text style={styles.saveAddressBtnText}>Confirm & Deliver Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#674D66',
  },
  scrollPadding: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  clearCartText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FDA4AF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#674D66',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptySub: {
    fontSize: 12,
    color: '#EBD6DC',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  startShopBtn: {
    backgroundColor: '#C24379',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  startShopText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  addrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#166534',
  },
  addressIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(103, 77, 102, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addressLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  addressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
    lineHeight: 15,
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#674D66',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  slotText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  changeAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C24379',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    alignSelf: 'center',
  },
  changeAddressBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2B152A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typePillActive: {
    backgroundColor: '#C24379',
    borderColor: '#C24379',
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  typePillTextActive: {
    color: '#FFFFFF',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12.5,
    color: '#1E293B',
    fontWeight: '600',
  },
  saveAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 18,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveAddressBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  itemsSection: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C386A',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1E5EC',
  },
  itemImg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImgText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#674D66',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2B152A',
  },
  itemSub: {
    fontSize: 10,
    color: '#6A4F68',
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(103, 77, 102, 0.10)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 10,
  },
  qtyBtn: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#674D66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B152A',
    paddingHorizontal: 8,
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    width: 50,
    textAlign: 'right',
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    fontSize: 11,
    color: '#2B152A',
    fontWeight: '600',
    height: 36,
  },
  applyBtn: {
    backgroundColor: '#C24379',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  applyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  appliedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#166534',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C386A',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 11.5,
    color: '#6A4F68',
  },
  summaryVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2B152A',
  },
  discountLabel: {
    fontSize: 11.5,
    color: '#059669',
  },
  discountVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1E5EC',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2B152A',
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#166534',
  },
  checkoutBtn: {
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
  checkoutText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  }
});
