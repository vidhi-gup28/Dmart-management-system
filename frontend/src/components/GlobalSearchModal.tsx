import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import { Search, X, MapPin, ShoppingBag, Users, Layers, ChevronRight } from 'lucide-react-native';
import { Product, Department } from '../types';

interface GlobalSearchModalProps {
  visible: boolean;
  onClose: () => void;
  products: Product[];
  departments: Department[];
  onSelectProduct: (product: Product) => void;
  onSelectDepartment: (deptId: number) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  visible,
  onClose,
  products,
  departments,
  onSelectProduct,
  onSelectDepartment,
}) => {
  const [query, setQuery] = useState('');

  if (!visible) return null;

  const matchingProducts = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode.includes(query)
      ).slice(0, 6)
    : [];

  const matchingDepts = query.trim()
    ? departments.filter(d => d.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Search Header */}
          <View style={styles.searchHeader}>
            <View style={styles.searchBox}>
              <Search size={16} color={'#FED7B8'} />
              <TextInput
                style={styles.input}
                placeholder="Search products, brands, aisles, departments..."
                placeholderTextColor={COLORS.textMuted}
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <X size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.scrollPadding}>
            {query.trim().length === 0 ? (
              <View style={styles.popularSearches}>
                <Text style={styles.sectionLabel}>POPULAR SEARCHES</Text>
                <View style={styles.tagWrap}>
                  {['Amul Gold Milk', 'Dove Shampoo', 'Basmati Rice', 'Tata Salt', 'Atta 10kg', 'Maggi', 'Surf Excel'].map(
                    (tag) => (
                      <TouchableOpacity
                        key={tag}
                        style={styles.searchTag}
                        onPress={() => setQuery(tag)}
                      >
                        <Text style={styles.searchTagText}>{tag}</Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            ) : (
              <>
                {/* Matching Departments */}
                {matchingDepts.length > 0 && (
                  <View style={styles.resultGroup}>
                    <Text style={styles.sectionLabel}>DEPARTMENTS</Text>
                    {matchingDepts.map((d) => (
                      <TouchableOpacity
                        key={d.id}
                        style={styles.deptResultRow}
                        onPress={() => {
                          onSelectDepartment(d.id);
                          onClose();
                        }}
                      >
                        <Layers size={14} color={'#FED7B8'} />
                        <Text style={styles.deptResultName}>{d.name}</Text>
                        <Text style={styles.deptResultFloor}>{d.floor}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Matching Products */}
                {matchingProducts.length > 0 && (
                  <View style={styles.resultGroup}>
                    <Text style={styles.sectionLabel}>PRODUCTS & IN-STORE LOCATION</Text>
                    {matchingProducts.map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={styles.productResultRow}
                        onPress={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.prodName}>{p.name}</Text>
                          <Text style={styles.prodMeta}>
                            {p.department_name} • {p.aisle_name || 'Aisle 7'} • {p.shelf_code || 'Shelf B'}
                          </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                          <Text style={styles.prodPrice}>₹{p.price}</Text>
                          <Text style={styles.prodStock}>{p.stock} in stock</Text>
                        </View>
                        <MapPin size={14} color={'#FED7B8'} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {matchingDepts.length === 0 && matchingProducts.length === 0 && (
                  <View style={styles.noResultsBox}>
                    <Text style={styles.noResultsText}>No products found matching "{query}"</Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#0F2040',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1628',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  input: {
    flex: 1,
    fontSize: 12.5,
    color: '#F1F5F9',
  },
  closeBtn: {
    paddingHorizontal: 6,
  },
  closeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FED7B8',
  },
  resultsScroll: {
    flex: 1,
  },
  scrollPadding: {
    padding: 16,
  },
  popularSearches: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  searchTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  resultGroup: {
    marginBottom: 16,
  },
  deptResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  deptResultName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  deptResultFloor: {
    fontSize: 10,
    color: '#475569',
  },
  productResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  prodName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  prodMeta: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  prodPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FED7B8',
  },
  prodStock: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
  },
  noResultsBox: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 12,
    color: '#475569',
  }
});
