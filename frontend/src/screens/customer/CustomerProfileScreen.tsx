import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Transaction, OnlineOrder, NotificationItem } from '../../types';
import {
  User, Sparkles, Receipt, ShoppingBag, Bell, ChevronRight,
  Shield, CheckCircle2, Clock, Phone, MapPin, LogOut
} from 'lucide-react-native';

interface CustomerProfileScreenProps {
  transactions: Transaction[];
  orders: OnlineOrder[];
  notifications: NotificationItem[];
  onOpenInvoice: (txn: Transaction) => void;
  onSelectOrder: (order: OnlineOrder) => void;
  onLogout: () => void;
  currentUser?: any;
}

export const CustomerProfileScreen: React.FC<CustomerProfileScreenProps> = ({
  transactions,
  orders,
  notifications,
  onOpenInvoice,
  onSelectOrder,
  onLogout,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'BILLS' | 'ORDERS' | 'NOTIFICATIONS'>('BILLS');

  const displayName = currentUser?.name || 'Pooja Verma';
  const displayPhone = currentUser?.phone || '+91 98765 43210';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PV';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
      {/* Profile Header Glass Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profilePhone}>{displayPhone} • Prime Member</Text>
          <View style={styles.addressPill}>
            <MapPin size={11} color={'#FED7B8'} />
            <Text style={styles.addressPillText}>Bellandur, Bengaluru</Text>
          </View>
        </View>
      </View>

      {/* Loyalty Points Glass Banner */}
      <View style={styles.pointsBanner}>
        <View style={styles.pointsLeft}>
          <Sparkles size={20} color="#F59E0B" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.pointsTitle}>SmartMart Rewards</Text>
            <Text style={styles.pointsAmount}>340 SmartPoints</Text>
          </View>
        </View>
        <View style={styles.pointsValuePill}>
          <Text style={styles.pointsValueText}>₹34.00 Value</Text>
        </View>
      </View>

      {/* Sub Tabs: Digital Bills / Online Orders / Notifications */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'BILLS' && styles.tabPillActive]}
          onPress={() => setActiveTab('BILLS')}
        >
          <Receipt size={14} color={activeTab === 'BILLS' ? '#2B152A' : '#EBD6DC'} />
          <Text style={[styles.tabText, activeTab === 'BILLS' && styles.tabTextActive]}>
            Store Bills ({transactions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'ORDERS' && styles.tabPillActive]}
          onPress={() => setActiveTab('ORDERS')}
        >
          <ShoppingBag size={14} color={activeTab === 'ORDERS' ? '#2B152A' : '#EBD6DC'} />
          <Text style={[styles.tabText, activeTab === 'ORDERS' && styles.tabTextActive]}>
            Orders ({orders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'NOTIFICATIONS' && styles.tabPillActive]}
          onPress={() => setActiveTab('NOTIFICATIONS')}
        >
          <Bell size={14} color={activeTab === 'NOTIFICATIONS' ? '#2B152A' : '#EBD6DC'} />
          <Text style={[styles.tabText, activeTab === 'NOTIFICATIONS' && styles.tabTextActive]}>
            Alerts ({notifications.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: In-Store Digital Bills */}
      {activeTab === 'BILLS' && (
        <View style={styles.listSection}>
          {transactions.slice(0, 10).map((txn) => (
            <TouchableOpacity
              key={txn.id}
              style={styles.historyCard}
              onPress={() => onOpenInvoice(txn)}
              activeOpacity={0.8}
            >
              <View style={styles.historyIconBox}>
                <Receipt size={18} color={'#FED7B8'} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={styles.historyTitle}>Invoice #{txn.invoice_number}</Text>
                <Text style={styles.historySub}>
                  {txn.items?.length || 4} items • {txn.payment_mode}
                </Text>
                <Text style={styles.historyDate}>
                  {new Date(txn.created_at || Date.now()).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.historyAmount}>₹{txn.total}</Text>
                <View style={styles.paidBadge}>
                  <Text style={styles.paidBadgeText}>{txn.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tab 2: Online Orders */}
      {activeTab === 'ORDERS' && (
        <View style={styles.listSection}>
          {orders.slice(0, 10).map((ord) => (
            <TouchableOpacity
              key={ord.id}
              style={styles.historyCard}
              onPress={() => onSelectOrder(ord)}
              activeOpacity={0.8}
            >
              <View style={[styles.historyIconBox, { backgroundColor: '#EFF6FF' }]}>
                <ShoppingBag size={18} color="#3B82F6" />
              </View>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={styles.historyTitle}>Order #{ord.order_number}</Text>
                <Text style={styles.historySub}>{ord.items?.length || 3} items</Text>
                <Text style={styles.historyDate}>{ord.estimated_delivery || 'Delivered'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.historyAmount}>₹{ord.total}</Text>
                <View style={[styles.statusBadge, ord.status === 'DELIVERED' ? styles.statusDelivered : styles.statusProgress]}>
                  <Text style={styles.statusBadgeText}>{ord.status.replace('_', ' ')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'NOTIFICATIONS' && (
        <View style={styles.listSection}>
          {notifications.slice(0, 15).map((n) => (
            <View key={n.id} style={styles.notificationCard}>
              <View style={styles.notifIconCircle}>
                <Bell size={14} color={'#FED7B8'} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifMessage}>{n.message}</Text>
                <Text style={styles.notifTime}>Recent</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Logout / Switch Role Option */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
        <LogOut size={16} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out / Switch Account</Text>
      </TouchableOpacity>

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
    paddingBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#674D66',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EBD6DC',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2B152A',
  },
  profilePhone: {
    fontSize: 11,
    color: '#6A4F68',
    marginTop: 2,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  addressPillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#C24379',
  },
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderColor: 'rgba(235, 214, 220, 0.35)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  pointsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pointsAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#EBD6DC',
    marginTop: 1,
  },
  pointsValuePill: {
    backgroundColor: '#EBD6DC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  pointsValueText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.30)',
  },
  tabPillActive: {
    backgroundColor: '#EBD6DC',
    borderColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  tabTextActive: {
    color: '#2B152A',
    fontWeight: '800',
  },
  listSection: {
    gap: 8,
    marginBottom: 16,
  },
  historyCard: {
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
    elevation: 2,
  },
  historyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(103, 77, 102, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2B152A',
  },
  historySub: {
    fontSize: 10.5,
    color: '#6A4F68',
    marginTop: 1,
  },
  historyDate: {
    fontSize: 9,
    color: '#8C386A',
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#166534',
  },
  paidBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  paidBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  statusDelivered: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusProgress: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
  },
  statusBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 214, 220, 0.90)',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  notifIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(103, 77, 102, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  notifMessage: {
    fontSize: 10.5,
    color: '#6A4F68',
    marginTop: 2,
    lineHeight: 14,
  },
  notifTime: {
    fontSize: 8.5,
    color: '#475569',
    marginTop: 3,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 6,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  }
});
