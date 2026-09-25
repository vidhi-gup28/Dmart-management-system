import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Department, Product } from '../../types';
import { Layers, Users, MapPin, Package, AlertTriangle, CheckCircle2 } from 'lucide-react-native';

interface StaffDepartmentScreenProps {
  department: Department;
  products: Product[];
  onNavigateToMap: (prod: Product) => void;
}

export const StaffDepartmentScreen: React.FC<StaffDepartmentScreenProps> = ({
  department,
  products,
  onNavigateToMap,
}) => {
  const deptProducts = products.filter(p => p.department === (department?.id || 1));
  const lowStock = deptProducts.filter(p => p.stock <= p.min_stock);

  const teamMembers = [
    { name: 'Rahul Sharma (You)', id: 'SM1024', role: 'Store Associate', shift: '9 AM – 5 PM', status: 'PRESENT' },
    { name: 'Sunita Rao', id: 'SM1018', role: 'Inventory Specialist', shift: '9 AM – 5 PM', status: 'PRESENT' },
    { name: 'Kunal Patel', id: 'SM1035', role: 'Section Supervisor', shift: '6 AM – 2 PM', status: 'PRESENT' },
    { name: 'Amit Verma', id: 'SM1042', role: 'Replenishment Associate', shift: '1 PM – 9 PM', status: 'UPCOMING' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
      {/* Department Overview Banner */}
      <View style={styles.deptHeroCard}>
        <View style={styles.iconCircle}>
          <Layers size={22} color={'#FED7B8'} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.deptName}>{department?.name || 'Grocery & Staples'}</Text>
          <Text style={styles.deptFloor}>{department?.floor || 'Ground Floor'} • Aisles 1 & 2</Text>
          <Text style={styles.deptStats}>
            {deptProducts.length} Configured Products • 4 Team Members On Duty
          </Text>
        </View>
      </View>

      {/* Stock Health Warning Banner if any */}
      {lowStock.length > 0 && (
        <View style={styles.alertCard}>
          <AlertTriangle size={18} color="#D97706" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.alertTitle}>Shelf Restocking Needed</Text>
            <Text style={styles.alertSub}>
              {lowStock.length} items in your section are below minimum shelf threshold.
            </Text>
          </View>
        </View>
      )}

      {/* Team Members */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Section Associates On Floor</Text>
      </View>

      <View style={styles.teamList}>
        {teamMembers.map((m) => (
          <View key={m.id} style={styles.teamCard}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>{m.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={styles.memberName}>{m.name}</Text>
              <Text style={styles.memberRole}>{m.id} • {m.role} • {m.shift}</Text>
            </View>
            <View style={styles.onDutyPill}>
              <Text style={styles.onDutyText}>{m.status}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Department Products & Shelf Locator */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Section Shelf Products</Text>
      </View>

      <View style={styles.prodList}>
        {deptProducts.slice(0, 8).map((p) => (
          <View key={p.id} style={styles.prodRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.pLoc}>
                {p.aisle_name || 'Aisle 1'} • {p.shelf_code || 'Shelf A'} • Barcode: {p.barcode}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
              <Text style={styles.pStock}>{p.stock} in stock</Text>
              <Text style={styles.pPrice}>₹{p.price}</Text>
            </View>
            <TouchableOpacity style={styles.locateBtn} onPress={() => onNavigateToMap(p)}>
              <MapPin size={12} color={'#FED7B8'} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: 90 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollPadding: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  deptHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1628',
    borderColor: 'rgba(1, 72, 114, 0.18)',
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deptName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  deptFloor: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FED7B8',
    marginTop: 1,
  },
  deptStats: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  alertTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
  },
  alertSub: {
    fontSize: 10.5,
    color: '#92400E',
    marginTop: 1,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  teamList: {
    gap: 8,
    marginBottom: 16,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#674D66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  memberName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2B152A',
  },
  memberRole: {
    fontSize: 10,
    color: '#674D66',
    fontWeight: '600',
    marginTop: 1,
  },
  onDutyPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  onDutyText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
  },
  prodList: {
    gap: 8,
  },
  prodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 214, 220, 0.90)',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  pName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2B152A',
  },
  pLoc: {
    fontSize: 10,
    color: '#674D66',
    fontWeight: '600',
    marginTop: 1,
  },
  pStock: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  pPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FED7B8',
  },
  locateBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
