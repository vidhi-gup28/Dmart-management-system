import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle, Rect, Path, G, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../theme/colors';
import { Compass, ShoppingBag, MapPin, Sparkles, ArrowRight } from 'lucide-react-native';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const slides = [
    {
      title: 'Discover Your Store',
      tagline: 'PREMIUM HYPERMARKET',
      description: 'Explore departments and find products without wandering around.',
      color: '#F1F5F9',
      renderIllustration: () => (
        <Svg width="220" height="180" viewBox="0 0 220 180">
          <Defs>
            <LinearGradient id="illGrad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFF8F3" />
              <Stop offset="100%" stopColor="#E0E7FF" />
            </LinearGradient>
          </Defs>
          <Circle cx="110" cy="90" r="70" fill="url(#illGrad1)" />
          {/* Shelves & Supermarket Graphic */}
          <Rect x="50" y="55" width="120" height="8" rx="4" fill="#014872" />
          <Rect x="50" y="95" width="120" height="8" rx="4" fill="#014872" />
          <Rect x="50" y="135" width="120" height="8" rx="4" fill="#014872" />
          {/* Products */}
          <Rect x="65" y="38" width="16" height="17" rx="3" fill="#FED7B8" />
          <Rect x="88" y="32" width="18" height="23" rx="3" fill="#3B82F6" />
          <Rect x="115" y="36" width="14" height="19" rx="3" fill="#1A6FA8" />
          <Rect x="136" y="30" width="22" height="25" rx="3" fill="#EC4899" />
          {/* Middle row */}
          <Rect x="60" y="76" width="20" height="19" rx="3" fill="#8B5CF6" />
          <Rect x="88" y="72" width="25" height="23" rx="3" fill="#0EA5E9" />
          <Rect x="122" y="78" width="16" height="17" rx="3" fill="#F59E0B" />
          {/* Floating badge */}
          <Circle cx="165" cy="50" r="16" fill="#1A6FA8" />
          <Path d="M 158 50 L 163 55 L 172 45" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </Svg>
      )
    },
    {
      title: 'Find Products Instantly',
      tagline: 'INDOOR GPS & ROUTING',
      description: "Use SmartMart's indoor store navigation to locate products quickly.",
      color: '#3B82F6',
      renderIllustration: () => (
        <Svg width="220" height="180" viewBox="0 0 220 180">
          <Defs>
            <LinearGradient id="illGrad2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#EFF6FF" />
              <Stop offset="100%" stopColor="#DBEAFE" />
            </LinearGradient>
          </Defs>
          <Circle cx="110" cy="90" r="70" fill="url(#illGrad2)" />
          {/* Floor grid */}
          <Rect x="50" y="40" width="45" height="35" rx="6" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
          <Rect x="110" y="40" width="60" height="35" rx="6" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
          <Rect x="50" y="100" width="45" height="40" rx="6" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
          <Rect x="110" y="100" width="60" height="40" rx="6" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="2" />
          {/* Navigation route */}
          <Path d="M 72 155 L 72 85 L 140 85 L 140 120" stroke="#3B82F6" strokeWidth="3" strokeDasharray="5, 3" fill="none" />
          <Circle cx="72" cy="155" r="5" fill="#1A6FA8" />
          <Circle cx="140" cy="120" r="6" fill="#EF4444" />
        </Svg>
      )
    },
    {
      title: 'Shop Online or In Store',
      tagline: 'UNIFIED ECOSYSTEM',
      description: 'One app for your physical store visits and online shopping.',
      color: '#94A3B8',
      renderIllustration: () => (
        <Svg width="220" height="180" viewBox="0 0 220 180">
          <Defs>
            <LinearGradient id="illGrad3" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFF8F3" />
              <Stop offset="100%" stopColor="#D1FAE5" />
            </LinearGradient>
          </Defs>
          <Circle cx="110" cy="90" r="70" fill="url(#illGrad3)" />
          {/* Shopping Cart & Mobile graphic */}
          <Rect x="60" y="45" width="50" height="85" rx="10" fill="#FFFFFF" stroke="#1A6FA8" strokeWidth="2" />
          <Circle cx="85" cy="118" r="4" fill="#013459" />
          {/* Cart Icon */}
          <G x="120" y="65">
            <Path d="M 0 0 L 30 0 L 25 22 L 8 22 Z" fill="rgba(16, 185, 129, 0.2)" stroke="#1A6FA8" strokeWidth="2" />
            <Circle cx="10" cy="27" r="3" fill="#065F46" />
            <Circle cx="23" cy="27" r="3" fill="#065F46" />
          </G>
        </Svg>
      )
    }
  ];

  const slide = slides[currentStep];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Skip Button */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>SMARTMART</Text>
        <TouchableOpacity onPress={onComplete}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>

      {/* Center Illustration */}
      <View style={styles.illustrationArea}>
        {slide.renderIllustration()}
      </View>

      {/* Text Card */}
      <View style={styles.contentCard}>
        <View style={styles.taglinePill}>
          <Sparkles size={11} color={slide.color} />
          <Text style={[styles.taglineText, { color: slide.color }]}>{slide.tagline}</Text>
        </View>

        <Text style={styles.titleText}>{slide.title}</Text>
        <Text style={styles.descText}>{slide.description}</Text>

        {/* Step Indicators */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentStep && [styles.dotActive, { backgroundColor: slide.color }]
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: slide.color }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {currentStep === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
          </Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FED7B8',
    letterSpacing: 1,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.98)',
    borderWidth: 1.5,
    borderRadius: 28,
    padding: 22,
    shadowColor: '#F1F5F9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  taglinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F1F5F9',
    letterSpacing: -0.3,
  },
  descText: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  dotActive: {
    width: 22,
    borderRadius: 3,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 18,
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  }
});
