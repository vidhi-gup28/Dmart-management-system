import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { COLORS } from '../theme/colors';
import { Smartphone, Maximize2, Wifi, Battery, Signal } from 'lucide-react-native';

interface MobileFrameProps {
  children: React.ReactNode;
  currentRole?: string;
  onSwitchRole?: (role: any) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, currentRole, onSwitchRole }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [forceMobileFrame, setForceMobileFrame] = useState(true);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = dimensions.width > 540;
  const isFramed = isDesktop && forceMobileFrame;

  // Format real-time clock
  const [currentTime, setCurrentTime] = useState('9:41');
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const h = d.getHours() % 12 || 12;
      const m = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.outerContainer}>
      {/* Desktop Helper Toolbar */}
      {isDesktop && (
        <View style={styles.desktopToolbar}>
          <View style={styles.brandBadge}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>D-MART ECOSYSTEM</Text>
          </View>

          <TouchableOpacity
            style={styles.togglePill}
            onPress={() => setForceMobileFrame(!forceMobileFrame)}
            activeOpacity={0.8}
          >
            {forceMobileFrame ? (
              <>
                <Maximize2 size={13} color={'#EBD6DC'} />
                <Text style={styles.toggleText}>Wide Mode</Text>
              </>
            ) : (
              <>
                <Smartphone size={13} color={'#EBD6DC'} />
                <Text style={styles.toggleText}>Phone Frame</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Main Container */}
      <View
        style={[
          styles.innerContainer,
          isFramed ? styles.phoneFrame : styles.fullScreenFrame,
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor="#674D66" />

        {/* Mobile Status Bar */}
        <View style={styles.mobileStatusBar}>
          <Text style={styles.statusTime}>{currentTime}</Text>
          
          {/* Dynamic Island / Speaker Pill */}
          <View style={styles.dynamicIsland}>
            <View style={styles.cameraLens} />
          </View>

          <View style={styles.statusIcons}>
            <Signal size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Wifi size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Battery size={14} color="#FFFFFF" />
          </View>
        </View>

        {/* Child Screen Content */}
        <View style={styles.contentArea}>
          {children}
        </View>

        {/* Mobile Home Bar Pill */}
        <View style={styles.homeBarContainer}>
          <View style={styles.homeBarPill} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#352134', // Ambient deep mauve desktop backdrop
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' ? { overflow: 'hidden' } : {}),
  },
  desktopToolbar: {
    position: 'absolute',
    top: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 540,
    paddingHorizontal: 12,
    zIndex: 9999,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.30)',
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EBD6DC', // Soft Pink Blush
    marginRight: 6,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },

  togglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.30)',
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EBD6DC',
  },
  innerContainer: {
    backgroundColor: '#674D66',
    overflow: 'hidden',
  },
  phoneFrame: {
    width: 412,
    height: '94%',
    maxHeight: 890,
    borderRadius: 48,
    borderWidth: 8,
    borderColor: '#4E344D',
    shadowColor: '#1E0E1D',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.70,
    shadowRadius: 40,
    elevation: 20,
    position: 'relative',
  },
  fullScreenFrame: {
    width: '100%',
    height: '100%',
  },
  mobileStatusBar: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#674D66',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    zIndex: 100,
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dynamicIsland: {
    width: 88,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2E1A2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLens: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4E344D',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#674D66',
  },
  homeBarContainer: {
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(82, 59, 81, 0.95)',
  },
  homeBarPill: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
  }
});
