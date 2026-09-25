import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import { X, CheckCircle2, QrCode, Smartphone, CreditCard, Banknote, ShieldCheck } from 'lucide-react-native';
import { Transaction } from '../types';

interface DigitalBillPaymentModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onPaymentComplete: (invoiceNumber: string, method: string) => void;
}

export const DigitalBillPaymentModal: React.FC<DigitalBillPaymentModalProps> = ({
  visible,
  transaction,
  onClose,
  onPaymentComplete
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'WALLET' | 'CASH'>('UPI');
  const [upiApp, setUpiApp] = useState<'GooglePay' | 'PhonePe' | 'Paytm'>('GooglePay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!visible || !transaction) return null;

  const handlePay = () => {
    if (selectedMethod === 'CASH') {
      alert('Please hand over cash at Cashier Counter. Cashier will confirm receipt on POS.');
      onPaymentComplete(transaction.invoice_number, 'Cash at Counter');
      onClose();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        const methodDesc = selectedMethod === 'UPI' ? `UPI (${upiApp})` : selectedMethod === 'CARD' ? 'Debit/Credit Card' : 'SmartMart Wallet';
        onPaymentComplete(transaction.invoice_number, methodDesc);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Pay SmartMart Bill</Text>
              <Text style={styles.sheetSub}>Invoice #{transaction.invoice_number}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Amount Callout */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total Payable Amount</Text>
            <Text style={styles.amountValue}>₹{transaction.total}</Text>
            <View style={styles.safeTag}>
              <ShieldCheck size={13} color="#1A6FA8" />
              <Text style={styles.safeText}>SmartMart Instant Secure Checkout (Demo)</Text>
            </View>
          </View>

          {/* Payment Method Selector Tabs */}
          <View style={styles.methodSelector}>
            <TouchableOpacity
              style={[styles.methodTab, selectedMethod === 'UPI' && styles.methodTabActive]}
              onPress={() => setSelectedMethod('UPI')}
            >
              <Smartphone size={16} color={selectedMethod === 'UPI' ? '#FFFFFF' : COLORS.textNavy} />
              <Text style={[styles.methodTabText, selectedMethod === 'UPI' && styles.methodTabTextActive]}>UPI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodTab, selectedMethod === 'CARD' && styles.methodTabActive]}
              onPress={() => setSelectedMethod('CARD')}
            >
              <CreditCard size={16} color={selectedMethod === 'CARD' ? '#FFFFFF' : COLORS.textNavy} />
              <Text style={[styles.methodTabText, selectedMethod === 'CARD' && styles.methodTabTextActive]}>Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodTab, selectedMethod === 'CASH' && styles.methodTabActive]}
              onPress={() => setSelectedMethod('CASH')}
            >
              <Banknote size={16} color={selectedMethod === 'CASH' ? '#FFFFFF' : COLORS.textNavy} />
              <Text style={[styles.methodTabText, selectedMethod === 'CASH' && styles.methodTabTextActive]}>Pay Cash</Text>
            </TouchableOpacity>
          </View>

          {/* Method Content */}
          {selectedMethod === 'UPI' && (
            <View style={styles.upiAppsContainer}>
              <Text style={styles.optionsLabel}>SELECT PREFERRED UPI APP</Text>
              <View style={styles.upiGrid}>
                {(['GooglePay', 'PhonePe', 'Paytm'] as const).map((app) => (
                  <TouchableOpacity
                    key={app}
                    style={[styles.upiCard, upiApp === app && styles.upiCardActive]}
                    onPress={() => setUpiApp(app)}
                  >
                    <View style={styles.upiRadio}>
                      {upiApp === app && <View style={styles.upiRadioInner} />}
                    </View>
                    <Text style={styles.upiCardText}>{app}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.upiHint}>Virtual Payment Address: smartmart@upi</Text>
            </View>
          )}

          {selectedMethod === 'CARD' && (
            <View style={styles.cardInfoBox}>
              <Text style={styles.optionsLabel}>SAVED PAYMENT CARDS</Text>
              <View style={styles.savedCardRow}>
                <CreditCard size={20} color={'#FED7B8'} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.savedCardTitle}>HDFC Bank Platinum Debit Card</Text>
                  <Text style={styles.savedCardNumber}>•••• •••• •••• 4092</Text>
                </View>
                <Text style={styles.cvvText}>CVV: •••</Text>
              </View>
            </View>
          )}

          {selectedMethod === 'CASH' && (
            <View style={styles.cashNoticeBox}>
              <Banknote size={24} color="#F59E0B" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cashNoticeTitle}>Pay at Checkout Counter</Text>
                <Text style={styles.cashNoticeSub}>
                  Present this screen to Cashier. Hand over ₹{transaction.total} in cash to receive printed invoice and updated status.
                </Text>
              </View>
            </View>
          )}

          {/* Processing / Success State */}
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={'#FED7B8'} />
              <Text style={styles.processingText}>Processing secure payment with {selectedMethod}...</Text>
            </View>
          )}

          {isSuccess && (
            <View style={styles.processingOverlay}>
              <CheckCircle2 size={46} color="#1A6FA8" />
              <Text style={styles.successTitle}>PAYMENT SUCCESSFUL ✓</Text>
              <Text style={styles.successSub}>Bill status updated to PAID. Inventory synced.</Text>
            </View>
          )}

          {/* Trigger Pay Button */}
          {!isProcessing && !isSuccess && (
            <TouchableOpacity style={styles.payNowBtn} onPress={handlePay} activeOpacity={0.85}>
              <Text style={styles.payNowText}>
                {selectedMethod === 'CASH' ? 'Confirm Pay by Cash' : `Pay ₹${transaction.total}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#0F2040',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
    minHeight: 400,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  sheetSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountBox: {
    backgroundColor: '#0A1628',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F1F5F9',
    marginVertical: 4,
  },
  safeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0A1628',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  safeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  methodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  methodTabActive: {
    backgroundColor: '#FED7B8',
  },
  methodTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  methodTabTextActive: {
    color: '#FFFFFF',
  },
  optionsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  upiAppsContainer: {
    marginBottom: 16,
  },
  upiGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  upiCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#0A1628',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 6,
  },
  upiCardActive: {
    borderColor: '#FED7B8',
    backgroundColor: '#0A1628',
  },
  upiRadio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#FED7B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiRadioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FED7B8',
  },
  upiCardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  upiHint: {
    fontSize: 10,
    color: '#475569',
    marginTop: 8,
    textAlign: 'center',
  },
  cardInfoBox: {
    marginBottom: 16,
  },
  savedCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#0A1628',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  savedCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  savedCardNumber: {
    fontSize: 10,
    color: '#94A3B8',
  },
  cvvText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  cashNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  cashNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  cashNoticeSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
    lineHeight: 15,
  },
  processingOverlay: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 12,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#CBD5E1',
    marginTop: 10,
  },
  successSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  payNowBtn: {
    backgroundColor: '#FED7B8',
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FED7B8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
    marginTop: 8,
  },
  payNowText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  }
});
