import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { COLORS } from '../theme/colors';
import { X, Printer, Download, Share2, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { Transaction } from '../types';

interface DigitalInvoiceModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

export const DigitalInvoiceModal: React.FC<DigitalInvoiceModalProps> = ({
  visible,
  transaction,
  onClose,
}) => {
  if (!visible || !transaction) return null;

  const handlePrint = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        window.print();
        return;
      }

      const itemsHtml = (transaction.items || []).map(item => `
        <tr>
          <td style="padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 13px;">
            <strong>${item.product_name}</strong><br/>
            <span style="font-size: 11px; color: #64748b;">BARCODE: ${item.product_barcode || '8901030000000'}</span>
          </td>
          <td style="padding: 6px 0; border-bottom: 1px dashed #e2e8f0; text-align: center; font-size: 13px;">${item.quantity}</td>
          <td style="padding: 6px 0; border-bottom: 1px dashed #e2e8f0; text-align: right; font-size: 13px;">₹${item.unit_price}</td>
          <td style="padding: 6px 0; border-bottom: 1px dashed #e2e8f0; text-align: right; font-size: 13px; font-weight: 600;">₹${item.subtotal}</td>
        </tr>
      `).join('');

      const invoiceDate = new Date(transaction.created_at || Date.now()).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>SmartMart Invoice - ${transaction.invoice_number}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #1e293b; max-width: 480px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #0f172a; padding-bottom: 14px; margin-bottom: 14px; }
            .brand { font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #0f172a; }
            .tagline { font-size: 11px; color: #64748b; margin-top: 2px; }
            .address { font-size: 11px; color: #475569; margin-top: 4px; }
            .meta-box { margin-bottom: 14px; font-size: 12px; }
            .meta-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
            .totals { margin-top: 14px; border-top: 1px dashed #0f172a; padding-top: 10px; font-size: 13px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .grand-total { font-size: 16px; font-weight: 900; color: #0f172a; border-top: 1px solid #0f172a; padding-top: 8px; margin-top: 6px; }
            .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">SMARTMART</div>
            <div class="tagline">Your Store. Digitally Connected.</div>
            <div class="address">Outer Ring Rd, Bellandur, Bengaluru • GSTIN: 29AABCS1429B1Z4</div>
          </div>

          <div class="meta-box">
            <div class="meta-row"><span><strong>Invoice:</strong> ${transaction.invoice_number}</span><span><strong>Date:</strong> ${invoiceDate}</span></div>
            <div class="meta-row"><span><strong>Cashier:</strong> ${transaction.cashier_name || 'Lane 3 (POS)'}</span><span><strong>Mode:</strong> ${transaction.payment_mode}</span></div>
            <div class="meta-row"><span><strong>Customer:</strong> ${transaction.customer_name || 'Walk-in'} (${transaction.customer_phone || '+91 98765 43210'})</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item</th>
                <th style="text-align: center; width: 12%;">Qty</th>
                <th style="text-align: right; width: 18%;">Price</th>
                <th style="text-align: right; width: 20%;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div class="totals">
            <div class="total-row"><span>Subtotal:</span><span>₹${transaction.subtotal}</span></div>
            <div class="total-row"><span>Tax (CGST + SGST 5%):</span><span>₹${transaction.tax_amount || transaction.tax || Math.round(transaction.subtotal * 0.05)}</span></div>
            ${transaction.discount_amount || transaction.discount ? `<div class="total-row" style="color: #16a34a;"><span>Member Savings:</span><span>-₹${transaction.discount_amount || transaction.discount}</span></div>` : ''}
            <div class="total-row grand-total"><span>NET TOTAL PAID:</span><span>₹${transaction.total}</span></div>
          </div>

          <div class="footer">
            <p><strong>✓ PAYMENT RECEIVED • STATUS: PAID</strong></p>
            <p>Thank you for shopping at SmartMart! Return & exchange valid for 7 days with this digital invoice.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert(`Printing invoice ${transaction.invoice_number} to connected receipt printer...`);
    }
  };

  const handleDownload = () => {
    handlePrint();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.receiptContainer}>
          {/* Header Actions */}
          <View style={styles.topActions}>
            <View style={styles.verifiedPill}>
              <ShieldCheck size={14} color="#1A6FA8" />
              <Text style={styles.verifiedText}>OFFICIAL TAX INVOICE</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.receiptScroll} showsVerticalScrollIndicator={false}>
            {/* Store Brand Header */}
            <View style={styles.brandHeader}>
              <Text style={styles.storeName}>SMARTMART</Text>
              <Text style={styles.storeTagline}>Your Store. Digitally Connected.</Text>
              <Text style={styles.storeAddress}>
                SmartMart Hypermarket Ltd. • Outer Ring Rd, Bellandur, Bengaluru
              </Text>
              <Text style={styles.gstin}>GSTIN: 29AABCS1429B1Z4 • CIN: U52100KA2024PLC09821</Text>
            </View>

            {/* Dashed Separator */}
            <View style={styles.dashedDivider} />

            {/* Bill Meta Details */}
            <View style={styles.metaRow}>
              <View>
                <Text style={styles.metaLabel}>INVOICE NUMBER</Text>
                <Text style={styles.metaValue}>{transaction.invoice_number}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.metaLabel}>DATE & TIME</Text>
                <Text style={styles.metaValue}>
                  {new Date(transaction.created_at || Date.now()).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View>
                <Text style={styles.metaLabel}>CASHIER</Text>
                <Text style={styles.metaValue}>{transaction.cashier_name || 'Vikram Singhania (SM1002)'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.metaLabel}>PAYMENT METHOD</Text>
                <Text style={styles.paymentMethodBadge}>{transaction.payment_mode}</Text>
              </View>
            </View>

            <View style={styles.dashedDivider} />

            {/* Itemized Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colHeader, { flex: 2 }]}>ITEM</Text>
              <Text style={[styles.colHeader, { flex: 0.6, textAlign: 'center' }]}>QTY</Text>
              <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>PRICE</Text>
              <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>TOTAL</Text>
            </View>

            {/* Items List */}
            {transaction.items && transaction.items.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.product_name}</Text>
                  <Text style={styles.itemSku}>{item.product_barcode || '8901030000000'}</Text>
                </View>
                <Text style={[styles.itemQty, { flex: 0.6, textAlign: 'center' }]}>{item.quantity}</Text>
                <Text style={[styles.itemPrice, { flex: 1, textAlign: 'right' }]}>₹{item.unit_price}</Text>
                <Text style={[styles.itemSub, { flex: 1, textAlign: 'right' }]}>₹{item.subtotal}</Text>
              </View>
            ))}

            <View style={styles.dashedDivider} />

            {/* Calculation Breakdown */}
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>₹{transaction.subtotal}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Estimated CGST + SGST (5%)</Text>
              <Text style={styles.breakdownValue}>₹{transaction.tax}</Text>
            </View>
            {transaction.discount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.discountLabel}>SmartMart Member Savings</Text>
                <Text style={styles.discountValue}>- ₹{transaction.discount}</Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>NET AMOUNT PAID</Text>
              <Text style={styles.totalValue}>₹{transaction.total}</Text>
            </View>

            {/* QR Code & Barcode Receipt Footer */}
            <View style={styles.receiptFooter}>
              <View style={styles.paidBadge}>
                <CheckCircle2 size={16} color="#1A6FA8" />
                <Text style={styles.paidText}>PAYMENT RECEIVED • STATUS: PAID</Text>
              </View>
              <Text style={styles.footerNote}>
                Thank you for shopping at SmartMart! Return & exchange valid for 7 days with this digital invoice.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons: VIEW, PRINT, DOWNLOAD */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handlePrint} activeOpacity={0.8}>
              <Printer size={16} color={'#FED7B8'} />
              <Text style={styles.actionBtnText}>Print</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, styles.downloadBtn]} onPress={handleDownload} activeOpacity={0.8}>
              <Download size={16} color="#FFFFFF" />
              <Text style={styles.downloadBtnText}>Download PDF</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  receiptContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: '#0F2040',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
    padding: 18,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A1628',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CBD5E1',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptScroll: {
    maxHeight: 520,
  },
  brandHeader: {
    alignItems: 'center',
    marginVertical: 6,
  },
  storeName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#FED7B8',
  },
  storeTagline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  storeAddress: {
    fontSize: 9.5,
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
  },
  gstin: {
    fontSize: 8.5,
    color: '#475569',
    marginTop: 2,
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
    marginTop: 1,
  },
  paymentMethodBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FED7B8',
    backgroundColor: '#0A1628',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  colHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  itemName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  itemSku: {
    fontSize: 8.5,
    color: '#475569',
  },
  itemQty: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  itemPrice: {
    fontSize: 11,
    color: '#94A3B8',
  },
  itemSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  breakdownValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  discountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  discountValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A1628',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FED7B8',
  },
  receiptFooter: {
    alignItems: 'center',
    marginTop: 14,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A1628',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 6,
  },
  paidText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  footerNote: {
    fontSize: 8.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FED7B8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F2040',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FED7B8',
  },
  downloadBtn: {
    backgroundColor: '#FED7B8',
    borderColor: '#FED7B8',
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  }
});
