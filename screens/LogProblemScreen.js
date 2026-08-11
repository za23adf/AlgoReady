import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, TextInput, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DIFFICULTIES, TOPICS, COMPANIES, STATUSES } from '../data';

const CONFIDENCE_LABELS = {
  0: 'Tap to rate',
  1: 'Barely understand it',
  2: 'Got the concept, shaky on impl',
  3: 'Could solve with hints',
  4: 'Can solve independently',
  5: 'Could explain to anyone ✓',
};

export default function LogProblemScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !difficulty || !topic || !status) {
      Alert.alert('Missing Fields', 'Please fill in title, difficulty, topic, and status.');
      return;
    }

    const newProblem = {
      id: Date.now().toString(),
      title: title.trim(),
      difficulty,
      topic,
      company: company || 'Other',
      status,
      confidence,
      notes: notes.trim(),
      attempts: status === 'Not Started' ? 0 : 1,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    try {
      const stored = await AsyncStorage.getItem('problems');
      const problems = stored ? JSON.parse(stored) : [];
      const updated = [...problems, newProblem];
      await AsyncStorage.setItem('problems', JSON.stringify(updated));
      Alert.alert('✓ Problem Logged', `"${newProblem.title}" has been added to your tracker.`, [
        { text: 'Back to Problems', onPress: () => navigation.navigate('Problems') },
        { text: 'Log Another', onPress: () => resetForm() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Could not save problem. Please try again.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDifficulty('');
    setTopic('');
    setCompany('');
    setStatus('');
    setConfidence(0);
    setNotes('');
  };

  const DIFF_COLORS = { Easy: '#4ECCA3', Medium: '#f0a500', Hard: '#ff4d4d' };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Log Problem</Text>
          <Text style={styles.headerSub}>Add to your tracker</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PROBLEM TITLE *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Two Sum"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DIFFICULTY *</Text>
          <View style={styles.optionRow}>
            {DIFFICULTIES.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.optionPill,
                  difficulty === d && {
                    borderColor: DIFF_COLORS[d],
                    backgroundColor: d === 'Easy' ? '#0d1f0d' : d === 'Medium' ? '#1f170d' : '#1f0d0d',
                  },
                ]}
                onPress={() => setDifficulty(d)}
              >
                <Text style={[styles.optionText, difficulty === d && { color: DIFF_COLORS[d], fontWeight: '700' }]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>TOPIC / PATTERN *</Text>
          <View style={styles.gridOptions}>
            {TOPICS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.gridPill, topic === t && styles.gridPillActive]}
                onPress={() => setTopic(t)}
              >
                <Text style={[styles.gridPillText, topic === t && styles.gridPillTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>COMPANY</Text>
          <View style={styles.gridOptions}>
            {COMPANIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.gridPill, company === c && styles.gridPillActive]}
                onPress={() => setCompany(c)}
              >
                <Text style={[styles.gridPillText, company === c && styles.gridPillTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>STATUS *</Text>
          <View style={styles.optionRow}>
            {STATUSES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.optionPill, status === s && styles.optionPillActive]}
                onPress={() => setStatus(s)}
              >
                <Text style={[styles.optionText, status === s && styles.optionTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CONFIDENCE RATING</Text>
          <View style={styles.confidenceRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.confBtn, confidence >= n && styles.confBtnActive]}
                onPress={() => setConfidence(n)}
              >
                <Text style={[styles.confBtnText, confidence >= n && styles.confBtnTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.confidenceHint}>{CONFIDENCE_LABELS[confidence]}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NOTES / KEY INSIGHT</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="e.g. Use a hash map for O(n) lookup..."
            placeholderTextColor="#888"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitText}>LOG PROBLEM →</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backBtn: { padding: 4, width: 40 },
  backText: { color: '#4ECCA3', fontSize: 22, fontFamily: 'monospace' },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  headerSub: { color: '#888', fontSize: 11, fontFamily: 'monospace', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  fieldGroup: { marginBottom: 24 },
  fieldLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 10,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1.5,
    borderColor: '#4ECCA3',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'monospace',
  },
  textArea: { height: 100, paddingTop: 12 },
  optionRow: { flexDirection: 'row', gap: 10 },
  optionPill: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#3a3a3a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  optionPillActive: { borderColor: '#4ECCA3', backgroundColor: '#0d1f0d' },
  optionText: { color: '#aaaaaa', fontSize: 13, fontFamily: 'monospace' },
  optionTextActive: { color: '#4ECCA3', fontWeight: '700' },
  gridOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridPill: {
    borderWidth: 1.5,
    borderColor: '#3a3a3a',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  gridPillActive: { borderColor: '#4ECCA3', backgroundColor: '#0d1f0d' },
  gridPillText: { color: '#aaaaaa', fontSize: 12, fontFamily: 'monospace' },
  gridPillTextActive: { color: '#4ECCA3', fontWeight: '700' },
  confidenceRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  confBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#3a3a3a',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confBtnActive: { borderColor: '#4ECCA3', backgroundColor: '#0d1f0d' },
  confBtnText: { color: '#aaaaaa', fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
  confBtnTextActive: { color: '#4ECCA3' },
  confidenceHint: {
    color: '#cccccc',
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: '#4ECCA3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#4ECCA3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    color: '#0a0a0a',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
});