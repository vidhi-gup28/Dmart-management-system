import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { OnlineOrder } from '../../types';
import { CheckCircle2, Clock, Truck, Package, ShoppingBag, ArrowLeft, Phone, ShieldCheck } from 'lucide-react-native';

interface OrderTrackingScreenProps {
  order: OnlineOrder;
  onBack: () => void;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ order, onBack }) => {
  const steps = [
    { key: 'CONFIRMED', label: 'Order Confirmed', time: '10:02 AM', icon: ShoppingBag },
    { key: 'PREPARING', label: 'Picking & Preparing', time: '10:14 AM', icon: Package },
    { key: 'PACKED', label: 'Packed & Quality Verified', time: '10:28 AM', icon: ShieldCheck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Express Delivery', time: '10:35 AM', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered to Doorstep', time: 'Est. 10:50 AM', icon: CheckCircle2 },
  ];

  const currentIdx = steps.findIndex(s => s.key === order.status);
  const activeIdx = currentIdx === -1 ? 3 : currentIdx;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <ArrowLeft size={18} color={COLORS.textNavy} />
        <Text style={styles.backText}>Back to Shopping</Text>
      </TouchableOpacity>

      {/* Order Status Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.statusPill}>
          <Clock size={12} color="#1A6FA8" />
          <Text style={styles.statusPillText}>ON TIME • ARRIVING IN 25 MINS</Text>
        </View>
        <Text style={styles.orderNumber}>Order #{order.order_number}</Text>
        <Text style={styles.deliverySlot}>{order.delivery_slot || 'Today, Express 45-Min Delivery'}</Text>
      </View>

      {/* Delivery Partner Card */}
      <View style={styles.partnerCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>RK</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.partnerName}>Ramesh Kumar</Text>
          <Text style={styles.partnerRole}>SmartMart Express Delivery Pilot</Text>
          <Text style={styles.ratingText}>★ 4.9 • 1,240 deliveries</Text>
        </View>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => alert('Connecting to delivery pilot via secure masked call...')}
        >
          <Phone size={16} color={'#FED7B8'} />
        </TouchableOpacity>
      </View>

      {/* Animated Order Progression Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineHeading}>DELIVERY TIMELINE</Text>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <View key={step.key} style={styles.timelineStepRow}>
              {/* Left Line & Node */}
              <View style={styles.nodeColumn}>
                <View style={[styles.nodeCircle, isDone && styles.nodeDone, isCurrent && styles.nodeCurrent]}>
                  <Icon size={14} color={isDone ? '#FFFFFF' : '#94A3B8'} />
                </View>
                {idx < steps.length - 1 && (
                  <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                )}
              </View>

              {/* Right Content */}
              <View style={styles.stepInfo}>
                <View style={styles.stepHeader}>
                  <Text style={[styles.stepLabel, isCurrent && styles.stepLabelCurrent]}>{step.label}</Text>
                  <Text style={styles.stepTime}>{step.time}</Text>
                </View>
                {isCurrent && (
                  <Text style={styles.stepDetail}>
                    Delivery executive is navigating Outer Ring Road with your chilled items.
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Destination Card */}
      <View style={styles.destCard}>
        <Text style={styles.destLabel}>DELIVERY ADDRESS</Text>
        <Text style={styles.destAddress}>{order.delivery_address}</Text>
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  heroCard: {
    backgroundColor: '#0A1628',
    borderColor: 'rgba(1, 72, 114, 0.18)',
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0A1628',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F1F5F9',
  },
  deliverySlot: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#674D66',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  partnerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2B152A',
  },
  partnerRole: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#674D66',
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 1,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#674D66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  timelineHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#8C386A',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  timelineStepRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  nodeColumn: {
    alignItems: 'center',
    marginRight: 12,
    width: 30,
  },
  nodeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeDone: {
    backgroundColor: '#059669',
  },
  nodeCurrent: {
    backgroundColor: '#C24379',
  },
  stepLine: {
    width: 2,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stepLineDone: {
    backgroundColor: '#059669',
  },
  stepInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6A4F68',
  },
  stepLabelCurrent: {
    color: '#C24379',
    fontWeight: '900',
  },
  stepTime: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2B152A',
  },
  stepDetail: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2B152A',
    marginTop: 2,
    lineHeight: 15,
  },
  destCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  destLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8C386A',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  destAddress: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B152A',
    lineHeight: 18,
  }
});
