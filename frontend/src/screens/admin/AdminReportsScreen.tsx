import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FileText, Download, Printer, Share2, CheckCircle2, ChevronRight } from 'lucide-react-native';

export const AdminReportsScreen: React.FC = () => {
  const [downloadedReport, setDownloadedReport] = useState<string | null>(null);

  const reports = [
    { id: 'sales', title: 'Monthly Sales & Revenue Report', sub: 'Gross Revenue, Online Orders, POS Breakdown', date: 'Sep 2026', size: '2.4 MB' },
    { id: 'inventory', title: 'Inventory Health & Restocking Log', sub: 'Low Stock SKU Alerts, Shelf Audits, Write-offs', date: 'Live Sync', size: '1.8 MB' },
    { id: 'attendance', title: 'Staff Biometric Attendance Register', sub: '63 Staff, Shifts, Working Hours & Overtime', date: 'Sep 2026', size: '950 KB' },
    { id: 'departments', title: 'Department P&L Performance Report', sub: 'Top Grossing Sections: Grocery, Dairy, Personal Care', date: 'Q3 2026', size: '3.1 MB' },
    { id: 'pos', title: 'Cashier & POS Counter Throughput', sub: 'Lanes 1-8 Average Checkout Velocity (1.8m/cart)', date: 'Daily Log', size: '1.2 MB' },
  ];

  const handleExport = (title: string, format: 'CSV' | 'PDF') => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.${format.toLowerCase()}`;
    
    if (format === 'CSV') {
      let csvContent = '';
      if (title.includes('Sales')) {
        csvContent = 'Date,Channel,Transactions,Gross_Revenue_INR,Tax_Collected_INR,Average_Basket_Size\n' +
          '2026-09-19,POS Counter,1050,556000,27800,529\n' +
          '2026-09-19,Online Express,520,286000,14300,550\n' +
          '2026-09-18,Total Combined,1520,812000,40600,534\n';
      } else if (title.includes('Inventory')) {
        csvContent = 'SKU,Product_Name,Department,Stock_Quantity,Min_Stock_Threshold,Status,Aisle_Shelf\n' +
          'SKU-FORTUNE-OIL,Fortune Sunlite Sunflower Oil,Grocery & Staples,12,25,LOW_STOCK,Aisle 1 (A-05)\n' +
          'SKU-AMUL-GOLD,Amul Gold Fresh Milk 500ml,Dairy & Chilled,145,30,HEALTHY,Aisle 2 (D-02)\n' +
          'SKU-AASH-ATTA,Aashirvaad Chakki Atta 5kg,Grocery & Staples,82,20,HEALTHY,Aisle 1 (A-01)\n' +
          'SKU-DOVE-SHAMP,Dove Intense Repair Shampoo,Personal Care,42,15,HEALTHY,Aisle 8 (H-02)\n';
      } else if (title.includes('Attendance')) {
        csvContent = 'Emp_ID,Name,Department,Shift,Punch_In,Punch_Out,Total_Hours,Status\n' +
          'SM1024,Rahul Sharma,Grocery & Staples,Morning (08:00-17:00),08:57 AM,Active,8h 07m,PRESENT\n' +
          'SM1002,Pooja Verma,Customer Service,Morning (08:00-17:00),08:50 AM,05:05 PM,8h 15m,PRESENT\n' +
          'SM1015,Vikram Singhania,POS Cashier,Evening (14:00-22:00),01:55 PM,Active,6h 30m,PRESENT\n';
      } else {
        csvContent = 'Metric,Value,Target,Status,Notes\n' +
          'Footfall Rate,78%,80%,OPTIMAL,Steady weekend flow\n' +
          'Inventory Accuracy,94%,95%,GOOD,Synced with POS register\n' +
          'Checkout Velocity,1.8m/cart,2.0m/cart,FAST,POS Lane 1-8 optimal\n';
      }

      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } else if (format === 'PDF') {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.print();
      }
    }

    setDownloadedReport(filename);
    setTimeout(() => {
      setDownloadedReport(null);
    }, 4000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Executive Reports & Analytics Exports</Text>
      <Text style={styles.pageSub}>Automated CSV & PDF generation for financial, inventory, and staff compliance</Text>

      {downloadedReport && (
        <View style={styles.successBanner}>
          <CheckCircle2 size={16} color="#1A6FA8" />
          <Text style={styles.successText}>Exported: {downloadedReport}</Text>
        </View>
      )}

      <View style={styles.reportsList}>
        {reports.map((rep) => (
          <View key={rep.id} style={styles.reportCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <FileText size={18} color={'#FED7B8'} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={styles.reportTitle}>{rep.title}</Text>
                <Text style={styles.reportSub}>{rep.sub}</Text>
                <Text style={styles.reportMeta}>{rep.date} • {rep.size}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.exportBtn}
                onPress={() => handleExport(rep.title, 'CSV')}
                activeOpacity={0.8}
              >
                <Download size={13} color={'#FED7B8'} />
                <Text style={styles.exportBtnText}>Export CSV</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exportBtn, styles.pdfBtn]}
                onPress={() => handleExport(rep.title, 'PDF')}
                activeOpacity={0.8}
              >
                <Printer size={13} color="#FFFFFF" />
                <Text style={styles.pdfBtnText}>Export PDF</Text>
              </TouchableOpacity>
            </View>
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
  },
  scrollPadding: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  pageSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 12,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A1628',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  successText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#674D66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2B152A',
  },
  reportSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#674D66',
    marginTop: 2,
  },
  reportMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8C386A',
    marginTop: 3,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1E5EC',
    paddingTop: 10,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#674D66',
    borderRadius: 12,
    paddingVertical: 8,
  },
  exportBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pdfBtn: {
    backgroundColor: '#C24379',
  },
  pdfBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  }
});
