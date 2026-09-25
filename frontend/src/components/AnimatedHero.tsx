import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Path, Circle, Line, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { COLORS } from '../theme/colors';
import { Sparkles, ShoppingBag, Zap, Navigation } from 'lucide-react-native';

export const AnimatedHero: React.FC = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let frameId: number;
    let start = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - start) / 1000;
      setTick(elapsed);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Continuous animation calculations
  // 1. Cart glides back and forth: x from 20 to 180 over 6s
  const cartX = 35 + Math.sin(tick * 0.8) * 45;
  const cartBob = Math.sin(tick * 4) * 2;

  // 2. Barcode laser sweeps up and down
  const laserY = 24 + ((Math.sin(tick * 2.5) + 1) / 2) * 52;

  // 3. Floating pills subtle bobbing
  const floatPill1 = Math.sin(tick * 1.5) * 4;
  const floatPill2 = Math.cos(tick * 1.8) * 4;

  // 4. Wave graph dynamic points
  const p1 = 45 + Math.sin(tick * 2.0) * 8;
  const p2 = 35 + Math.cos(tick * 2.5) * 10;
  const p3 = 50 + Math.sin(tick * 3.0) * 6;

  return (
    <View style={styles.container}>
      {/* Background Gradient & Animated SVG Canvas */}
      <View style={styles.canvasContainer}>
        <Svg width="100%" height="150" viewBox="0 0 340 150">
          <Defs>
            <LinearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFF8F3" stopOpacity="0.8" />
              <Stop offset="50%" stopColor="#FFF8F3" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.7" />
            </LinearGradient>

            <LinearGradient id="laserGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
              <Stop offset="50%" stopColor="#EF4444" stopOpacity="1" />
              <Stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
            </LinearGradient>

            <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#014872" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
            </LinearGradient>

            <LinearGradient id="shelfGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#E2E8F0" />
              <Stop offset="100%" stopColor="#CBD5E1" />
            </LinearGradient>
          </Defs>

          {/* Supermarket Shelf Background Structures */}
          <Rect x="20" y="30" width="130" height="6" rx="3" fill="url(#shelfGrad)" />
          <Rect x="20" y="62" width="130" height="6" rx="3" fill="url(#shelfGrad)" />
          <Rect x="20" y="94" width="130" height="6" rx="3" fill="url(#shelfGrad)" />

          {/* Product Boxes on Shelves */}
          {/* Top Shelf */}
          <Rect x="25" y="16" width="12" height="14" rx="2" fill="#F97316" />
          <Rect x="41" y="14" width="14" height="16" rx="2" fill="#3B82F6" />
          <Rect x="59" y="12" width="10" height="18" rx="2" fill="#1A6FA8" />
          <Rect x="73" y="15" width="14" height="15" rx="2" fill="#8B5CF6" />
          <Rect x="91" y="13" width="12" height="17" rx="2" fill="#EC4899" />
          <Rect x="107" y="16" width="15" height="14" rx="2" fill="#0EA5E9" />
          <Rect x="126" y="14" width="10" height="16" rx="2" fill="#F59E0B" />

          {/* Middle Shelf */}
          <Rect x="28" y="46" width="16" height="16" rx="3" fill="#014872" />
          <Rect x="48" y="44" width="12" height="18" rx="2" fill="#1A6FA8" />
          <Rect x="64" y="47" width="18" height="15" rx="2" fill="#FED7B8" />
          <Rect x="86" y="43" width="14" height="19" rx="2" fill="#3B82F6" />
          <Rect x="104" y="46" width="12" height="16" rx="2" fill="#EC4899" />
          <Rect x="120" y="48" width="18" height="14" rx="2" fill="#1A6FA8" />

          {/* Barcode Scanner Box (Futuristic Checkout Scanner) */}
          <G x="235" y="15">
            <Rect x="0" y="0" width="85" height="85" rx="14" fill="#FFFFFF" opacity="0.9" />
            <Rect x="0" y="0" width="85" height="85" rx="14" fill="none" stroke="#C7D2FE" strokeWidth="1.5" />
            
            {/* Barcode Lines */}
            <Line x1="12" y1="20" x2="12" y2="70" stroke="#012D4A" strokeWidth="2.5" />
            <Line x1="18" y1="20" x2="18" y2="70" stroke="#012D4A" strokeWidth="1" />
            <Line x1="23" y1="20" x2="23" y2="70" stroke="#012D4A" strokeWidth="4" />
            <Line x1="31" y1="20" x2="31" y2="70" stroke="#012D4A" strokeWidth="1.5" />
            <Line x1="36" y1="20" x2="36" y2="70" stroke="#012D4A" strokeWidth="3" />
            <Line x1="43" y1="20" x2="43" y2="70" stroke="#012D4A" strokeWidth="1" />
            <Line x1="48" y1="20" x2="48" y2="70" stroke="#012D4A" strokeWidth="3.5" />
            <Line x1="56" y1="20" x2="56" y2="70" stroke="#012D4A" strokeWidth="1.5" />
            <Line x1="62" y1="20" x2="62" y2="70" stroke="#012D4A" strokeWidth="4" />
            <Line x1="71" y1="20" x2="71" y2="70" stroke="#012D4A" strokeWidth="2" />

            {/* Continuously Animated Red Laser Scanning Line */}
            <Line x1="4" y1={laserY} x2="81" y2={laserY} stroke="url(#laserGrad)" strokeWidth="2.5" />
            <Circle cx={8} cy={laserY} r="2" fill="#EF4444" />
            <Circle cx={77} cy={laserY} r="2" fill="#EF4444" />
          </G>

          {/* Dynamic Route Waypoint Line */}
          <Path
            d={`M 20 125 C 80 115, 140 ${p1}, 210 120 S 280 ${p2}, 320 110`}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="2.5"
            strokeDasharray="5, 3"
          />

          {/* Moving Supermarket Shopping Cart */}
          <G x={cartX} y={105 + cartBob}>
            {/* Cart Basket Mesh */}
            <Path
              d="M 5 0 L 32 0 L 27 20 L 9 20 Z"
              fill="rgba(1, 72, 114, 0.15)"
              stroke="#013459"
              strokeWidth="2"
            />
            {/* Cart Handle */}
            <Line x1="0" y1="-8" x2="6" y2="0" stroke="#013459" strokeWidth="2.5" strokeLinecap="round" />
            <Circle cx="0" cy="-8" r="2.5" fill="#FED7B8" />
            {/* Small Product Inside Cart */}
            <Rect x="12" y="5" width="8" height="10" rx="1.5" fill="#1A6FA8" />
            <Rect x="21" y="8" width="6" height="7" rx="1.5" fill="#F97316" />
            {/* Chassis and Wheels */}
            <Line x1="9" y1="20" x2="11" y2="25" stroke="#012D4A" strokeWidth="2" />
            <Line x1="27" y1="20" x2="25" y2="25" stroke="#012D4A" strokeWidth="2" />
            <Circle cx="11" cy="27" r="3.5" fill="#012D4A" />
            <Circle cx="11" cy="27" r="1.5" fill="#FFFFFF" />
            <Circle cx="25" cy="27" r="3.5" fill="#012D4A" />
            <Circle cx="25" cy="27" r="1.5" fill="#FFFFFF" />
          </G>
        </Svg>
      </View>

      {/* Floating Glassmorphic Badges */}
      <View style={[styles.floatingBadgeTop, { transform: [{ translateY: floatPill1 }] }]}>
        <View style={styles.badgeDot} />
        <Zap size={11} color="#014872" />
        <Text style={styles.badgeText}>Live Indoor Sync Active</Text>
      </View>

      <View style={[styles.floatingBadgeBottom, { transform: [{ translateY: floatPill2 }] }]}>
        <Navigation size={11} color="#0EA5E9" />
        <Text style={styles.badgeTextCyan}>Shelf Navigation Ready</Text>
      </View>

      {/* Hero Headline Overlay */}
      <View style={styles.textOverlay}>
        <View style={styles.taglinePill}>
          <Sparkles size={12} color="#F97316" />
          <Text style={styles.taglineText}>NEXT-GEN HYPERMARKET</Text>
        </View>
        <Text style={styles.heroTitle}>SmartMart Connect</Text>
        <Text style={styles.heroSubtitle}>Physical Aisles & Online Baskets in One Unified Pulse</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 4,
  },
  canvasContainer: {
    height: 155,
    width: '100%',
    backgroundColor: '#FAF5F7',
  },
  floatingBadgeTop: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(103, 77, 102, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2B152A', // Deep plum: 100% visible on white badge
  },
  floatingBadgeBottom: {
    position: 'absolute',
    bottom: 48,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  badgeTextCyan: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
  },
  textOverlay: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(235, 214, 220, 0.50)',
  },
  taglinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C24379',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2B152A', // Deep plum: 100% visible, sharp and crisp!
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6A4F68', // Elegant deep plum-gray: highly readable!
    marginTop: 2,
  }
});
