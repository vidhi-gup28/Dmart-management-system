import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { CalendarCheck, Clock, CheckCircle2, MapPin, ShieldCheck, Play, Square } from 'lucide-react-native';

interface StaffAttendanceScreenProps {
  onPunch: (action: 'check_in' | 'check_out') => Promise<any>;
}

export const StaffAttendanceScreen: React.FC<StaffAttendanceScreenProps> = ({ onPunch }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:57 AM');
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [workingSeconds, setWorkingSeconds] = useState(29220); // 8h 07m
  const [punchFeedback, setPunchFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isCheckedIn) return;
    const interval = setInterval(() => {
      setWorkingSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const hours = Math.floor(workingSeconds / 3600);
  const minutes = Math.floor((workingSeconds % 3600) / 60);
  const seconds = workingSeconds % 60;

  const handleTogglePunch = async () => {
    const action = isCheckedIn ? 'check_out' : 'check_in';
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (action === 'check_in') {
      setIsCheckedIn(true);
      setCheckInTime(timeStr);
      setCheckOutTime(null);
      setPunchFeedback('CHECK-IN VERIFIED ✓ (GPS: Store Gate 1)');
    } else {
      setIsCheckedIn(false);
      setCheckOutTime(timeStr);
      setPunchFeedback('CHECK-OUT RECORDED ✓');
    }

    await onPunch(action);

    setTimeout(() => {
      setPunchFeedback(null);
    }, 2500);
  };

  const history = [
    { date: 'Yesterday (15 Sep)', in: '08:55 AM', out: '05:02 PM', hours: '8h 07m', status: 'PRESENT' },
    { date: 'Mon (14 Sep)', in: '09:02 AM', out: '05:08 PM', hours: '8h 06m', status: 'PRESENT' },
    { date: 'Sun (13 Sep)', in: '01:00 PM', out: '09:12 PM', hours: '8h 12m', status: 'PRESENT' },
    { date: 'Sat (12 Sep)', in: '08:50 AM', out: '05:00 PM', hours: '8h 10m', status: 'PRESENT' },
    { date: 'Fri (11 Sep)', in: '09:15 AM', out: '05:15 PM', hours: '8h 00m', status: 'PRESENT' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
      {/* Real-time Clock Banner */}
      <View style={styles.liveClockCard}>
        <View style={styles.geoPill}>
          <MapPin size={11} color="#013459" />
          <Text style={styles.geoText}>Geo-Fencing Verified: Inside SmartMart</Text>
        </View>

        <Text style={styles.hoursTicker}>
          {hours}h {minutes.toString().padStart(2, '0')}m {seconds.toString().padStart(2, '0')}s
        </Text>
        <Text style={styles.hoursSub}>Active Shift Duration Today</Text>
      </View>

      {/* Punch Action Feedback Message */}
      {punchFeedback && (
        <View style={styles.feedbackBanner}>
          <CheckCircle2 size={16} color="#1A6FA8" />
          <Text style={styles.feedbackText}>{punchFeedback}</Text>
        </View>
      )}

      {/* Punch In / Punch Out Primary Button */}
      <TouchableOpacity
        style={[styles.punchBigBtn, isCheckedIn ? styles.punchOutBtn : styles.punchInBtn]}
        onPress={handleTogglePunch}
        activeOpacity={0.85}
      >
        <View style={styles.punchIconCircle}>
          {isCheckedIn ? <Square size={22} color="#EF4444" /> : <Play size={22} color="#1A6FA8" />}
        </View>
        <Text style={styles.punchBtnText}>{isCheckedIn ? 'CHECK OUT' : 'CHECK IN'}</Text>
        <Text style={styles.punchBtnSub}>{isCheckedIn ? 'Tap to end shift' : 'Tap to punch in'}</Text>
      </TouchableOpacity>

      {/* Today's Punch Times Card */}
      <View style={styles.todayPunchCard}>
        <Text style={styles.cardHeading}>TODAY'S ATTENDANCE SUMMARY</Text>
        <View style={styles.punchTimesRow}>
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxLabel}>Check-in</Text>
            <Text style={styles.timeBoxVal}>{checkInTime}</Text>
          </View>
          <View style={styles.timeBoxDivider} />
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxLabel}>Check-out</Text>
            <Text style={styles.timeBoxVal}>{checkOutTime || '-- : --'}</Text>
          </View>
          <View style={styles.timeBoxDivider} />
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxLabel}>Total Hours</Text>
            <Text style={[styles.timeBoxVal, { color: '#FED7B8' }]}>
              {hours}h {minutes}m
            </Text>
          </View>
        </View>
      </View>

      {/* Past 7 Days History Table */}
      <View style={styles.historyCard}>
        <Text style={styles.cardHeading}>RECENT ATTENDANCE LOG</Text>
        {history.map((rec, i) => (
          <View key={i} style={styles.historyRow}>
            <View style={{ flex: 1.5 }}>
              <Text style={styles.histDate}>{rec.date}</Text>
              <Text style={styles.histTimes}>{rec.in} – {rec.out}</Text>
            </View>
            <Text style={styles.histHours}>{rec.hours}</Text>
            <View style={styles.presentBadge}>
              <Text style={styles.presentText}>{rec.status}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 90 }} />
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
  liveClockCard: {
    backgroundColor: '#0A1628',
    borderColor: 'rgba(1, 72, 114, 0.18)',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  geoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0A1628',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  geoText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  hoursTicker: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FED7B8',
    letterSpacing: 1,
  },
  hoursSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A1628',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
  },
  feedbackText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  punchBigBtn: {
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 4,
  },
  punchInBtn: {
    backgroundColor: '#94A3B8',
    shadowColor: '#94A3B8',
  },
  punchOutBtn: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  punchIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F2040',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  punchBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  punchBtnSub: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  todayPunchCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  cardHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#8C386A',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  punchTimesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
  },
  timeBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#674D66',
  },
  timeBoxVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2B152A',
    marginTop: 2,
  },
  timeBoxDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#F1E5EC',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1E5EC',
  },
  histDate: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2B152A',
  },
  histTimes: {
    fontSize: 10,
    color: '#674D66',
    fontWeight: '600',
    marginTop: 1,
  },
  histHours: {
    fontSize: 12,
    fontWeight: '900',
    color: '#059669',
    marginRight: 10,
  },
  presentBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  presentText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
  }
});
