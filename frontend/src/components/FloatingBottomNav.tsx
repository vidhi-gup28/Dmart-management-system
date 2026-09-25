import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { UserRole } from '../types';
import {
  Home, ShoppingBag, MapPin, ShoppingCart, User,
  CalendarCheck, CheckSquare, Layers,
  CreditCard, Receipt, Bell,
  LayoutDashboard, Boxes, Truck, Users, MoreHorizontal
} from 'lucide-react-native';

interface FloatingBottomNavProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  cartCount?: number;
  badgeCount?: number;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  role,
  activeTab,
  onTabChange,
  cartCount = 0,
  badgeCount = 0,
}) => {
  // Tabs for each role
  const getTabs = () => {
    switch (role) {
      case 'CUSTOMER':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'shop', label: 'Shop', icon: ShoppingBag },
          { id: 'store', label: 'Store Map', icon: MapPin },
          { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'STAFF':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: 3 },
          { id: 'department', label: 'Section', icon: Layers },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'CASHIER':
        return [
          { id: 'home', label: 'Register', icon: Home },
          { id: 'pos', label: 'POS Terminal', icon: CreditCard },
          { id: 'transactions', label: 'History', icon: Receipt },
          { id: 'notifications', label: 'Alerts', icon: Bell, badge: badgeCount },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Control', icon: LayoutDashboard },
          { id: 'inventory', label: 'Inventory', icon: Boxes },
          { id: 'orders', label: 'Orders', icon: Truck },
          { id: 'staff', label: 'Staff', icon: Users },
          { id: 'more', label: 'More', icon: MoreHorizontal },
        ];
    }
  };

  const tabs = getTabs();

  return (
    <View style={styles.container}>
      <View style={styles.glassBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  size={20}
                  color={isActive ? '#EBD6DC' : '#B89EB2'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {!!tab.badge && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    zIndex: 900,
  },
  glassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(74, 52, 73, 0.96)', // Deep Mauve Frosted Glass
    borderColor: 'rgba(235, 214, 220, 0.35)', // Soft Pink Blush glow border
    borderWidth: 1.5,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.40,
    shadowRadius: 28,
    elevation: 12,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
    minWidth: 54,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(235, 214, 220, 0.20)', // Soft Pink Blush pill background
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#C24379',
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B89EB2',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#EBD6DC', // Soft Pink Blush
    fontWeight: '800',
  }
});
