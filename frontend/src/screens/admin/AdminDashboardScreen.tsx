import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { AdminDashboardData, StorePulseData, SmartMartInsight, StoreActivityItem } from '../../types';
import {
  Activity, TrendingUp, AlertCircle, Users, Receipt,
  ShoppingBag, ShieldAlert, CheckCircle2, ArrowRight, Zap,
  Sparkles, Layers, Truck, Package, Clock
} from 'lucide-react-native';

interface AdminDashboardScreenProps {
  dashboard: AdminDashboardData;
  pulse: StorePulseData;
  insights: SmartMartInsight[];
  activities: StoreActivityItem[];
  onNavigateToInventory: () => void;
  onNavigateToSuppliers: () => void;
  onNavigateToStaff: () => void;
  onNavigateToReports: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  dashboard,
  pulse,
  insights,
  activities,
  onNavigateToInventory,
  onNavigateToSuppliers,
  onNavigateToStaff,
  onNavigateToReports,
}) => {
  const kpis = dashboard?.kpis || {
    today_revenue_formatted: '₹8.42L',
    customers_count: 2842,
    transactions_count: 1284,
    online_orders_count: 326,
    inventory_health: '94%',
    low_stock_count: 18,
    staff_present: 47,
    open_tasks_count: 7,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
      {/* Admin Header Title */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.adminTag}>ECOSYSTEM HQ</Text>
          <Text style={styles.headerTitle}>SMARTMART CONTROL CENTER</Text>
        </View>
        <TouchableOpacity style={styles.reportsPill} onPress={onNavigateToReports}>
          <Activity size={13} color={'#FFFFFF'} />
          <Text style={styles.reportsText}>Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Modern Executive Cockpit Overview */}
      <View style={styles.cockpitContainer}>
        {/* Tier 1: Hero Revenue & Omnichannel Pulse Card */}
        <View style={styles.heroRevenueCard}>
          <View style={styles.heroTopRow}>
            <View>
              <View style={styles.liveIndicatorRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveTagText}>LIVE OMNICHANNEL REVENUE</Text>
              </View>
              <Text style={styles.heroRevenueValue}>{kpis.today_revenue_formatted}</Text>
            </View>
            <View style={styles.targetBadge}>
              <TrendingUp size={14} color="#166534" />
              <Text style={styles.targetBadgeText}>+18.4% vs Target</Text>
            </View>
          </View>

          {/* Sales Split Visual Progress Bar */}
          <View style={styles.channelSplitBox}>
            <View style={styles.splitBarHeader}>
              <View style={styles.splitLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#1A6FA8' }]} />
                <Text style={styles.splitLegendLabel}>Store POS (76%)</Text>
              </View>
              <View style={styles.splitLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#C24379' }]} />
                <Text style={styles.splitLegendLabel}>Online Express (24%)</Text>
              </View>
            </View>
            <View style={styles.splitBarTrack}>
              <View style={[styles.splitBarSegment, { width: '76%', backgroundColor: '#1A6FA8' }]} />
              <View style={[styles.splitBarSegment, { width: '24%', backgroundColor: '#C24379' }]} />
            </View>
            <View style={styles.splitStatsRow}>
              <Text style={styles.splitStatVal}>₹6.44L • {kpis.transactions_count} bills</Text>
              <Text style={styles.splitStatVal}>₹1.98L • {kpis.online_orders_count} orders</Text>
            </View>
          </View>

          {/* Quick Action Navigation Strip */}
          <View style={styles.cockpitActionsStrip}>
            <TouchableOpacity style={styles.cockpitActionBtn} onPress={onNavigateToInventory} activeOpacity={0.8}>
              <Package size={14} color="#C24379" />
              <Text style={styles.cockpitActionText}>Manage Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cockpitActionBtn} onPress={onNavigateToStaff} activeOpacity={0.8}>
              <Users size={14} color="#1A6FA8" />
              <Text style={styles.cockpitActionText}>Duty Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cockpitActionBtn} onPress={onNavigateToReports} activeOpacity={0.8}>
              <Activity size={14} color="#059669" />
              <Text style={styles.cockpitActionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tier 2: 3 High-Impact Operational Status Tiles */}
        <View style={styles.statusTilesRow}>
          {/* Inventory Health & Low Stock */}
          <TouchableOpacity
            style={[styles.statusTile, kpis.low_stock_count > 0 && styles.statusTileAlert]}
            onPress={onNavigateToInventory}
            activeOpacity={0.8}
          >
            <View style={styles.statusTileHeader}>
              <AlertCircle size={15} color={kpis.low_stock_count > 0 ? '#DC2626' : '#166534'} />
              <Text style={[styles.statusTileTag, { color: kpis.low_stock_count > 0 ? '#991B1B' : '#166534' }]}>
                LOW STOCK
              </Text>
            </View>
            <Text style={[styles.statusTileVal, { color: kpis.low_stock_count > 0 ? '#B91C1C' : '#166534' }]}>
              {kpis.low_stock_count} SKUs
            </Text>
            <Text style={styles.statusTileSub}>Health {kpis.inventory_health} • Tap to refill →</Text>
          </TouchableOpacity>

          {/* Active Footfall & Customers */}
          <View style={styles.statusTile}>
            <View style={styles.statusTileHeader}>
              <Users size={15} color="#0284C7" />
              <Text style={styles.statusTileTag}>FOOTFALL</Text>
            </View>
            <Text style={styles.statusTileVal}>{kpis.customers_count?.toLocaleString('en-IN')}</Text>
            <Text style={styles.statusTileSub}>Registered store members</Text>
          </View>

          {/* Floor Staff & Open Restock Tasks */}
          <TouchableOpacity style={styles.statusTile} onPress={onNavigateToStaff} activeOpacity={0.8}>
            <View style={styles.statusTileHeader}>
              <Zap size={15} color="#D97706" />
              <Text style={styles.statusTileTag}>FLOOR OPS</Text>
            </View>
            <Text style={styles.statusTileVal}>{kpis.staff_present} Staff</Text>
            <Text style={styles.statusTileSub}>{kpis.open_tasks_count} pending aisle tasks</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Automated Supply Chain Restock Alert (Resume / Recruiter Impressive Feature) */}
      <View style={styles.aiRestockCard}>
        <View style={styles.aiRestockTopRow}>
          <View style={styles.aiBadge}>
            <Sparkles size={12} color="#FFFFFF" />
            <Text style={styles.aiBadgeText}>AI INVENTORY PREDICTIVE ENGINE</Text>
          </View>
          <Text style={styles.aiTimeText}>Real-time Alert</Text>
        </View>
        <Text style={styles.aiRestockTitle}>
          ⚠️ High Demand Detected: 3 Fast-Moving Items Reaching Critical Safety Stock
        </Text>
        <Text style={styles.aiRestockDesc}>
          Amul Pure Ghee (1L), Basmati Rice (5kg), and Tata Salt are burning stock at 4.2x velocity. Restock recommendation generated.
        </Text>
        <View style={styles.aiRestockActions}>
          <TouchableOpacity style={styles.aiOrderBtn} onPress={onNavigateToSuppliers} activeOpacity={0.8}>
            <Text style={styles.aiOrderBtnText}>Auto-Create Supplier Purchase Order (PO) →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* STORE PULSE SECTION */}
      <View style={styles.pulseCard}>
        <View style={styles.pulseHeader}>
          <View style={styles.pulseTitleRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.pulseTitle}>STORE PULSE</Text>
          </View>
          <Text style={styles.peakHoursBadge}>Peak Hours: 5 PM – 9 PM</Text>
        </View>

        {/* 4 Pulse Progress Meters */}
        <View style={styles.pulseMetersGrid}>
          <View style={styles.meterBox}>
            <View style={styles.meterHeader}>
              <Text style={styles.meterLabel}>FOOTFALL</Text>
              <Text style={styles.meterVal}>{pulse?.footfall || 78}%</Text>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${pulse?.footfall || 78}%`, backgroundColor: '#3B82F6' }]} />
            </View>
          </View>

          <View style={styles.meterBox}>
            <View style={styles.meterHeader}>
              <Text style={styles.meterLabel}>SALES VELOCITY</Text>
              <Text style={styles.meterVal}>{pulse?.sales || 89}%</Text>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${pulse?.sales || 89}%`, backgroundColor: '#94A3B8' }]} />
            </View>
          </View>

          <View style={styles.meterBox}>
            <View style={styles.meterHeader}>
              <Text style={styles.meterLabel}>INVENTORY SYNC</Text>
              <Text style={styles.meterVal}>{pulse?.inventory || 94}%</Text>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${pulse?.inventory || 94}%`, backgroundColor: '#94A3B8' }]} />
            </View>
          </View>

          <View style={styles.meterBox}>
            <View style={styles.meterHeader}>
              <Text style={styles.meterLabel}>STORE ACTIVITY</Text>
              <Text style={styles.meterVal}>{pulse?.store_activity || 71}%</Text>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${pulse?.store_activity || 71}%`, backgroundColor: '#F59E0B' }]} />
            </View>
          </View>
        </View>

        <View style={styles.pulseFooterStats}>
          <Text style={styles.pulseFooterText}>Active Registers: 8 of 10 Open</Text>
          <Text style={styles.pulseFooterText}>Avg Checkout Time: 1.8 mins</Text>
        </View>
      </View>

      {/* SMARTMART INSIGHTS SECTION */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Sparkles size={16} color={'#FED7B8'} />
          <Text style={styles.sectionTitle}>SMARTMART INSIGHTS</Text>
        </View>
        <Text style={styles.insightsCount}>{insights.length} Actionable</Text>
      </View>

      <View style={styles.insightsList}>
        {insights.map((ins) => (
          <View key={ins.id} style={styles.insightCard}>
            <View style={styles.insightTopRow}>
              <View style={[styles.insightBadge, { backgroundColor: `${ins.badge_color || '#014872'}18` }]}>
                <Text style={[styles.insightBadgeText, { color: ins.badge_color || COLORS.primary }]}>
                  {ins.title}
                </Text>
              </View>
              <Text style={styles.insightMetric}>{ins.metric}</Text>
            </View>

            <Text style={styles.insightExplanation}>{ins.explanation}</Text>

            <View style={styles.insightBottomRow}>
              <TouchableOpacity
                style={styles.insightActionBtn}
                onPress={() => {
                  if (ins.action_target === 'inventory') onNavigateToInventory();
                  else if (ins.action_target === 'suppliers') onNavigateToSuppliers();
                  else if (ins.action_target === 'staff') onNavigateToStaff();
                  else onNavigateToReports();
                }}
              >
                <Text style={styles.insightActionText}>{ins.action_text}</Text>
                <ArrowRight size={12} color={'#FED7B8'} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* LIVE STORE ACTIVITY STREAM */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Clock size={16} color="#1A6FA8" />
          <Text style={styles.sectionTitle}>LIVE STORE ACTIVITY</Text>
        </View>
        <Text style={styles.liveStreamBadge}>Live Stream</Text>
      </View>

      <View style={styles.activityFeed}>
        {activities.slice(0, 8).map((act, idx) => (
          <View key={act.id || idx} style={styles.activityRow}>
            <View style={styles.actDot} />
            <Text style={styles.actTime}>{act.formatted_time || 'Just now'}</Text>
            <Text style={styles.actDesc} numberOfLines={1}>{act.description}</Text>
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
    backgroundColor: '#674D66',
  },
  scrollPadding: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  adminTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#EBD6DC',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  reportsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderColor: 'rgba(235, 214, 220, 0.40)',
    borderWidth: 1.2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  reportsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cockpitContainer: {
    marginBottom: 16,
  },
  heroRevenueCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8C386A',
    letterSpacing: 0.8,
  },
  heroRevenueValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#166534',
    letterSpacing: -0.5,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  targetBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
  },
  channelSplitBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  splitBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  splitLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  splitLegendLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  splitBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 4,
  },
  splitBarSegment: {
    height: '100%',
  },
  splitStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  splitStatVal: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  cockpitActionsStrip: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  cockpitActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cockpitActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
  },
  statusTilesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  statusTileAlert: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FECACA',
  },
  statusTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statusTileTag: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  statusTileVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B',
  },
  statusTileSub: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  pulseCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  pulseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pulseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  pulseTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2B152A',
    letterSpacing: 0.8,
  },
  peakHoursBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#674D66',
    backgroundColor: 'rgba(103, 77, 102, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pulseMetersGrid: {
    gap: 10,
  },
  meterBox: {
    width: '100%',
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  meterLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#2B152A',
  },
  meterVal: {
    fontSize: 10,
    fontWeight: '900',
    color: '#166534',
  },
  meterTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(103, 77, 102, 0.12)',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 3,
  },
  aiRestockCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(254, 215, 184, 0.45)',
    padding: 14,
    marginBottom: 16,
  },
  aiRestockTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#C24379',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  aiTimeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FDE047',
  },
  aiRestockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 4,
  },
  aiRestockDesc: {
    fontSize: 11.5,
    color: '#EBD6DC',
    lineHeight: 16,
    marginBottom: 10,
  },
  aiRestockActions: {
    alignItems: 'flex-start',
  },
  aiOrderBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  aiOrderBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C24379',
  },
  pulseFooterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1E5EC',
    paddingTop: 10,
    marginTop: 12,
  },
  pulseFooterText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6A4F68',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  insightsCount: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#EBD6DC',
  },
  insightsList: {
    gap: 10,
    marginBottom: 16,
  },
  insightCard: {
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
  insightTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  insightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  insightBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  insightMetric: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B152A',
  },
  insightExplanation: {
    fontSize: 11,
    color: '#6A4F68',
    lineHeight: 15,
    marginBottom: 8,
    fontWeight: '600',
  },
  insightBottomRow: {
    alignItems: 'flex-start',
  },
  insightActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C24379',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  insightActionText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveStreamBadge: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#EBD6DC',
  },
  activityFeed: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(235, 214, 220, 0.90)',
    gap: 8,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1E5EC',
  },
  actDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C24379',
    marginRight: 8,
  },
  actTime: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8C386A',
    width: 60,
  },
  actDesc: {
    flex: 1,
    fontSize: 11,
    color: '#2B152A',
    fontWeight: '600',
  }
});
