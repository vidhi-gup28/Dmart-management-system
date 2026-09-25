import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { StaffTask } from '../../types';
import { CheckSquare, CheckCircle2, PlayCircle, Clock, AlertTriangle, Plus } from 'lucide-react-native';

interface StaffTasksScreenProps {
  tasks: StaffTask[];
  onUpdateStatus: (taskId: number, status: string) => void;
}

export const StaffTasksScreen: React.FC<StaffTasksScreenProps> = ({ tasks, onUpdateStatus }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const filtered = tasks.filter(t => filter === 'ALL' || t.status === filter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headingTitle}>Staff Task Board</Text>
          <Text style={styles.headingSub}>Supermarket floor operations & shelf restocking</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabPill, filter === tab && styles.tabPillActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <View style={styles.taskList}>
        {filtered.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.cardTop}>
              <View style={[
                styles.priBadge,
                task.priority === 'CRITICAL' ? styles.priCritical :
                task.priority === 'HIGH' ? styles.priHigh : styles.priMedium
              ]}>
                <Text style={styles.priText}>{task.priority} PRIORITY</Text>
              </View>
              <Text style={styles.dueText}>Due: {task.due_time || 'Today 5:00 PM'}</Text>
            </View>

            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDesc}>{task.description}</Text>

            <View style={styles.cardBottom}>
              <Text style={styles.deptTag}>{task.department_name}</Text>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  task.status === 'COMPLETED' ? styles.statusDone :
                  task.status === 'IN_PROGRESS' ? styles.statusActive : styles.statusPending
                ]}
                onPress={() => {
                  const next = task.status === 'PENDING' ? 'IN_PROGRESS' : task.status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
                  onUpdateStatus(task.id, next);
                }}
              >
                {task.status === 'COMPLETED' ? (
                  <>
                    <CheckCircle2 size={12} color="#1A6FA8" />
                    <Text style={styles.statusDoneText}>COMPLETED</Text>
                  </>
                ) : task.status === 'IN_PROGRESS' ? (
                  <>
                    <PlayCircle size={12} color={'#FED7B8'} />
                    <Text style={styles.statusActiveText}>IN PROGRESS</Text>
                  </>
                ) : (
                  <>
                    <Clock size={12} color="#94A3B8" />
                    <Text style={styles.statusPendingText}>START TASK</Text>
                  </>
                )}
              </TouchableOpacity>
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
  headerRow: {
    marginBottom: 12,
  },
  headingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  headingSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  tabPillActive: {
    backgroundColor: '#FED7B8',
    borderColor: '#FED7B8',
  },
  tabText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  taskList: {
    gap: 10,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(235, 214, 220, 0.90)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#2B152A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priCritical: { backgroundColor: '#FEE2E2' },
  priHigh: { backgroundColor: '#FEF3C7' },
  priMedium: { backgroundColor: '#EDE9FE' },
  priText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#991B1B',
  },
  dueText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#674D66',
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2B152A',
    marginBottom: 3,
  },
  taskDesc: {
    fontSize: 11,
    color: '#674D66',
    lineHeight: 15,
    marginBottom: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1E5EC',
    paddingTop: 8,
  },
  deptTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8C386A',
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusPending: {
    backgroundColor: '#F3F4F6',
  },
  statusPendingText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#4B5563',
  },
  statusActive: {
    backgroundColor: '#FEF3C7',
  },
  statusActiveText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
  },
  statusDone: {
    backgroundColor: '#DCFCE7',
  },
  statusDoneText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#166534',
  }
});
