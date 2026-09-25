import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, {
  Rect, Path, Circle, Line, Defs, LinearGradient, RadialGradient, Stop, G
} from 'react-native-svg';
import { Sparkles, Cpu, Wifi, CheckCircle2 } from 'lucide-react-native';

export const AuthHeroVisual: React.FC = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let frameId: number;
    const start = Date.now();

    const loop = () => {
      const elapsed = (Date.now() - start) / 1000;
      setTick(elapsed);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Continuous animation kinematics (smooth looping 60fps)
  // 1. Futuristic shopping cart gliding smoothly on an elliptical path
  const cartX = 55 + Math.sin(tick * 0.9) * 28;
  const cartY = 118 + Math.cos(tick * 1.8) * 3;
  const cartTilt = Math.sin(tick * 0.9) * 1.8;

  // 2. Floating smart shopping bag bobbing and gentle sway
  const bagY = 22 + Math.sin(tick * 1.4 + 1.0) * 5;
  const bagRot = Math.sin(tick * 1.2) * 2.5;

  // 3. Continuous barcode laser sweep (smooth vertical ping-pong)
  const laserProgress = (Math.sin(tick * 2.2) + 1) / 2; // 0 to 1
  const laserY = 48 + laserProgress * 44;

  // 4. Location radar pulse (expanding ring 0 to 1)
  const radarPhase1 = (tick * 0.8) % 1;
  const radarR1 = 6 + radarPhase1 * 16;
  const radarOp1 = Math.max(0, 1 - radarPhase1);

  const radarPhase2 = (tick * 0.8 + 0.5) % 1;
  const radarR2 = 6 + radarPhase2 * 16;
  const radarOp2 = Math.max(0, 1 - radarPhase2);

  // 5. Ambient glowing orbs drifting softly
  const glowX1 = 80 + Math.sin(tick * 0.6) * 15;
  const glowY1 = 50 + Math.cos(tick * 0.7) * 12;

  const glowX2 = 260 + Math.cos(tick * 0.5) * 18;
  const glowY2 = 110 + Math.sin(tick * 0.6) * 10;

  // 6. Connected data particle coordinates
  const p1X = 145 + Math.sin(tick * 1.1) * 6;
  const p1Y = 72 + Math.cos(tick * 1.3) * 5;

  const p2X = 215 + Math.cos(tick * 1.4) * 8;
  const p2Y = 60 + Math.sin(tick * 1.2) * 6;

  // 7. Dashed line marching offset
  const dashOffset = (tick * 24) % 40;

  return (
    <View style={styles.container}>
      {/* SVG Ecosystem Canvas */}
      <Svg width="100%" height="185" viewBox="0 0 350 185">
        <Defs>
          {/* Ambient Lavender/Ice-Blue Background Gradient */}
          <LinearGradient id="authCanvasBg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FAF8FF" stopOpacity="0.95" />
            <Stop offset="50%" stopColor="#F0FDFA" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#FFF8F3" stopOpacity="0.95" />
          </LinearGradient>

          {/* Glowing Ambient Radial Glows */}
          <RadialGradient id="lavenderOrb" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.5" />
            <Stop offset="60%" stopColor="#E0E7FF" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#FFF8F3" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="peachOrb" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FED7AA" stopOpacity="0.45" />
            <Stop offset="70%" stopColor="#FFEDD5" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#FFF7ED" stopOpacity="0" />
          </RadialGradient>

          {/* Barcode Laser Beam Gradient */}
          <LinearGradient id="laserBeam" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
            <Stop offset="25%" stopColor="#F87171" stopOpacity="0.8" />
            <Stop offset="50%" stopColor="#EF4444" stopOpacity="1" />
            <Stop offset="75%" stopColor="#F87171" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
          </LinearGradient>

          {/* Dynamic Route Connection Line Gradient */}
          <LinearGradient id="networkLine" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.75" />
            <Stop offset="50%" stopColor="#38BDF8" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#FED7B8" stopOpacity="0.75" />
          </LinearGradient>

          {/* Card Glass Gradient */}
          <LinearGradient id="cardGlass" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#FFF8F3" stopOpacity="0.75" />
          </LinearGradient>

          {/* Shelf Metallic Gradient */}
          <LinearGradient id="modernShelf" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E2E8F0" />
            <Stop offset="100%" stopColor="#CBD5E1" />
          </LinearGradient>
        </Defs>

        {/* Soft Background Plate */}
        <Rect x="0" y="0" width="350" height="185" rx="24" fill="url(#authCanvasBg)" />

        {/* 1. Ambient Glowing Drifting Circles */}
        <Circle cx={glowX1} cy={glowY1} r="65" fill="url(#lavenderOrb)" />
        <Circle cx={glowX2} cy={glowY2} r="75" fill="url(#peachOrb)" />

        {/* 2. Abstract Futuristic Store Shelves & Products */}
        <G opacity="0.85">
          {/* Top Shelf Bar */}
          <Rect x="20" y="42" width="105" height="5" rx="2.5" fill="url(#modernShelf)" />
          {/* Bottom Shelf Bar */}
          <Rect x="20" y="76" width="105" height="5" rx="2.5" fill="url(#modernShelf)" />

          {/* Colorful Smart Product Packages on Top Shelf */}
          <Rect x="25" y="27" width="11" height="15" rx="2" fill="#014872" />
          <Rect x="39" y="24" width="13" height="18" rx="2.5" fill="#3B82F6" />
          <Rect x="55" y="26" width="10" height="16" rx="2" fill="#1A6FA8" />
          <Rect x="68" y="22" width="14" height="20" rx="2.5" fill="#FED7B8" />
          <Rect x="85" y="25" width="12" height="17" rx="2" fill="#8B5CF6" />
          <Rect x="100" y="28" width="14" height="14" rx="2" fill="#EC4899" />

          {/* Packages on Bottom Shelf */}
          <Rect x="26" y="58" width="15" height="18" rx="2.5" fill="#0EA5E9" />
          <Rect x="44" y="60" width="12" height="16" rx="2" fill="#F59E0B" />
          <Rect x="59" y="56" width="16" height="20" rx="2.5" fill="#014872" />
          <Rect x="78" y="61" width="11" height="15" rx="2" fill="#1A6FA8" />
          <Rect x="92" y="57" width="18" height="19" rx="2.5" fill="#F97316" />

          {/* Micro Shelf Label Tags */}
          <Rect x="25" y="44" width="22" height="3" rx="1.5" fill="#94A3B8" />
          <Rect x="70" y="44" width="28" height="3" rx="1.5" fill="#94A3B8" />
          <Rect x="40" y="78" width="30" height="3" rx="1.5" fill="#94A3B8" />
        </G>

        {/* 3. Barcode Scanner Glass Surface & Laser Sweep */}
        <G x="145" y="32">
          {/* Card Frame */}
          <Rect
            x="0"
            y="0"
            width="82"
            height="68"
            rx="14"
            fill="url(#cardGlass)"
            stroke="rgba(203, 213, 225, 0.7)"
            strokeWidth="1.2"
          />
          {/* Barcode Strip Bars */}
          <Line x1="12" y1="12" x2="12" y2="56" stroke="#012D4A" strokeWidth="2.5" />
          <Line x1="18" y1="12" x2="18" y2="56" stroke="#012D4A" strokeWidth="1" />
          <Line x1="22" y1="12" x2="22" y2="56" stroke="#012D4A" strokeWidth="3.5" />
          <Line x1="29" y1="12" x2="29" y2="56" stroke="#012D4A" strokeWidth="1.5" />
          <Line x1="34" y1="12" x2="34" y2="56" stroke="#012D4A" strokeWidth="2.5" />
          <Line x1="40" y1="12" x2="40" y2="56" stroke="#012D4A" strokeWidth="1" />
          <Line x1="45" y1="12" x2="45" y2="56" stroke="#012D4A" strokeWidth="3" />
          <Line x1="52" y1="12" x2="52" y2="56" stroke="#012D4A" strokeWidth="1.5" />
          <Line x1="58" y1="12" x2="58" y2="56" stroke="#012D4A" strokeWidth="3.5" />
          <Line x1="66" y1="12" x2="66" y2="56" stroke="#012D4A" strokeWidth="2" />

          {/* Continuous Laser Line Sweep */}
          <Line
            x1="4"
            y1={laserY - 32}
            x2="78"
            y2={laserY - 32}
            stroke="url(#laserBeam)"
            strokeWidth="2.5"
          />
          {/* Glowing Laser End Nodes */}
          <Circle cx="8" cy={laserY - 32} r="2" fill="#EF4444" />
          <Circle cx="74" cy={laserY - 32} r="2" fill="#EF4444" />
        </G>

        {/* 4. Floating Smart Shopping Bag (Top Right) */}
        <G
          x="262"
          y={bagY}
          transform={`rotate(${bagRot} 280 45)`}
        >
          {/* Bag Body */}
          <Path
            d="M 12 18 L 48 18 L 54 58 C 54 62, 50 65, 45 65 L 15 65 C 10 65, 6 62, 6 58 Z"
            fill="#FFFFFF"
            stroke="#818CF8"
            strokeWidth="1.8"
          />
          {/* Bag Dual Handles */}
          <Path
            d="M 22 18 C 22 8, 38 8, 38 18"
            fill="none"
            stroke="#014872"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Mini Connected Logo Icon on Bag */}
          <Circle cx="30" cy="40" r="11" fill="rgba(1, 72, 114, 0.12)" />
          <Circle cx="30" cy="40" r="7" fill="#014872" />
          <Circle cx="30" cy="40" r="3" fill="#FFFFFF" />
          {/* Floating Sparkle on Bag */}
          <Circle cx="48" cy="24" r="2.5" fill="#FED7B8" />
        </G>

        {/* 5. Animated Connection Lines & Data Stream */}
        <Path
          d={`M 75 88 C 110 88, 130 ${p1Y}, ${p1X} ${p1Y} S 190 ${p2Y}, ${p2X} ${p2Y} T 280 95`}
          fill="none"
          stroke="url(#networkLine)"
          strokeWidth="2"
          strokeDasharray="6, 4"
          strokeDashoffset={-dashOffset}
        />

        {/* Floating Data Nodes */}
        <Circle cx={p1X} cy={p1Y} r="4" fill="#38BDF8" />
        <Circle cx={p1X} cy={p1Y} r="7" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />

        <Circle cx={p2X} cy={p2Y} r="4.5" fill="#818CF8" />
        <Circle cx={p2X} cy={p2Y} r="8" fill="none" stroke="#818CF8" strokeWidth="1" opacity="0.5" />

        {/* 6. Location Pin with Concentric Radar Wave (Center-Left) */}
        <G x="42" y="112">
          {/* Expanding Radar Wave 1 */}
          <Circle cx="12" cy="12" r={radarR1} fill="none" stroke="#014872" strokeWidth="1.5" opacity={radarOp1} />
          {/* Expanding Radar Wave 2 */}
          <Circle cx="12" cy="12" r={radarR2} fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity={radarOp2} />

          {/* Pin Body */}
          <Path
            d="M 12 2 C 7 2, 3 6, 3 11 C 3 17, 12 24, 12 24 C 12 24, 21 17, 21 11 C 21 6, 17 2, 12 2 Z"
            fill="#014872"
          />
          {/* Pin Center Core */}
          <Circle cx="12" cy="10" r="3.5" fill="#FFFFFF" />
        </G>

        {/* 7. Continuously Moving Futuristic Supermarket Cart */}
        <G
          x={cartX}
          y={cartY}
          transform={`rotate(${cartTilt} ${cartX + 18} ${cartY + 12})`}
        >
          {/* Cart Basket */}
          <Path
            d="M 6 4 L 38 4 L 32 26 L 12 26 Z"
            fill="rgba(1, 72, 114, 0.14)"
            stroke="#4338CA"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Cart Handle */}
          <Line x1="0" y1="-5" x2="8" y2="4" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" />
          <Circle cx="0" cy="-5" r="2.5" fill="#FED7B8" />

          {/* Grocery Items Inside Cart */}
          <Rect x="14" y="9" width="9" height="12" rx="2" fill="#1A6FA8" />
          <Rect x="24" y="12" width="8" height="9" rx="2" fill="#FED7B8" />
          <Circle cx="21" cy="7" r="4.5" fill="#EC4899" />

          {/* Wheels with Dual Rims */}
          <Line x1="12" y1="26" x2="14" y2="31" stroke="#012D4A" strokeWidth="2.2" />
          <Line x1="32" y1="26" x2="30" y2="31" stroke="#012D4A" strokeWidth="2.2" />

          <Circle cx="14" cy="33" r="4" fill="#012D4A" />
          <Circle cx="14" cy="33" r="1.8" fill="#FFFFFF" />

          <Circle cx="30" cy="33" r="4" fill="#012D4A" />
          <Circle cx="30" cy="33" r="1.8" fill="#FFFFFF" />
        </G>

        {/* 8. Digital Payment / Instant Checkout Symbol (Bottom Right) */}
        <G x="238" y="118">
          {/* Glass Checkout Badge */}
          <Rect
            x="0"
            y="0"
            width="88"
            height="44"
            rx="16"
            fill="#FFFFFF"
            stroke="rgba(1, 72, 114, 0.25)"
            strokeWidth="1.2"
          />
          {/* Mini Chip Contacts */}
          <Rect x="10" y="13" width="14" height="18" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
          <Line x1="14" y1="13" x2="14" y2="31" stroke="#F59E0B" strokeWidth="0.8" />
          <Line x1="10" y1="22" x2="24" y2="22" stroke="#F59E0B" strokeWidth="0.8" />

          {/* Success Checkmark Circle */}
          <Circle cx="38" cy="22" r="10" fill="#FFF8F3" />
          <Circle cx="38" cy="22" r="8" fill="#1A6FA8" />
          <Path
            d="M 35 22 L 37.5 24.5 L 41.5 19.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Contactless Waves */}
          <Path
            d="M 54 16 C 57 19, 57 25, 54 28"
            fill="none"
            stroke="#014872"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Path
            d="M 58 13 C 63 18, 63 26, 58 31"
            fill="none"
            stroke="#818CF8"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <Path
            d="M 62 10 C 69 17, 69 27, 62 34"
            fill="none"
            stroke="#C7D2FE"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </G>
      </Svg>

      {/* Floating Micro Status Chips */}
      <View style={styles.chipTopRight}>
        <View style={styles.pulseGreenDot} />
        <Wifi size={10} color="#014872" />
        <Text style={styles.chipText}>Ecosystem Connected</Text>
      </View>

      <View style={styles.chipBottomLeft}>
        <Sparkles size={10} color="#F97316" />
        <Text style={styles.chipTextPeach}>Live Store Sync</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 24,
    backgroundColor: '#0F2040',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#F1F5F9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  chipTopRight: {
    position: 'absolute',
    top: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(1, 72, 114, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#F1F5F9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  pulseGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  chipText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#F1F5F9',
    letterSpacing: 0.2,
  },
  chipBottomLeft: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(251, 146, 60, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  chipTextPeach: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#C2410C',
    letterSpacing: 0.2,
  },
});
