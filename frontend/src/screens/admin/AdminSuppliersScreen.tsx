import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Truck, CheckCircle2, Clock, PackageCheck, Phone, Mail, ArrowRight } from 'lucide-react-native';

interface AdminSuppliersScreenProps {
  suppliers: any[];
  purchaseOrders: any[];
  onReceivePO: (poId: number) => Promise<any>;
}

export const AdminSuppliersScreen: React.FC<AdminSuppliersScreenProps> = ({
  suppliers,
  purchaseOrders,
  onReceivePO,
}) => {
  const [receivingId, setReceivingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'POS' | 'SUPPLIERS'>('POS');

  const handleReceive = async (poId: number) => {
    setReceivingId(poId);
    await onReceivePO(poId);
    setReceivingId(null);
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'POS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('POS')}
        >
          <Truck size={14} color={activeTab === 'POS' ? '#FFFFFF' : COLORS.textNavy} />
          <Text style={[styles.tabText, activeTab === 'POS' && styles.tabTextActive]}>
            Purchase Orders ({purchaseOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'SUPPLIERS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('SUPPLIERS')}
        >
          <Text style={[styles.tabText, activeTab === 'SUPPLIERS' && styles.tabTextActive]}>
            Vendor Directory ({suppliers.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'POS' ? (
          <View style={styles.listSection}>
            <Text style={styles.sectionHeading}>INBOUND SHIPMENTS & PURCHASE ORDERS</Text>

            {purchaseOrders.map((po) => {
              const isReceived = po.status === 'RECEIVED';
              return (
                <View key={po.id} style={styles.poCard}>
                  <View style={styles.poTopRow}>
                    <View>
                      <Text style={styles.poNumber}>{po.po_number}</Text>
                      <Text style={styles.poSupplier}>{po.supplier_name || 'Amul Co-op'}</Text>
                    </View>

                    <View style={[styles.statusBadge, isReceived ? styles.badgeReceived : styles.badgePending]}>
                      <Text style={[styles.statusText, isReceived ? styles.textReceived : styles.textPending]}>
                        {po.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.poItemsBox}>
                    <Text style={styles.poItemsText}>
                      {po.items?.length || 4} SKU Batches Ordered • Wholesale Total: ₹{po.total_amount?.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={styles.poBottomRow}>
                    <Text style={styles.syncNotice}>
                      {isReceived ? '✓ Stock credited to live inventory' : '• In transit via refrigerated truck'}
                    </Text>

                    {!isReceived && (
                      <TouchableOpacity
                        style={styles.receiveBtn}
                        onPress={() => handleReceive(po.id)}
                        disabled={receivingId === po.id}
                        activeOpacity={0.8}
                      >
                        <PackageCheck size={14} color="#FFFFFF" />
                        <Text style={styles.receiveBtnText}>
                          {receivingId === po.id ? 'Crediting Stock...' : 'Receive Stock'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.listSection}>
            <Text style={styles.sectionHeading}>VERIFIED FMCG DISTRIBUTORS & PARTNERS</Text>

            {suppliers.map((sup) => (
              <View key={sup.id} style={styles.supplierCard}>
                <View style={styles.supTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.supName}>{sup.name}</Text>
                    <Text style={styles.supContact}>Contact: {sup.contact_person} • Rating: ★ {sup.rating}</Text>
                  </View>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{sup.category?.split(' ')[0]}</Text>
                  </View>
                </View>

                <View style={styles.supContactRow}>
                  <View style={styles.supDetail}>
                    <Phone size={12} color={'#FED7B8'} />
                    <Text style={styles.supDetailText}>{sup.phone}</Text>
                  </View>
                  <View style={styles.supDetail}>
                    <Mail size={12} color={'#FED7B8'} />
                    <Text style={styles.supDetailText}>{sup.email || 'supply@fmcg.in'}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabBtnActive: {
    backgroundColor: '#FED7B8',
    borderColor: '#FED7B8',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  listSection: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#EBD6DC',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  poCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 2,
  },
  poTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  poNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2B152A',
  },
  poSupplier: {
    fontSize: 11,
    fontWeight: '600',
    color: '#674D66',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeReceived: { backgroundColor: '#DCFCE7' },
  badgePending: { backgroundColor: '#FEF3C7' },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  textReceived: { color: '#166534' },
  textPending: { color: '#D97706' },
  poItemsBox: {
    backgroundColor: 'rgba(103, 77, 102, 0.08)',
    borderRadius: 10,
    padding: 8,
    marginVertical: 6,
  },
  poItemsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B152A',
  },
  poBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  syncNotice: {
    fontSize: 10,
    color: '#166534',
    fontWeight: '700',
  },
  receiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  receiveBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  supplierCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  supTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  supName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2B152A',
  },
  supContact: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#674D66',
    marginTop: 2,
  },
  categoryPill: {
    backgroundColor: 'rgba(103, 77, 102, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#674D66',
  },
  supContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1E5EC',
    paddingTop: 6,
  },
  supDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  supDetailText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#6A4F68',
  }
});
