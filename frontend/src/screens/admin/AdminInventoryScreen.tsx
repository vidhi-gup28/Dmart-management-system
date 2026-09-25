import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Product } from '../../types';
import { Boxes, Search, Plus, AlertTriangle, CheckCircle2, X, RefreshCw } from 'lucide-react-native';

interface AdminInventoryScreenProps {
  products: Product[];
  onAdjustStock: (productId: number, adjustment: number, reason: string) => Promise<any>;
  onAddNewProduct?: (newProd: Partial<Product>) => void;
}

export const AdminInventoryScreen: React.FC<AdminInventoryScreenProps> = ({
  products,
  onAdjustStock,
  onAddNewProduct,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('50');
  const [adjustReason, setAdjustReason] = useState('Shelf Restocking');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Product Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');
  const [newStock, setNewStock] = useState('100');
  const [newDepartment, setNewDepartment] = useState('Grocery & Staples');
  const [newUnit, setNewUnit] = useState('1 kg Pack');

  const filtered = products.filter(p => {
    if (statusFilter !== 'ALL' && p.stock_status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.department_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmAdjust = async () => {
    if (!selectedProduct) return;
    const val = parseInt(adjustAmount) || 0;
    setIsSubmitting(true);
    await onAdjustStock(selectedProduct.id, val, adjustReason);
    setIsSubmitting(false);
    setSelectedProduct(null);
  };

  const handleCreateProduct = () => {
    if (!newName.trim() || !newPrice.trim()) {
      alert('Please enter product name and selling price.');
      return;
    }
    if (onAddNewProduct) {
      onAddNewProduct({
        name: newName.trim(),
        brand: newBrand.trim() || 'D-Mart Select',
        price: parseFloat(newPrice) || 99,
        mrp: parseFloat(newMrp) || (parseFloat(newPrice) ? parseFloat(newPrice) * 1.15 : 120),
        stock: parseInt(newStock) || 100,
        min_stock: 20,
        stock_status: 'HEALTHY',
        unit: newUnit,
        department_name: newDepartment,
        barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        rating: 4.8,
        is_active: true,
      });
    }
    setShowAddProductModal(false);
    setNewName('');
    setNewBrand('');
    setNewPrice('');
    setNewMrp('');
    alert('New product successfully added to D-Mart Inventory!');
  };

  return (
    <View style={styles.container}>
      {/* Search & Add Product Header */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search SKU, barcode or item..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.addNewProdBtn}
          onPress={() => setShowAddProductModal(true)}
          activeOpacity={0.8}
        >
          <Plus size={15} color="#FFFFFF" />
          <Text style={styles.addNewProdText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          style={styles.filterScrollView}
        >
          {(['ALL', 'LOW_STOCK', 'CRITICAL', 'OUT_OF_STOCK', 'HEALTHY'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, statusFilter === tab && styles.filterPillActive]}
              onPress={() => setStatusFilter(tab)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterPillText, statusFilter === tab && styles.filterPillTextActive]}>
                {tab.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Inventory Items */}
      <ScrollView style={styles.listArea} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.countLabel}>Displaying {filtered.length} products in stock register</Text>

        {filtered.map((prod) => (
          <View key={prod.id} style={styles.prodCard}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prodName} numberOfLines={1}>{prod.name}</Text>
                <Text style={styles.prodMeta}>
                  {prod.barcode} • {prod.department_name} ({prod.aisle_name || 'Aisle 7'}, {prod.shelf_code || 'Shelf B'})
                </Text>
              </View>

              {/* Status Badge */}
              <View style={[
                styles.statusBadge,
                prod.stock_status === 'HEALTHY' ? styles.badgeHealthy :
                prod.stock_status === 'LOW_STOCK' ? styles.badgeLow :
                prod.stock_status === 'CRITICAL' ? styles.badgeCritical : styles.badgeOut
              ]}>
                <Text style={styles.badgeText}>{prod.stock_status.replace('_', ' ')}</Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <View style={styles.stockCol}>
                <Text style={styles.stockLabel}>Available Stock</Text>
                <Text style={styles.stockVal}>{prod.stock} units</Text>
              </View>
              <View style={styles.stockCol}>
                <Text style={styles.stockLabel}>Min. Threshold</Text>
                <Text style={styles.stockVal}>{prod.min_stock} units</Text>
              </View>
              <View style={styles.stockCol}>
                <Text style={styles.stockLabel}>Unit Price</Text>
                <Text style={[styles.stockVal, { color: '#FED7B8' }]}>₹{prod.price}</Text>
              </View>

              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => setSelectedProduct(prod)}
                activeOpacity={0.8}
              >
                <Plus size={12} color={'#FED7B8'} />
                <Text style={styles.adjustBtnText}>Restock</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <Modal transparent animationType="fade" visible={!!selectedProduct} onRequestClose={() => setSelectedProduct(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Quick Restock Adjustment</Text>
                <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                  <X size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalProdName}>{selectedProduct.name}</Text>
              <Text style={styles.modalProdCurrent}>
                Current Stock: {selectedProduct.stock} units • {selectedProduct.department_name}
              </Text>

              {/* Preset buttons */}
              <Text style={styles.modalInputLabel}>ADD UNITS TO SHELF</Text>
              <View style={styles.presetsRow}>
                {['+10', '+25', '+50', '+100'].map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.presetBtn, adjustAmount === preset.replace('+', '') && styles.presetBtnActive]}
                    onPress={() => setAdjustAmount(preset.replace('+', ''))}
                  >
                    <Text style={[styles.presetText, adjustAmount === preset.replace('+', '') && styles.presetTextActive]}>
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={adjustAmount}
                onChangeText={setAdjustAmount}
                placeholder="Or enter custom quantity..."
              />

              <Text style={styles.modalInputLabel}>REASON / AUDIT LOG</Text>
              <TextInput
                style={styles.reasonInput}
                value={adjustReason}
                onChangeText={setAdjustReason}
                placeholder="Reason (e.g. Supplier Inward, Floor Replenishment)"
              />

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirmAdjust}
                disabled={isSubmitting}
              >
                <RefreshCw size={14} color="#FFFFFF" />
                <Text style={styles.confirmText}>
                  {isSubmitting ? 'Updating Database...' : `Add +${adjustAmount} Units to Stock`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Add New Product to D-Mart Modal */}
      <Modal transparent animationType="fade" visible={showAddProductModal} onRequestClose={() => setShowAddProductModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New D-Mart Product</Text>
              <TouchableOpacity onPress={() => setShowAddProductModal(false)}>
                <X size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalInputLabel}>PRODUCT NAME *</Text>
            <TextInput
              style={styles.reasonInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Fortune Sunflower Oil 1L"
              placeholderTextColor="#64748B"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalInputLabel}>BRAND</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={newBrand}
                  onChangeText={setNewBrand}
                  placeholder="e.g. Fortune"
                  placeholderTextColor="#64748B"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalInputLabel}>SELLING PRICE (₹) *</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={newPrice}
                  onChangeText={setNewPrice}
                  keyboardType="numeric"
                  placeholder="145"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalInputLabel}>MRP (₹)</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={newMrp}
                  onChangeText={setNewMrp}
                  keyboardType="numeric"
                  placeholder="170"
                  placeholderTextColor="#64748B"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalInputLabel}>INITIAL STOCK</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={newStock}
                  onChangeText={setNewStock}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: '#059669', marginTop: 14 }]}
              onPress={handleCreateProduct}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.confirmText}>Save Product to D-Mart Store</Text>
            </TouchableOpacity>
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
  addNewProdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C24379',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    shadowColor: '#C24379',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  addNewProdText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchBox: {
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
  filterContainer: {
    height: 48,
    maxHeight: 48,
    marginVertical: 4,
  },
  filterScrollView: {
    flexGrow: 0,
    height: 48,
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filterPillActive: {
    backgroundColor: '#FED7B8',
    borderColor: '#FED7B8',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  filterPillTextActive: {
    color: '#2B152A',
    fontWeight: '900',
  },
  listArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  countLabel: {
    fontSize: 10.5,
    color: '#475569',
    marginBottom: 8,
  },
  prodCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  prodName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2B152A',
  },
  prodMeta: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#674D66',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeHealthy: { backgroundColor: '#DCFCE7' },
  badgeLow: { backgroundColor: '#FEF3C7' },
  badgeCritical: { backgroundColor: '#FEE2E2' },
  badgeOut: { backgroundColor: '#F3F4F6' },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1E5EC',
    paddingTop: 8,
  },
  stockCol: {
    alignItems: 'flex-start',
  },
  stockLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#6A4F68',
  },
  stockVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#166534',
    marginTop: 1,
  },
  adjustBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#674D66',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  adjustBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0F2040',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  modalProdName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FED7B8',
  },
  modalProdCurrent: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 14,
  },
  modalInputLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: '#FED7B8',
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  amountInput: {
    height: 40,
    backgroundColor: '#0A1628',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    fontSize: 12,
    marginBottom: 12,
  },
  reasonInput: {
    height: 40,
    backgroundColor: '#0A1628',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    fontSize: 12,
    marginBottom: 16,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FED7B8',
    height: 44,
    borderRadius: 14,
  },
  confirmText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  }
});
