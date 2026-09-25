import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { StaffTask, AttendanceRecord } from '../../types';
import {
  User, Clock, CheckSquare, CalendarCheck, AlertTriangle,
  ArrowRight, ShieldCheck, CheckCircle2, PlayCircle, Layers
} from 'lucide-react-native';

interface StaffDashboardScreenProps {
  tasks: StaffTask[];
  onNavigateToAttendance: () => void;
  onNavigateToTasks: () => void;
  onNavigateToDepartment: () => void;
  onUpdateTaskStatus: (taskId: number, newStatus: string) => void;
}

export const StaffDashboardScreen: React.FC<StaffDashboardScreenProps> = ({
  tasks,
  onNavigateToAttendance,
  onNavigateToTasks,
  onNavigateToDepartment,
  onUpdateTaskStatus,
}) => {
  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
      {/* Staff Profile Glass Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>RS</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.staffName}>Rahul Sharma</Text>
            <View style={styles.activePill}>
              <View style={styles.greenDot} />
              <Text style={styles.activePillText}>On Duty</Text>
            </View>
          </View>
          <Text style={styles.empId}>Employee ID: SM1024 • Store Associate</Text>
          <Text style={styles.deptText}>Department: Grocery & Staples • Shift: 9 AM – 5 PM</Text>
        </View>
      </View>

      {/* Attendance & Shift Quick Card */}
      <TouchableOpacity style={styles.shiftCard} onPress={onNavigateToAttendance} activeOpacity={0.85}>
        <View style={styles.shiftCardLeft}>
          <CalendarCheck size={20} color={'#FED7B8'} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.shiftHeading}>Today's Shift: 8h 07m Worked</Text>
            <Text style={styles.shiftSub}>Checked In: 08:57 AM • Counter Punch Verified</Text>
          </View>
        </View>
        <ArrowRight size={16} color={'#FED7B8'} />
      </TouchableOpacity>

      {/* KPI Counters */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiVal}>{pendingTasks.length}</Text>
          <Text style={styles.kpiLabel}>Pending Tasks</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiVal, { color: '#94A3B8' }]}>{completedTasks.length}</Text>
          <Text style={styles.kpiLabel}>Completed Today</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiVal, { color: '#F59E0B' }]}>94%</Text>
          <Text style={styles.kpiLabel}>Shelf Health</Text>
        </View>
      </View>

      {/* Urgent Tasks Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Priority Tasks</Text>
        <TouchableOpacity onPress={onNavigateToTasks}>
          <Text style={styles.seeAllText}>Task Board ({tasks.length})</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tasksList}>
        {tasks.slice(0, 4).map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskTopRow}>
              <View style={[
                styles.priorityBadge,
                task.priority === 'CRITICAL' ? styles.priCritical :
                task.priority === 'HIGH' ? styles.priHigh : styles.priMedium
              ]}>
                <Text style={styles.priorityText}>{task.priority}</Text>
              </View>
              <Text style={styles.dueTime}>{task.due_time || 'Today 5:30 PM'}</Text>
            </View>

            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDesc} numberOfLines={2}>{task.description}</Text>

            <View style={styles.taskBottomRow}>
              <Text style={styles.taskDept}>{task.department_name}</Text>
              
              <TouchableOpacity
                style={[styles.statusToggleBtn, task.status === 'COMPLETED' ? styles.statusDone : styles.statusProgress]}
                onPress={() => {
                  const nextStatus = task.status === 'PENDING' ? 'IN_PROGRESS' : task.status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
                  onUpdateTaskStatus(task.id, nextStatus);
                }}
              >
                {task.status === 'COMPLETED' ? (
                  <>
                    <CheckCircle2 size={12} color="#1A6FA8" />
                    <Text style={styles.statusDoneText}>COMPLETED</Text>
                  </>
                ) : (
                  <>
                    <PlayCircle size={12} color={'#FED7B8'} />
                    <Text style={styles.statusProgressText}>{task.status}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Department Section Shortcut */}
      <TouchableOpacity style={styles.deptShortcutCard} onPress={onNavigateToDepartment} activeOpacity={0.85}>
        <Layers size={22} color="#3B82F6" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.deptShortcutTitle}>Grocery & Staples Section</Text>
          <Text style={styles.deptShortcutSub}>Aisle 1 & 2 • 48 Products • 4 Associates on Floor</Text>
        </View>
        <ArrowRight size={16} color="#3B82F6" />
      </TouchableOpacity>

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
    paddingBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.98)',
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#F1F5F9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FED7B8',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  staffName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0A1628',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  greenDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#94A3B8',
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  empId: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#FED7B8',
    marginTop: 2,
  },
  deptText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  shiftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1628',
    borderColor: 'rgba(1, 72, 114, 0.18)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  shiftCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shiftHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  shiftSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(235, 214, 220, 0.90)',
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#8C386A',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#674D66',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EBD6DC',
  },
  tasksList: {
    gap: 10,
    marginBottom: 14,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priCritical: { backgroundColor: '#FEE2E2' },
  priHigh: { backgroundColor: '#FEF3C7' },
  priMedium: { backgroundColor: '#EDE9FE' },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#991B1B',
  },
  dueTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#674D66',
  },
  taskTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#2B152A',
    marginBottom: 2,
  },
  taskDesc: {
    fontSize: 11,
    color: '#674D66',
    lineHeight: 15,
    marginBottom: 8,
  },
  taskBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  taskDept: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#475569',
  },
  statusToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusProgress: {
    backgroundColor: '#0A1628',
  },
  statusProgressText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FED7B8',
  },
  statusDone: {
    backgroundColor: '#0A1628',
  },
  statusDoneText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  deptShortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  deptShortcutTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
  },
  deptShortcutSub: {
    fontSize: 10,
    color: '#3B82F6',
    marginTop: 2,
  }
});
