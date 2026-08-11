import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, Alert, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfidenceDots from '../components/ConfidenceDots';

const DIFFICULTY_COLORS = {
  Easy: '#4ECCA3',
  Medium: '#f0a500',
  Hard: '#ff4d4d',
};

const STATUS_COLORS = {
  Solved: '#4ECCA3',
  Attempted: '#f0a500',
  'Not Started': '#555',
};

export default function ProblemDetailScreen({ route, navigation }) {
  const { problem: initialProblem } = route.params;
  const [problem, setProblem] = useState(initialProblem);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState(initialProblem.notes || '');

  const saveNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('problems');
      const problems = stored ? JSON.parse(stored) : [];
      const updated = problems.map((p) =>
        p.id === problem.id ? { ...p, notes: notesInput.trim() } : p
      );
      await AsyncStorage.setItem('problems', JSON.stringify(updated));
      setProblem((prev) => ({ ...prev, notes: notesInput.trim() }));
      setEditingNotes(false);
    } catch (e) {
      Alert.alert('Error', 'Could not save notes.');
    }
  };

  const updateConfidence = async (newScore) => {
    try {
      const stored = await AsyncStorage.getItem('problems');
      const problems = stored ? JSON.parse(stored) : [];
      const updated = problems.map((p) =>
        p.id === problem.id ? { ...p, confidence: newScore } : p
      );
      await AsyncStorage.setItem('problems', JSON.stringify(updated));
      setProblem((prev) => ({ ...prev, confidence: newScore }));
    } catch (e) {
      Alert.alert('Error', 'Could not update confidence.');
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const stored = await AsyncStorage.getItem('problems');
      const problems = stored ? JSON.parse(stored) : [];
      const updated = problems.map((p) =>
        p.id === problem.id ? { ...p, status: newStatus } : p
      );
      await AsyncStorage.setItem('problems', JSON.stringify(updated));
      setProblem((prev) => ({ ...prev, status: newStatus }));
    } catch (e) {
      Alert.alert('Error', 'Could not update status.');
    }
  };

  const deleteProblem = () => {
    Alert.alert(
      'Delete Problem',
      `Are you sure you want to delete "${problem.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {              const stored = await AsyncStorage.getItem('problems');
              const problems = stored ? JSON.parse(stored) : [];
              const updated = problems.filter((p) => p.id !== problem.id);
              await AsyncStorage.setItem('problems', JSON.stringify(updated));
              navigation.goBack();
            } catch (e) {
              Alert.alert('Error', 'Could not delete problem.');
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = () => {
    Alert.alert('Update Status', 'Choose new status', [
      { text: 'Solved', onPress: () => updateStatus('Solved') },
      { text: 'Attempted', onPress: () => updateStatus('Attempted') },
      { text: 'Not Started', onPress: () => updateStatus('Not Started') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const CONFIDENCE_LABELS = {
    0: 'Not rated',
    1: 'Barely understand it',
    2: 'Got the concept, shaky on impl',
    3: 'Could solve with hints',
    4: 'Can solve independently',
    5: 'Could explain to anyone ✓',
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Problem Detail</Text>
        <TouchableOpacity onPress={deleteProblem} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Title + badges */}
        <Text style={styles.problemTitle}>{problem.title}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.diffBadge, { borderColor: DIFFICULTY_COLORS[problem.difficulty] }]}>
            <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[problem.difficulty] }]}>
              {problem.difficulty}
            </Text>
          </View>
          <View style={styles.topicBadge}>
            <Text style={styles.topicText}>#{problem.topic}</Text>
          </View>
          <View style={styles.companyBadge}>
            <Text style={styles.companyText}>🏢 {problem.company}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STATUS</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusIndicator, { backgroundColor: STATUS_COLORS[problem.status] }]} />
            <Text style={[styles.statusText, { color: STATUS_COLORS[problem.status] }]}>
              {problem.status}
            </Text>
            <TouchableOpacity style={styles.changeBtn} onPress={handleStatusChange}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confidence */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CONFIDENCE RATING</Text>
          <View style={styles.confidenceDotsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.confBtn, problem.confidence >= n && styles.confBtnActive]}
                onPress={() => updateConfidence(n)}
              >
                <Text style={[styles.confBtnText, problem.confidence >= n && styles.confBtnTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.confidenceHint}>{CONFIDENCE_LABELS[problem.confidence]}</Text>
        </View>

        {/* Attempts */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ATTEMPTS</Text>
          <View style={styles.attemptsRow}>
            {[...Array(Math.max(problem.attempts, 1))].map((_, i) => (
              <View key={i} style={[styles.attemptDot, i < problem.attempts && styles.attemptDotFilled]} />
            ))}
            <Text style={styles.attemptsText}>{problem.attempts} attempt{problem.attempts !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionLabel}>NOTES / KEY INSIGHT</Text>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                if (editingNotes) {
                  saveNotes();
                } else {
                  setEditingNotes(true);
                }
              }}
            >
              <Text style={styles.editBtnText}>{editingNotes ? '✓ Save' : '✎ Edit'}</Text>
            </TouchableOpacity>
          </View>
          {editingNotes ? (
            <TextInput
              style={styles.notesInput}
              value={notesInput}
              onChangeText={setNotesInput}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Add your key insight, time complexity, what tripped you up..."
              placeholderTextColor="#444"
              autoFocus
            />
          ) : (
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>
                {problem.notes || 'No notes yet. Tap ✎ Edit to add your key insight.'}
              </Text>
            </View>
          )}
        </View>

        {/* Date added */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATE ADDED</Text>
          <Text style={styles.dateText}>{problem.dateAdded}</Text>
        </View>

        {/* Log new attempt button */}
        <TouchableOpacity
          style={styles.logAttemptBtn}
          onPress={() => navigation.navigate('LogProblem')}
          activeOpacity={0.85}
        >
          <Text style={styles.logAttemptText}>+ LOG NEW ATTEMPT</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  backBtn: { padding: 4, width: 40 },
  backText: { color: '#4ECCA3', fontSize: 22, fontFamily: 'monospace' },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800', flex: 1, textAlign: 'center' },
  deleteBtn: { width: 40, alignItems: 'flex-end' },
  deleteBtnText: { fontSize: 18, color: '#ff4d4d' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  problemTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 30,
  },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  diffBadge: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  diffText: { fontSize: 12, fontFamily: 'monospace', fontWeight: '700' },
  topicBadge: { backgroundColor: '#1a1a1a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  topicText: { color: '#4ECCA3', fontSize: 12, fontFamily: 'monospace' },
  companyBadge: { backgroundColor: '#1a1a1a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  companyText: { color: '#888', fontSize: 12, fontFamily: 'monospace' },
  section: { marginBottom: 24 },
  sectionLabel: {
    color: '#888',
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 10,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 15, fontWeight: '700', fontFamily: 'monospace', flex: 1 },
  changeBtn: {
    borderWidth: 1,
    borderColor: '#1e3a1e',
    backgroundColor: '#0d1a0d',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  changeBtnText: { color: '#4ECCA3', fontSize: 12, fontFamily: 'monospace' },
  confidenceDotsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  confBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confBtnActive: { borderColor: '#4ECCA3', backgroundColor: '#0d1f0d' },
  confBtnText: { color: '#444', fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
  confBtnTextActive: { color: '#4ECCA3' },
  confidenceHint: { color: '#555', fontSize: 11, fontFamily: 'monospace', textAlign: 'center' },
  attemptsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  attemptDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a',
  },
  attemptDotFilled: { backgroundColor: '#4ECCA3', borderColor: '#4ECCA3' },
  attemptsText: { color: '#888', fontSize: 13, fontFamily: 'monospace', marginLeft: 6 },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  editBtn: {
    borderWidth: 1,
    borderColor: '#1e3a1e',
    backgroundColor: '#0d1a0d',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editBtnText: { color: '#4ECCA3', fontSize: 12, fontFamily: 'monospace' },
  notesInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1.5,
    borderColor: '#4ECCA3',
    borderRadius: 8,
    padding: 14,
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 22,
    minHeight: 120,
  },
  notesBox: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 8,
    padding: 14,
  },
  notesText: { color: '#cccccc', fontSize: 14, lineHeight: 22 },
  dateText: { color: '#888', fontSize: 13, fontFamily: 'monospace' },
  logAttemptBtn: {
    backgroundColor: '#4ECCA3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#4ECCA3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logAttemptText: {
    color: '#0a0a0a',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});
