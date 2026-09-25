import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { COLORS } from '../../theme/colors';
import { GLASS } from '../../theme/glassStyles';
import { AnimatedHero } from '../../components/AnimatedHero';
import { Product, Department, Transaction } from '../../types';
import {
  Search, ShoppingBag, MapPin, Sparkles, Tag, ChevronRight,
  Plus, Check, ArrowRight, Receipt, Clock, Star, Flame
} from 'lucide-react-native';

interface CustomerHomeScreenProps {
  departments: Department[];
  products: Product[];
  recentBills: Transaction[];
  onNavigateToShop: (deptId?: number) => void;
  onNavigateToMap: (product?: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenBillPayment: (txn: Transaction) => void;
  onOpenInvoice: (txn: Transaction) => void;
  onSearchFocus: () => void;
  currentUser?: any;
}

export const CustomerHomeScreen: React.FC<CustomerHomeScreenProps> = ({
  departments,
  products,
  recentBills,
  onNavigateToShop,
  onNavigateToMap,
  onAddToCart,
  onOpenBillPayment,
  onOpenInvoice,
  onSearchFocus,
  currentUser,
}) => {
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});

  const handleAdd = (prod: Product) => {
    onAddToCart(prod);
    setAddedIds(prev => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [prod.id]: false }));
    }, 1200);
  };

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 8);
  const bestSellers = products.filter(p => p.is_bestseller).slice(0, 8);
  const customerName = currentUser?.name || 'Pooja Verma';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentPadding}>
      {/* Top SmartMart Connected Brand & Welcome Bar */}
      <View style={styles.welcomeBar}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Sparkles size={11} color="#014872" />
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#F1F5F9', letterSpacing: 0.6 }}>
              SMARTMART • CONNECTED STORE
            </Text>
          </View>
          <Text style={styles.userName}>{customerName}</Text>
          <Text style={styles.greetingText}>Your Store. Digitally Connected.</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Sparkles size={12} color="#F59E0B" />
          <Text style={styles.pointsText}>
            {currentUser?.profile?.loyalty_points || 340} SmartPts
          </Text>
        </View>
      </View>

      {/* Global Search Bar */}
      <TouchableOpacity style={styles.searchBar} onPress={onSearchFocus} activeOpacity={0.85}>
        <Search size={18} color={COLORS.textSecondary} />
        <Text style={styles.searchPlaceholder}>Search 300+ groceries, brands, aisles...</Text>
      </TouchableOpacity>

      {/* Continuously Animated Futuristic Supermarket Hero */}
      <AnimatedHero />

      {/* Primary Dual Actions: 🛍 SHOP ONLINE & 📍 SHOP IN STORE */}
      <View style={styles.dualActionsContainer}>
        <TouchableOpacity
          style={[styles.actionCard, styles.onlineShopCard]}
          onPress={() => onNavigateToShop()}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconBoxBlue}>
            <ShoppingBag size={22} color="#3B82F6" />
          </View>
          <View style={styles.actionTextBox}>
            <Text style={styles.actionTitle}>SHOP ONLINE</Text>
            <Text style={styles.actionSub}>Express 2-Hr Delivery</Text>
          </View>
          <ArrowRight size={16} color="#3B82F6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.inStoreCard]}
          onPress={() => onNavigateToMap()}
          activeOpacity={0.8}
        >
          <View style={styles.actionIconBoxPurple}>
            <MapPin size={22} color="#8B5CF6" />
          </View>
          <View style={styles.actionTextBox}>
            <Text style={styles.actionTitle}>SHOP IN STORE</Text>
            <Text style={styles.actionSub}>Aisle & Shelf Map</Text>
          </View>
          <ArrowRight size={16} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Pending / Recent In-Store Bill Alert */}
      {recentBills && recentBills.length > 0 && (
        <View style={styles.billAlertCard}>
          <View style={styles.billAlertHeader}>
            <View style={styles.billAlertBadge}>
              <Receipt size={14} color="#014872" />
              <Text style={styles.billAlertBadgeText}>INSTORE CASHIER BILL</Text>
            </View>
            <Text style={styles.billTime}>Just Now</Text>
          </View>

          <View style={styles.billBody}>
            <View style={{ flex: 1 }}>
              <Text style={styles.billTitle}>Bill #{recentBills[0].invoice_number}</Text>
              <Text style={styles.billItemsCount}>
                {recentBills[0].items?.length || 3} items • Cashier #{recentBills[0].cashier_name || 'Lane 2'}
              </Text>
            </View>
            <Text style={styles.billAmount}>₹{recentBills[0].total}</Text>
          </View>

          <View style={styles.billActions}>
            <TouchableOpacity
              style={styles.viewInvoiceBtn}
              onPress={() => onOpenInvoice(recentBills[0])}
            >
              <Text style={styles.viewInvoiceText}>View Receipt</Text>
            </TouchableOpacity>

            {recentBills[0].status === 'PENDING' ? (
              <TouchableOpacity
                style={styles.payNowBtn}
                onPress={() => onOpenBillPayment(recentBills[0])}
              >
                <Text style={styles.payNowText}>Pay Online / Cash</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.paidChip}>
                <Check size={12} color="#1A6FA8" />
                <Text style={styles.paidChipText}>PAID</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Supermarket Departments Horizontal Carousel */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Departments</Text>
        <TouchableOpacity onPress={() => onNavigateToShop()}>
          <Text style={styles.seeAllText}>View All ({departments.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.deptScroll}>
        {departments.map((dept) => {
          const getDeptEmoji = (name: string) => {
            if (name.includes('Grocery')) return '🌾';
            if (name.includes('Dairy')) return '🥛';
            if (name.includes('Snack')) return '🍿';
            if (name.includes('Beverage')) return '🧃';
            if (name.includes('Personal')) return '✨';
            if (name.includes('Home')) return '🧼';
            if (name.includes('Clean')) return '🧹';
            if (name.includes('Fruit') || name.includes('Veg')) return '🍎';
            if (name.includes('Bakery')) return '🍞';
            if (name.includes('Elec')) return '⚡';
            if (name.includes('Cloth') || name.includes('Apparel')) return '👕';
            if (name.includes('Footwear')) return '👟';
            return '🛍️';
          };
          return (
            <TouchableOpacity
              key={dept.id}
              style={styles.deptCard}
              onPress={() => onNavigateToShop(dept.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.deptIconCircle, { backgroundColor: 'rgba(235, 214, 220, 0.25)' }]}>
                <Text style={{ fontSize: 20 }}>
                  {getDeptEmoji(dept.name)}
                </Text>
              </View>
              <Text style={styles.deptName} numberOfLines={1}>{dept.name.split('&')[0].trim()}</Text>
              <Text style={styles.deptFloor}>{dept.floor.split(' ')[0]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Popular Products Carousel */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeftWithIcon}>
          <Flame size={16} color="#F97316" />
          <Text style={styles.sectionTitle}>Popular Products</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigateToShop()}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
        {featuredProducts.map((prod) => (
          <View key={prod.id} style={styles.productCard}>
            {/* Discount Badge */}
            {prod.discount_percent > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{prod.discount_percent}% OFF</Text>
              </View>
            )}

            {/* Product Image Placeholder */}
            <View style={styles.imageContainer}>
              <View style={[styles.imgPlaceholder, { backgroundColor: `${prod.department_color || '#014872'}14` }]}>
                <Text style={styles.imgTag}>{prod.brand.split(' ')[0]}</Text>
              </View>
            </View>

            {/* Product Details */}
            <Text style={styles.prodBrand}>{prod.brand}</Text>
            <Text style={styles.prodName} numberOfLines={2}>{prod.name}</Text>
            <Text style={styles.prodUnit}>{prod.unit}</Text>

            {/* Price Row */}
            <View style={styles.priceRow}>
              <Text style={styles.prodPrice}>₹{prod.price}</Text>
              {prod.mrp > prod.price && (
                <Text style={styles.prodMrp}>₹{prod.mrp}</Text>
              )}
            </View>

            {/* Action Buttons: Add & Find in Store */}
            <View style={styles.cardBtnRow}>
              <TouchableOpacity
                style={styles.findInStoreBtn}
                onPress={() => onNavigateToMap(prod)}
                activeOpacity={0.7}
              >
                <MapPin size={12} color={'#674D66'} />
                <Text style={styles.findInStoreText}>Locate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addBtn, addedIds[prod.id] && styles.addedBtn]}
                onPress={() => handleAdd(prod)}
                activeOpacity={0.8}
              >
                {addedIds[prod.id] ? (
                  <Check size={14} color="#FFFFFF" />
                ) : (
                  <Plus size={14} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Promotional Offers Banner */}
      <View style={styles.offerBanner}>
        <View style={styles.offerContent}>
          <View style={styles.offerBadge}>
            <Tag size={12} color="#FFFFFF" />
            <Text style={styles.offerBadgeText}>SUPER SAVER DEALS</Text>
          </View>
          <Text style={styles.offerHeading}>Up to 25% OFF Grocery & Dairy</Text>
          <Text style={styles.offerSub}>Save on everyday essentials, Aashirvaad Atta, and Amul Milk</Text>
        </View>
        <TouchableOpacity style={styles.offerCta} onPress={() => onNavigateToShop()}>
          <Text style={styles.offerCtaText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      {/* Best Sellers Section */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeftWithIcon}>
          <Star size={16} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Best Sellers Today</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigateToShop()}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
        {bestSellers.map((prod) => (
          <View key={prod.id} style={styles.productCard}>
            <View style={styles.imageContainer}>
              <View style={[styles.imgPlaceholder, { backgroundColor: `${prod.department_color || '#1A6FA8'}14` }]}>
                <Text style={styles.imgTag}>{prod.brand.split(' ')[0]}</Text>
              </View>
            </View>
            <Text style={styles.prodBrand}>{prod.brand}</Text>
            <Text style={styles.prodName} numberOfLines={2}>{prod.name}</Text>
            <Text style={styles.prodUnit}>{prod.unit}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.prodPrice}>₹{prod.price}</Text>
              {prod.mrp > prod.price && <Text style={styles.prodMrp}>₹{prod.mrp}</Text>}
            </View>
            <View style={styles.cardBtnRow}>
              <TouchableOpacity
                style={styles.findInStoreBtn}
                onPress={() => onNavigateToMap(prod)}
                activeOpacity={0.7}
              >
                <MapPin size={12} color={'#FED7B8'} />
                <Text style={styles.findInStoreText}>Locate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addBtn, addedIds[prod.id] && styles.addedBtn]}
                onPress={() => handleAdd(prod)}
                activeOpacity={0.8}
              >
                {addedIds[prod.id] ? <Check size={14} color="#FFFFFF" /> : <Plus size={14} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Padding for floating nav */}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#674D66', // DEEP MAUVE (Image 2)
  },
  contentPadding: {
    paddingBottom: 24,
  },
  welcomeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EBD6DC',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.40)',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  searchPlaceholder: {
    fontSize: 12.5,
    color: '#EBD6DC',
  },
  dualActionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1.5,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 3,
  },
  onlineShopCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EBD6DC',
  },
  inStoreCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#C24379',
  },
  actionIconBoxBlue: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(235, 214, 220, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionIconBoxPurple: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(194, 67, 121, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionSub: {
    fontSize: 9.5,
    color: '#EBD6DC',
    marginTop: 1,
  },
  billAlertCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.16)', // Frosted glass
    borderColor: 'rgba(235, 214, 220, 0.35)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
  billAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billAlertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  billAlertBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EBD6DC',
    letterSpacing: 0.5,
  },
  billTime: {
    fontSize: 10,
    color: '#EBD6DC',
    opacity: 0.85,
  },
  billBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  billItemsCount: {
    fontSize: 11,
    color: '#EBD6DC',
    opacity: 0.85,
    marginTop: 1,
  },
  billAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EBD6DC',
  },
  billActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewInvoiceBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderColor: 'rgba(235, 214, 220, 0.40)',
    borderWidth: 1.2,
    borderRadius: 12,
    paddingVertical: 7,
    alignItems: 'center',
  },
  viewInvoiceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  payNowBtn: {
    flex: 1.2,
    backgroundColor: '#C24379',
    borderRadius: 12,
    paddingVertical: 7,
    alignItems: 'center',
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  payNowText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paidChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paidChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A7F3D0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  headerLeftWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  deptScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  deptCard: {
    width: 82,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1.2,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 4,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  deptIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  deptInitial: {
    fontSize: 18,
    fontWeight: '800',
  },
  deptName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  deptFloor: {
    fontSize: 8.5,
    color: '#EBD6DC',
    marginTop: 1,
  },
  productScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productCard: {
    width: 148,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 10,
    position: 'relative',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  discountText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  imageContainer: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  imgPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(103, 77, 102, 0.08)',
  },
  imgTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#674D66',
    opacity: 0.85,
  },
  prodBrand: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8C386A',
    textTransform: 'uppercase',
  },
  prodName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B152A', // Sharp deep plum text
    height: 28,
    marginTop: 2,
  },
  prodUnit: {
    fontSize: 9.5,
    color: '#6A4F68',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  prodPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#166534', // Rich green price
  },
  prodMrp: {
    fontSize: 9.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  cardBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  findInStoreBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(103, 77, 102, 0.10)',
    borderColor: '#674D66',
    borderWidth: 1.2,
    borderRadius: 10,
    paddingVertical: 5,
  },
  findInStoreText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#674D66',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#C24379',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  addedBtn: {
    backgroundColor: '#10B981',
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(235, 214, 220, 0.35)',
    borderWidth: 1.5,
    marginHorizontal: 16,
    marginVertical: 14,
    borderRadius: 22,
    padding: 16,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 18,
    elevation: 5,
  },
  offerContent: {
    flex: 1,
    marginRight: 10,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C24379',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  offerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  offerHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  offerSub: {
    fontSize: 10.5,
    color: '#EBD6DC',
    marginTop: 2,
  },
  offerCta: {
    backgroundColor: '#EBD6DC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  offerCtaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B152A', // Deep plum text: 100% visible on Soft Pink Blush!
  }
});
