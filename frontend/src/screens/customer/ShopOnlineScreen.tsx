import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Product, Department } from '../../types';
import { Search, MapPin, Plus, Minus, Check, ArrowUpDown, ShoppingCart } from 'lucide-react-native';

interface ShopOnlineScreenProps {
  products: Product[];
  departments: Department[];
  selectedDeptId?: number | null;
  cart: Record<number, number>;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onNavigateToMap: (product: Product) => void;
  onNavigateToCart: () => void;
}

const DMART_CATEGORIES: Array<{ id: number; name: string; hindi: string; icon: string; desc: string }> = [
  { id: 37, name: 'Grocery & Food', hindi: 'राशन & दालें', icon: '🌾', desc: 'Atta, Rice, Dal, Oil' },
  { id: 43, name: 'Home Care', hindi: 'घर का सामान', icon: '🧼', desc: 'Surf, Cleaners, Mops' },
  { id: 41, name: 'Snacks & Namkeen', hindi: 'नाश्ता & नमकीन', icon: '🍿', desc: 'Biscuits, Chips, Maggi' },
  { id: 38, name: 'Dairy & Fresh', hindi: 'दूध & फ्रेश', icon: '🥛', desc: 'Milk, Paneer, Butter' },
  { id: 40, name: 'Beverages & Tea', hindi: 'चाय & ड्रिंक्स', icon: '🧃', desc: 'Tea, Coffee, Cold drinks' },
  { id: 42, name: 'Personal Care', hindi: 'साबुन & शैम्पू', icon: '✨', desc: 'Soaps, Dental, Skincare' },
  { id: 48, name: 'Fruits & Veg', hindi: 'फल & सब्जियां', icon: '🍎', desc: 'Fresh Produce' },
  { id: 39, name: 'Bakery & Bread', hindi: 'बेकरी & ब्रेड', icon: '🍞', desc: 'Breads, Buns, Toast' },
  { id: 44, name: 'Cleaning & Mops', hindi: 'सफाई का सामान', icon: '🧹', desc: 'Harpic, Lizol' },
  { id: 45, name: 'Kitchen & Dining', hindi: 'किचन & बर्तन', icon: '🍳', desc: 'Bottles, Utensils' },
];

