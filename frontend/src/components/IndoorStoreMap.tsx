import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Rect, Path, Circle, Text as SvgText, G, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../theme/colors';
import { Navigation, MapPin, Search, Compass, Info, CheckCircle2 } from 'lucide-react-native';
import { Product } from '../types';

interface IndoorStoreMapProps {
  targetProduct?: Product | null;
  onClearTarget?: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const IndoorStoreMap: React.FC<IndoorStoreMapProps> = ({
  targetProduct,
  onClearTarget,
  onSelectProduct
}) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [routeTick, setRouteTick] = useState(0);

  // Animate the route pulsing dot
  useEffect(() => {
    let animId: number;
    let start = Date.now();
    const loop = () => {
      setRouteTick((Date.now() - start) / 1000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Department coordinates on the 360x380 SVG floor plan
  const DEPARTMENTS = [
    { code: 'GROC', name: 'Grocery & Staples', x: 20, y: 30, w: 95, h: 65, color: '#3B82F6', aisles: 'Aisles 1 - 2' },
    { code: 'DAIR', name: 'Dairy & Chilled', x: 130, y: 30, w: 100, h: 65, color: '#0EA5E9', aisles: 'Aisles 3 - 4' },
    { code: 'BAKE', name: 'Bakery & Deli', x: 245, y: 30, w: 95, h: 65, color: '#F59E0B', aisles: 'Aisle 5' },

    { code: 'BEVE', name: 'Beverages', x: 20, y: 110, w: 95, h: 65, color: '#94A3B8', aisles: 'Aisle 6' },
    { code: 'SNAC', name: 'Snacks Zone', x: 130, y: 110, w: 100, h: 65, color: '#EC4899', aisles: 'Aisle 7' },
    { code: 'PERS', name: 'Personal Care', x: 245, y: 110, w: 95, h: 65, color: '#94A3B8', aisles: 'Aisle 8' },

    { code: 'HOME', name: 'Home & Clean', x: 20, y: 190, w: 95, h: 60, color: '#94A3B8', aisles: 'Aisle 9' },
    { code: 'ELEC', name: 'Electronics', x: 130, y: 190, w: 100, h: 60, color: '#F1F5F9', aisles: 'Aisle 10' },
    { code: 'CLOTH', name: 'Apparel & Bags', x: 245, y: 190, w: 95, h: 60, color: '#F97316', aisles: 'Aisles 11 - 12' },
  ];

  // If a target product is passed, determine destination
  const activeDeptCode = targetProduct ? targetProduct.department_code || 'PERS' : selectedDept;
  const targetDept = DEPARTMENTS.find(d => d.code === activeDeptCode) || DEPARTMENTS[5];

  // Route Waypoints: Entrance (180, 350) -> Central Corridor -> Turn into department
  const startX = 180;
  const startY = 350;
  const targetCenterX = targetDept.x + targetDept.w / 2;
  const targetCenterY = targetDept.y + targetDept.h / 2;

  // Compute animated dash offset
  const dashOffset = (routeTick * 40) % 20;
  const pulseRadius = 6 + Math.sin(routeTick * 4) * 3;

  return (
    <View style={styles.container}>
      {/* Map Header Status */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Compass size={16} color={'#FED7B8'} />
          <Text style={styles.headerTitle}>Indoor Store Navigation</Text>
        </View>
        <View style={styles.activePill}>
          <View style={styles.greenPulse} />
          <Text style={styles.activePillText}>Floor 1 Active</Text>
        </View>
      </View>

      {/* Target Product Banner if Navigating */}
      {targetProduct && (
        <View style={styles.targetBanner}>
          <View style={styles.targetIconBox}>
            <MapPin size={18} color="#FFFFFF" />
          </View>
          <View style={styles.targetInfo}>
            <Text style={styles.targetHeading}>Routing to: {targetProduct.name}</Text>
            <Text style={styles.targetSub}>
              {targetDept.name} • {targetProduct.aisle_name || 'Aisle 7'} • {targetProduct.shelf_code || 'Shelf B'}
            </Text>
          </View>
          {onClearTarget && (
            <TouchableOpacity style={styles.clearBtn} onPress={onClearTarget}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Interactive SVG Floor Map */}
      <View style={styles.mapCard}>
        <Svg width="100%" height="340" viewBox="0 0 360 380">
          <Defs>
            <LinearGradient id="pathGradient" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0%" stopColor="#1A6FA8" stopOpacity="0.9" />
              <Stop offset="50%" stopColor="#014872" stopOpacity="1" />
              <Stop offset="100%" stopColor="#8B5CF6" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Floor Outline */}
          <Rect x="8" y="8" width="344" height="364" rx="20" fill="#FFF8F3" stroke="#E2E8F0" strokeWidth="2" />

          {/* Department Blocks */}
          {DEPARTMENTS.map((dept) => {
            const isTarget = activeDeptCode === dept.code;
            return (
              <G key={dept.code} onPress={() => setSelectedDept(dept.code)}>
                {/* Department Area Glass Card */}
                <Rect
                  x={dept.x}
                  y={dept.y}
                  width={dept.w}
                  height={dept.h}
                  rx="12"
                  fill={isTarget ? dept.color : '#FFFFFF'}
                  fillOpacity={isTarget ? 0.25 : 0.96}
                  stroke={isTarget ? dept.color : '#CBD5E1'}
                  strokeWidth={isTarget ? 2.5 : 1.2}
                />

                {/* Sub-Aisle Lines inside Department */}
                <Line
                  x1={dept.x + 10}
                  y1={dept.y + dept.h / 2}
                  x2={dept.x + dept.w - 10}
                  y2={dept.y + dept.h / 2}
                  stroke={isTarget ? dept.color : '#94A3B8'}
                  strokeWidth="1.2"
                  strokeDasharray="4, 3"
                />

                {/* Department Name Label */}
                <SvgText
                  x={dept.x + 8}
                  y={dept.y + 20}
                  fontSize="10"
                  fontWeight="800"
                  fill={isTarget ? '#1E1B4B' : '#1E293B'}
                >
                  {dept.name}
                </SvgText>

                {/* Aisle Subtext */}
                <SvgText
                  x={dept.x + 8}
                  y={dept.y + 36}
                  fontSize="8.5"
                  fontWeight="700"
                  fill={isTarget ? '#312E81' : '#64748B'}
                >
                  {dept.aisles}
                </SvgText>

                {/* In-Stock Indicator Dot */}
                <Circle cx={dept.x + dept.w - 12} cy={dept.y + 14} r="4.5" fill={dept.color} />
              </G>
            );
          })}

          {/* Checkout Lanes / POS Counters */}
          <G x="40" y="265">
            <Rect x="0" y="0" width="280" height="24" rx="8" fill="#EEF2FF" stroke="#A5B4FC" strokeWidth="1.2" />
            <SvgText x="140" y="16" fontSize="10" fontWeight="800" fill="#3730A3" textAnchor="middle">
              CHECKOUT & POS COUNTERS (LANES 1 - 8)
            </SvgText>
          </G>

          {/* Customer Service Helpdesk */}
          <G x="20" y="305">
            <Rect x="0" y="0" width="95" height="35" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
            <SvgText x="47" y="16" fontSize="9.5" fontWeight="800" fill="#1E293B" textAnchor="middle">
              Helpdesk
            </SvgText>
            <SvgText x="47" y="28" fontSize="8.5" fontWeight="600" fill="#475569" textAnchor="middle">
              Carts & Bags
            </SvgText>
          </G>

          {/* Store Entrance (YOU ARE HERE) */}
          <G x="130" y="300">
            <Rect x="0" y="0" width="100" height="42" rx="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <SvgText x="50" y="18" fontSize="10" fontWeight="900" fill="#0369A1" textAnchor="middle">
              ENTRANCE
            </SvgText>
            <SvgText x="50" y="32" fontSize="8.5" fontWeight="800" fill="#075985" textAnchor="middle">
              YOU ARE HERE
            </SvgText>
          </G>

          {/* Store Exit */}
          <G x="245" y="305">
            <Rect x="0" y="0" width="95" height="35" rx="10" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.2" />
            <SvgText x="47" y="16" fontSize="9.5" fontWeight="800" fill="#991B1B" textAnchor="middle">
              Store Exit
            </SvgText>
            <SvgText x="47" y="28" fontSize="8.5" fontWeight="600" fill="#DC2626" textAnchor="middle">
              Turnstiles
            </SvgText>
          </G>

          {/* Animated Route Path (Entrance -> Central Hallway -> Target Department) */}
          {activeDeptCode && (
            <G>
              {/* Glowing Outline */}
              <Path
                d={`M ${startX} ${startY} L ${startX} 280 L ${startX} ${targetCenterY} L ${targetCenterX} ${targetCenterY}`}
                fill="none"
                stroke="#014872"
                strokeWidth="4"
                strokeOpacity="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Dashed Core Route */}
              <Path
                d={`M ${startX} ${startY} L ${startX} 280 L ${startX} ${targetCenterY} L ${targetCenterX} ${targetCenterY}`}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2.5"
                strokeDasharray="6, 4"
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Start Radar (YOU ARE HERE) */}
              <Circle cx={startX} cy={startY} r="5" fill="#1A6FA8" />
              <Circle cx={startX} cy={startY} r="8" fill="none" stroke="#1A6FA8" strokeWidth="1" opacity="0.6" />

              {/* Destination Pulsing Target Ring */}
              <Circle cx={targetCenterX} cy={targetCenterY} r={pulseRadius} fill="none" stroke="#8B5CF6" strokeWidth="2" />
              <Circle cx={targetCenterX} cy={targetCenterY} r="4.5" fill="#8B5CF6" />
            </G>
          )}
        </Svg>
      </View>

      {/* Turn-by-Turn Navigation Bar */}
      <View style={styles.navigationFooter}>
        <View style={styles.navStepIndicator}>
          <CheckCircle2 size={16} color={'#FED7B8'} />
          <Text style={styles.navStepText}>
            {targetProduct
              ? `Turn right at Central Walkway → Aisle ${targetProduct.aisle_number || 7} (${targetProduct.shelf_code || 'Shelf B'})`
              : `Tap any department above to calculate indoor route`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0A1628',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  targetBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1628',
    borderColor: 'rgba(1, 72, 114, 0.18)',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  targetIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FED7B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  targetInfo: {
    flex: 1,
  },
  targetHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  targetSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#0F2040',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  mapCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 8,
    shadowColor: '#F1F5F9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
    overflow: 'hidden',
  },
  navigationFooter: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  navStepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navStepText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F1F5F9',
    flex: 1,
  }
});
