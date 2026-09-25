import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  elevated?: boolean;
  subtle?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, elevated, subtle }) => {
  return (
    <View
      style={[
        styles.base,
        elevated ? styles.elevated : subtle ? styles.subtle : styles.standard,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  standard: {
    backgroundColor: COLORS.surfaceGlass,
    borderColor: COLORS.borderGlass,
    shadowColor: '#F1F5F9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  elevated: {
    backgroundColor: COLORS.surfaceGlassElevated,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderRadius: 24,
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  subtle: {
    backgroundColor: COLORS.surfaceGlassSubtle,
    borderColor: 'rgba(255, 255, 255, 0.65)',
  }
});
