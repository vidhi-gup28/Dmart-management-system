import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import Svg, { Line, Rect, Circle } from 'react-native-svg';
import { COLORS } from '../theme/colors';
import { ScanBarcode, X, CheckCircle2, Zap, Search, Camera } from 'lucide-react-native';
import { Product } from '../types';

interface BarcodeScannerSimulatorProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (productBarcode: string) => void;
  products?: Product[];
}

export const BarcodeScannerSimulator: React.FC<BarcodeScannerSimulatorProps> = ({
  visible,
  onClose,
  onScanSuccess,
  products = []
}) => {
  const [laserPos, setLaserPos] = useState(20);
  const [manualCode, setManualCode] = useState('');
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  // Animated laser line sweep
  useEffect(() => {
    if (!visible) return;
    let animId: number;
    let start = Date.now();
    const sweep = () => {
      const elapsed = (Date.now() - start) / 1000;
      // sweep between 15 and 135
      const y = 20 + ((Math.sin(elapsed * 3) + 1) / 2) * 110;
      setLaserPos(y);
      animId = requestAnimationFrame(sweep);
    };
    animId = requestAnimationFrame(sweep);
    return () => cancelAnimationFrame(animId);
  }, [visible]);

  // Preset fast barcode simulations
  const PRESET_BARCODES = [
    { name: 'Amul Gold Milk 1L', code: '8901030000021', price: '₹66' },
    { name: 'Dove Repair Shampoo 650ml', code: '8901030000053', price: '₹499' },
    { name: 'India Gate Basmati Rice 5kg', code: '8901030000003', price: '₹549' },
    { name: 'Maggi 2-Min Masala Pack 12', code: '8901030000041', price: '₹168' },
    { name: 'Tata Salt Iodized 1kg', code: '8901030000009', price: '₹28' },
    { name: 'Surf Excel Matic Liquid 2L', code: '8901030000065', price: '₹435' },
  ];

  const handleTriggerScan = (barcode: string) => {
    setLastScanned(barcode);
    setTimeout(() => {
      onScanSuccess(barcode);
      onClose();
    }, 400);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.scannerCard}>
          {/* Top Bar */}
          <View style={styles.scannerHeader}>
            <View style={styles.titleRow}>
              <ScanBarcode size={18} color={'#FED7B8'} />
              <Text style={styles.scannerTitle}>SmartMart Optical Scanner</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Camera Viewfinder View */}
          <View style={styles.viewfinder}>
            {/* Dark Camera Backdrop with Target Reticle */}
            <View style={styles.reticleBox}>
              {/* Four Corner Hologram Brackets */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Holographic Laser Sweep Canvas */}
              <Svg width="220" height="150" viewBox="0 0 220 150">
                {/* Center Target Box */}
                <Rect x="20" y="20" width="180" height="110" rx="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                
                {/* Moving Red Laser Line */}
                <Line x1="15" y1={laserPos} x2="205" y2={laserPos} stroke="#EF4444" strokeWidth="2.5" />
                <Circle cx="20" cy={laserPos} r="3" fill="#EF4444" />
                <Circle cx="200" cy={laserPos} r="3" fill="#EF4444" />
              </Svg>

              <Text style={styles.viewfinderHelp}>Align barcode inside optical reticle</Text>
            </View>

            {lastScanned && (
              <View style={styles.scanSuccessBadge}>
                <CheckCircle2 size={16} color="#1A6FA8" />
                <Text style={styles.scanSuccessText}>Barcode Captured: {lastScanned}</Text>
              </View>
            )}
          </View>

          {/* Quick Simulated Product Presets */}
          <View style={styles.presetsSection}>
            <Text style={styles.presetsLabel}>FAST BARCODE SCANNER PRESETS</Text>
            <View style={styles.presetGrid}>
              {PRESET_BARCODES.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={styles.presetChip}
                  onPress={() => handleTriggerScan(item.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.chipLeft}>
                    <Text style={styles.presetName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.presetSub}>{item.code}</Text>
                  </View>
                  <Text style={styles.presetPrice}>{item.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Manual Barcode Input */}
          <View style={styles.manualInputRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="Or type product barcode / SKU..."
              placeholderTextColor={COLORS.textMuted}
              value={manualCode}
              onChangeText={setManualCode}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.manualSubmitBtn}
              onPress={() => manualCode && handleTriggerScan(manualCode)}
            >
              <Text style={styles.manualBtnText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  scannerCard: {
    backgroundColor: '#0F2040',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 20,
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    height: 180,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  reticleBox: {
    width: 230,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: '#F1F5F9',
  },
  cornerTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
  viewfinderHelp: {
    position: 'absolute',
    bottom: 8,
    fontSize: 10,
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  scanSuccessBadge: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  scanSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  presetsSection: {
    marginBottom: 12,
  },
  presetsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1628',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  chipLeft: {
    flex: 1,
    marginRight: 6,
  },
  presetName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  presetSub: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
  },
  presetPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FED7B8',
  },
  manualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manualInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 12,
    color: '#F1F5F9',
  },
  manualSubmitBtn: {
    backgroundColor: '#FED7B8',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  }
});