export const ShopOnlineScreen: React.FC<ShopOnlineScreenProps> = ({
  products,
  departments,
  selectedDeptId: initialDeptId,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onNavigateToMap,
  onNavigateToCart,
}) => {
  const [activeDept, setActiveDept] = useState<number | null>(initialDeptId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_LOW' | 'PRICE_HIGH' | 'DISCOUNT'>('POPULAR');

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeDept !== null) {
      list = list.filter(p => {
        if (p.department === activeDept) return true;
        const targetCategory = DMART_CATEGORIES.find(c => c.id === activeDept);
        if (targetCategory) {
          const catKey = targetCategory.name.split('&')[0].trim().toLowerCase();
          return (p.department_name && p.department_name.toLowerCase().includes(catKey)) ||
                 (p.name && p.name.toLowerCase().includes(catKey));
        }
        return false;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.department_name.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'PRICE_LOW') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'PRICE_HIGH') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'DISCOUNT') list.sort((a, b) => b.discount_percent - a.discount_percent);
    else list.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    return list;
  }, [products, activeDept, searchQuery, sortBy]);

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groceries, atta, spices, soap..."
            placeholderTextColor="rgba(235, 214, 220, 0.70)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* DMart Categories Header & Horizontal Carousel */}
      <View style={styles.categoriesSection}>
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>DMART CATEGORIES • राशन & घर का सामान</Text>
          {activeDept !== null && (
            <TouchableOpacity onPress={() => setActiveDept(null)} style={styles.clearBadge}>
              <Text style={styles.clearBadgeText}>✕ Show All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.tabScroll}
        >
          <TouchableOpacity
            style={[styles.deptPill, activeDept === null && styles.deptPillActive]}
            onPress={() => setActiveDept(null)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 13 }}>🛒</Text>
            <View>
              <Text style={[styles.deptPillText, activeDept === null && styles.deptPillTextActive]}>
                All Items ({products.length})
              </Text>
              <Text style={[styles.deptHindiText, activeDept === null && styles.deptHindiTextActive]}>
                सभी सामान
              </Text>
            </View>
          </TouchableOpacity>

          {DMART_CATEGORIES.map((cat) => {
            const isActive = activeDept === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.deptPill, isActive && styles.deptPillActive]}
                onPress={() => setActiveDept(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
                <View>
                  <Text style={[styles.deptPillText, isActive && styles.deptPillTextActive]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.deptHindiText, isActive && styles.deptHindiTextActive]}>
                    {cat.hindi}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Category Banner */}
      {activeDept !== null && (
        <View style={styles.activeFilterBanner}>
          <Text style={styles.activeFilterText}>
            Showing {filteredProducts.length} items in {DMART_CATEGORIES.find(c => c.id === activeDept)?.name}
          </Text>
          <TouchableOpacity onPress={() => setActiveDept(null)}>
            <Text style={styles.activeFilterReset}>View All Products</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sort Options Bar */}
      <View style={styles.sortBar}>
        <Text style={styles.resultCount}>Showing {filteredProducts.length} items</Text>
        <View style={styles.sortPills}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'POPULAR' && styles.sortBtnActive]}
            onPress={() => setSortBy('POPULAR')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'POPULAR' && styles.sortBtnTextActive]}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'PRICE_LOW' && styles.sortBtnActive]}
            onPress={() => setSortBy('PRICE_LOW')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'PRICE_LOW' && styles.sortBtnTextActive]}>₹ Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'DISCOUNT' && styles.sortBtnActive]}
            onPress={() => setSortBy('DISCOUNT')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'DISCOUNT' && styles.sortBtnTextActive]}>Offer %</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.productGrid}>
          {filteredProducts.map((prod) => {
            const qty = cart[prod.id] || 0;
            return (
              <View key={prod.id} style={styles.productCard}>
                {/* Discount Tag */}
                {prod.discount_percent > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{prod.discount_percent}% OFF</Text>
                  </View>
                )}

                {/* Image Placeholder */}
                <View style={[styles.imgContainer, { backgroundColor: 'rgba(103, 77, 102, 0.08)' }]}>
                  <Text style={styles.imgTag}>{prod.brand.split(' ')[0]}</Text>
                </View>

                {/* Product Info */}
                <Text style={styles.brandName}>{prod.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{prod.name}</Text>
                <Text style={styles.unitText}>{prod.unit}</Text>

                {/* Stock Level Tag */}
                <View style={styles.stockTagRow}>
                  {prod.stock <= prod.min_stock && prod.stock > 0 ? (
                    <Text style={styles.lowStockTag}>Only {prod.stock} left in store</Text>
                  ) : prod.stock <= 0 ? (
                    <Text style={styles.outOfStockTag}>Out of stock</Text>
                  ) : (
                    <Text style={styles.healthyStockTag}>In Stock</Text>
                  )}
                </View>

                {/* Price Row */}
                <View style={styles.priceRow}>
                  <Text style={styles.salePrice}>₹{prod.price}</Text>
                  {prod.mrp > prod.price && (
                    <Text style={styles.mrpPrice}>₹{prod.mrp}</Text>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.mapBtn}
                    onPress={() => onNavigateToMap(prod)}
                    activeOpacity={0.7}
                  >
                    <MapPin size={12} color={'#674D66'} />
                    <Text style={styles.mapBtnText}>In-Store</Text>
                  </TouchableOpacity>

                  {qty === 0 ? (
                    <TouchableOpacity
                      style={styles.addCartBtn}
                      onPress={() => onAddToCart(prod)}
                      activeOpacity={0.8}
                    >
                      <Plus size={14} color="#FFFFFF" />
                      <Text style={styles.addCartText}>Add</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qtyControl}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => onRemoveFromCart(prod)}
                      >
                        <Minus size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{qty}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => onAddToCart(prod)}
                      >
                        <Plus size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating View Cart Pill if cart has items */}
      {totalCartCount > 0 && (
        <TouchableOpacity style={styles.floatingCartBar} onPress={onNavigateToCart} activeOpacity={0.85}>
          <View style={styles.cartBarLeft}>
            <View style={styles.cartIconCircle}>
              <ShoppingCart size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.cartBarText}>{totalCartCount} items in cart</Text>
          </View>
          <Text style={styles.cartBarCta}>View Cart →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#674D66', // DEEP MAUVE (Image 2)
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.40)',
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoriesSection: {
    paddingVertical: 6,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  categoriesTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EBD6DC',
    letterSpacing: 0.8,
  },
  clearBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  clearBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FDA4AF',
  },
  categoryScroll: {
    flexGrow: 0,
    minHeight: 48,
  },
  tabScroll: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    gap: 8,
    alignItems: 'center',
  },
  deptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.30)',
  },
  deptPillActive: {
    backgroundColor: '#EBD6DC', // SOFT PINK BLUSH (Image 2)
    borderColor: '#FFFFFF',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  deptPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deptPillTextActive: {
    color: '#2B152A',
    fontWeight: '800',
  },
  deptHindiText: {
    fontSize: 8.5,
    color: '#EBD6DC',
    marginTop: 1,
  },
  deptHindiTextActive: {
    color: '#674D66',
    fontWeight: '700',
  },
  activeFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(235, 214, 220, 0.20)',
    borderColor: 'rgba(235, 214, 220, 0.40)',
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeFilterText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  activeFilterReset: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FDA4AF',
    marginLeft: 8,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  sortPills: {
    flexDirection: 'row',
    gap: 6,
  },
  sortBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  sortBtnActive: {
    backgroundColor: '#EBD6DC',
    borderColor: '#FFFFFF',
  },
  sortBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  sortBtnTextActive: {
    color: '#2B152A',
    fontWeight: '800',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 10,
    position: 'relative',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 8,
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
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  imgContainer: {
    height: 75,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  imgTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#674D66',
    opacity: 0.85,
  },
  brandName: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#8C386A',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B152A', // Deep plum text: 100% visible on white card
    height: 28,
    marginTop: 1,
  },
  unitText: {
    fontSize: 9.5,
    color: '#6A4F68',
    marginTop: 1,
  },
  stockTagRow: {
    marginVertical: 3,
  },
  healthyStockTag: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#166534',
  },
  lowStockTag: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#D97706',
  },
  outOfStockTag: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#EF4444',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 4,
  },
  salePrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#166534', // Rich green price
  },
  mrpPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  mapBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: 'rgba(103, 77, 102, 0.10)',
    borderColor: '#674D66',
    borderWidth: 1.2,
    borderRadius: 12,
    paddingVertical: 6,
  },
  mapBtnText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#674D66',
  },
  addCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#C24379', // Radiant Mauve-Pink CTA
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  addCartText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  qtyControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C24379',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  qtyBtn: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 74,
    left: 16,
    right: 16,
    backgroundColor: '#C24379',
    borderColor: '#EBD6DC',
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cartBarCta: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EBD6DC',
  }
});
