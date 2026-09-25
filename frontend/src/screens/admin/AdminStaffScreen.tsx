import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Users, Search, Plus, CalendarCheck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react-native';

export const AdminStaffScreen: React.FC = () => {
  const [search, setSearch] = useState('');

  const sampleStaff = [
    { id: 'SM1001', name: 'Vikram Singhania', role: 'Head Cashier', dept: 'POS Billing', shift: '8 AM – 4 PM', status: 'PRESENT' },
    { id: 'SM1024', name: 'Rahul Sharma', role: 'Store Associate', dept: 'Grocery & Staples', shift: '9 AM – 5 PM', status: 'PRESENT' },
    { id: 'SM1005', name: 'Priya Sundaram', role: 'Dairy Section Lead', dept: 'Dairy & Chilled', shift: '6 AM – 2 PM', status: 'PRESENT' },
    { id: 'SM1012', name: 'Arjun Nair', role: 'Inventory Specialist', dept: 'Beverages', shift: '9 AM – 5 PM', status: 'PRESENT' },
    { id: 'SM1018', name: 'Kavita Joshi', role: 'Section Supervisor', dept: 'Personal Care', shift: '1 PM – 9 PM', status: 'PRESENT' },
    { id: 'SM1022', name: 'Siddharth Rao', role: 'Billing Associate', dept: 'POS Billing', shift: '2 PM – 10 PM', status: 'OFF_DUTY' },
    { id: 'SM1030', name: 'Meera Patel', role: 'Customer Assistant', dept: 'Helpdesk', shift: '9 AM – 5 PM', status: 'PRESENT' },
    { id: 'SM1034', name: 'Rohan Gupta', role: 'Logistics Associate', dept: 'Warehouse Hub', shift: '6 AM – 2 PM', status: 'PRESENT' },
    { id: 'SM1040', name: 'Deepa Verma', role: 'Bakery Specialist', dept: 'Bakery & Deli', shift: '6 AM – 2 PM', status: 'PRESENT' },
  ];

  const filtered = sampleStaff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Staff & Workforce Management</Text>
        <Text style={styles.sub}>63 Enrolled Staff • 47 Present Today across all shifts</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Search size={16} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff name, ID or department..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Shift Overview Cards */}
      <View style={styles.shiftGrid}>
        <View style={styles.shiftCard}>
          <Text style={styles.shiftNum}>24</Text>
          <Text style={styles.shiftName}>Morning Shift</Text>
          <Text style={styles.shiftTime}>6 AM – 2 PM</Text>
        </View>
        <View style={styles.shiftCard}>
          <Text style={[styles.shiftNum, { color: '#FED7B8' }]}>28</Text>
          <Text style={styles.shiftName}>General Shift</Text>
          <Text style={styles.shiftTime}>9 AM – 5 PM</Text>
        </View>
        <View style={styles.shiftCard}>
          <Text style={[styles.shiftNum, { color: '#F59E0B' }]}>11</Text>
          <Text style={styles.shiftName}>Evening Shift</Text>
          <Text style={styles.shiftTime}>2 PM – 10 PM</Text>
        </View>
      </View>

      {/* Staff Directory List */}
      <View style={styles.staffList}>
        <Text style={styles.listHeading}>EMPLOYEE REGISTER ({filtered.length})</Text>

        {filtered.map((st) => (
          <View key={st.id} style={styles.staffCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{st.name.charAt(0)}</Text>
            </View>

            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={styles.name}>{st.name}</Text>
              <Text style={styles.role}>{st.id} • {st.role}</Text>
              <Text style={styles.meta}>{st.dept} • {st.shift}</Text>
            </View>

            <View style={[styles.statusBadge, st.status === 'PRESENT' ? styles.badgePresent : styles.badgeOff]}>
              <Text style={[styles.statusText, st.status === 'PRESENT' ? styles.textPresent : styles.textOff]}>
                {st.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
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
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  sub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F2040',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#F1F5F9',
  },
  shiftGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  shiftCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  shiftNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#8C386A',
  },
  shiftName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B152A',
    marginTop: 2,
  },
  shiftTime: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#674D66',
    marginTop: 1,
  },
  staffList: {
    gap: 8,
  },
  listHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#EBD6DC',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#674D66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  role: {
    fontSize: 10.5,
    color: '#8C386A',
    fontWeight: '700',
    marginTop: 1,
  },
  meta: {
    fontSize: 10,
    fontWeight: '600',
    color: '#674D66',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePresent: { backgroundColor: '#DCFCE7' },
  badgeOff: { backgroundColor: '#F3F4F6' },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  textPresent: { color: '#166534' },
  textOff: { color: '#6B7280' }
});
