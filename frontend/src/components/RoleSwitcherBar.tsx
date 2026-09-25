import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { UserRole } from '../types';
import { ShoppingBag, Briefcase, CreditCard, Shield, Bell, LogOut } from 'lucide-react-native';

interface RoleSwitcherBarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  notificationCount?: number;
  onOpenNotifications?: () => void;
  onLogout?: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  onSelectRole,
  notificationCount = 3,
  onOpenNotifications,
  onLogout,
}) => {
  const roleLabels: Record<UserRole, { label: string; icon: any }> = {
    CUSTOMER: { label: 'Customer', icon: ShoppingBag },
    STAFF: { label: 'Staff', icon: Briefcase },
    CASHIER: { label: 'Cashier', icon: CreditCard },
    ADMIN: { label: 'Admin', icon: Shield },
  };

  const ActiveIcon = roleLabels[currentRole]?.icon || ShoppingBag;
  const activeLabel = roleLabels[currentRole]?.label || 'User';

  return (
    <View style={styles.container}>
      <View style={styles.glassBar}>
        {/* Top Navbar Left: For Customer show Brand Badge; For Employees show Role Pill */}
        {currentRole === 'CUSTOMER' ? (
          <View style={styles.brandPill}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>D-MART ONLINE</Text>
          </View>
        ) : (
          <View style={styles.activeRolePill}>
            <ActiveIcon size={14} color="#2B152A" />
            <Text style={styles.activeRoleText}>{activeLabel} Terminal</Text>
          </View>
        )}

        {/* Right Navigation Controls: Notifications & Logout */}
        <View style={styles.rightActions}>
          {onOpenNotifications && (
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={onOpenNotifications}
              activeOpacity={0.8}
            >
              <Bell size={15} color="#EBD6DC" />
              {notificationCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {onLogout && (
            <TouchableOpacity
              testID="top-bar-logout-btn"
              style={styles.logoutIconBtn}
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <LogOut size={15} color="#FDA4AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  glassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(74, 52, 73, 0.94)', // Deep Mauve Frosted Glass
    borderColor: 'rgba(235, 214, 220, 0.35)', // Soft Pink Blush border
    borderWidth: 1.5,
    borderRadius: 22,
    paddingHorizontal: 8,
    paddingVertical: 5,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.2,
    borderColor: 'rgba(235, 214, 220, 0.40)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  brandText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  activeRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EBD6DC', // Soft Pink Blush pill as shown in Image 2
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 5,
    elevation: 2,
  },
  activeRoleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2B152A', // Deep plum high-contrast text
    letterSpacing: 0.3,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(235, 214, 220, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(235, 214, 220, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoutIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#C24379',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  }
});
