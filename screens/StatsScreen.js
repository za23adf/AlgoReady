import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function StatsScreen({ navigation }) {
  const [problems, setProblems] = useState([]);

  const loadProblems = async () => {
    try {
      const stored = await AsyncStorage.getItem('problems');
      if (stored) setProblems(JSON.parse(stored));
    } catch (e) {}
  };

  useFocusEffect(useCallback(() => { loadProblems(); }, []));

  const resetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your problems and start fresh. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('problems');
              setProblems([]);
              Alert.alert('Done', 'All data has been cleared.');
            } catch (e) {
              Alert.alert('Error', 'Could not reset data.');
            }
          },
        },
      ]
    );
  };

  if (problems.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyText}>No data yet. Log some problems first!</Text>
        <TouchableOpacity style={styles.backBtn2} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const solved = problems.filter((p) => p.status === 'Solved').length;
  const attempted = problems.filter((p) => p.status === 'Attempted').length;
  const notStarted = problems.filter((p) => p.status === 'Not Started').length;
  const avgConf = (problems.reduce((a, p) => a + p.confidence, 0) / problems.length).toFixed(1);
  const totalAttempts = problems.reduce((a, p) => a + p.attempts, 0);

  // Topic breakdown
  const topicMap = {};
  problems.forEach((p) => {
    if (!topicMap[p.topic]) topicMap[p.topic] = { solved: 0, total: 0, confTotal: 0 };
    topicMap[p.topic].total += 1;
    topicMap[p.topic].confTotal += p.confidence;
    if (p.status === 'Solved') topicMap[p.topic].solved += 1;
  });

  const topics = Object.entries(topicMap)
    .map(([name, data]) => ({
      name,
      total: data.total,
      solved: data.solved,
      avgConf: (data.confTotal / data.total).toFixed(1),
    }))
    .sort((a, b) => parseFloat(a.avgConf) - parseFloat(b.avgConf));

  // Difficulty breakdown
  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const medCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;

  // Company breakdown
  const companyMap = {};
  problems.forEach((p) => {
    companyMap[p.company] = (companyMap[p.company] || 0) + 1;
  });
  const companies = Object.entries(companyMap).sort((a, b) => b[1] - a[1]);

  const getConfColor = (conf) => {
    if (conf >= 4) return '#4ECCA3';
    if (conf >= 3) return '#f0a500';
    return '#ff4d4d';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Stats</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Overview cards */}
        <Text style={styles.sectionLabel}>OVERVIEW</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNum}>{problems.length}</Text>
            <Text style={styles.overviewLbl}>Total</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={[styles.overviewNum, { color: '#4ECCA3' }]}>{solved}</Text>
            <Text style={styles.overviewLbl}>Solved</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={[styles.overviewNum, { color: '#f0a500' }]}>{attempted}</Text>
            <Text style={styles.overviewLbl}>Attempted</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={[styles.overviewNum, { color: '#ff4d4d' }]}>{notStarted}</Text>
            <Text style={styles.overviewLbl}>To Do</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={[styles.overviewNum, { color: '#00bfff' }]}>{avgConf}</Text>
            <Text style={styles.overviewLbl}>Avg Conf</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={[styles.overviewNum, { color: '#aa88ff' }]}>{totalAttempts}</Text>
            <Text style={styles.overviewLbl}>Attempts</Text>
          </View>
        </View>

        {/* Difficulty breakdown */}
        <Text style={styles.sectionLabel}>DIFFICULTY BREAKDOWN</Text>
        <View style={styles.diffRow}>
          {[
            { label: 'Easy', count: easyCount, color: '#4ECCA3' },
            { label: 'Medium', count: medCount, color: '#f0a500' },
            { label: 'Hard', count: hardCount, color: '#ff4d4d' },
          ].map((d) => (
            <View key={d.label} style={styles.diffCard}>
              <Text style={[styles.diffNum, { color: d.color }]}>{d.count}</Text>
              <Text style={styles.diffLbl}>{d.label}</Text>
              <View style={styles.diffBar}>
                <View
                  style={[
                    styles.diffBarFill,
                    {
                      width: problems.length > 0 ? `${(d.count / problems.length) * 100}%` : '0%',
                      backgroundColor: d.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Weak topics */}
        <Text style={styles.sectionLabel}>TOPIC CONFIDENCE (sorted by weakest)</Text>
        {topics.map((t) => (
          <View key={t.name} style={styles.topicRow}>
            <View style={styles.topicInfo}>
              <Text style={styles.topicName}>{t.name}</Text>
              <Text style={styles.topicSub}>{t.solved}/{t.total} solved</Text>
            </View>
            <View style={styles.topicRight}>
              <Text style={[styles.topicConf, { color: getConfColor(parseFloat(t.avgConf)) }]}>
                {t.avgConf}
              </Text>
              <View style={styles.confBar}>
                <View
                  style={[
                    styles.confBarFill,
                    {
                      width: `${(parseFloat(t.avgConf) / 5) * 100}%`,
                      backgroundColor: getConfColor(parseFloat(t.avgConf)),
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}

        {/* Company breakdown */}
        <Text style={styles.sectionLabel}>BY COMPANY</Text>
        <View style={styles.companyGrid}>
          {companies.map(([name, count]) => (
            <View key={name} style={styles.companyChip}>
              <Text style={styles.companyName}>{name}</Text>
              <Text style={styles.companyCount}>{count}</Text>
            </View>
          ))}
        </View>

        {/* Weakest topic alert */}
        {topics.length > 0 && parseFloat(topics[0].avgConf) < 3 && (
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>⚠ Focus Area</Text>
            <Text style={styles.alertText}>
              Your weakest topic is <Text style={{ color: '#ff4d4d', fontWeight: '700' }}>{topics[0].name}</Text> with
              an average confidence of {topics[0].avgConf}/5. Consider reviewing this before your next interview.
            </Text>
          </View>
        )}

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
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
 
  sectionLabel: {
    color: '#888',
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  overviewCard: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    width: '30%',
  },
  overviewNum: { color: '#4ECCA3', fontSize: 24, fontWeight: '800', fontFamily: 'monospace' },
  overviewLbl: { color: '#888', fontSize: 10, fontFamily: 'monospace', marginTop: 2 },
  diffRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  diffCard: {
    flex: 1,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  diffNum: { fontSize: 22, fontWeight: '800', fontFamily: 'monospace' },
  diffLbl: { color: '#888', fontSize: 10, fontFamily: 'monospace', marginTop: 2, marginBottom: 8 },
  diffBar: { width: '100%', height: 4, backgroundColor: '#1a1a1a', borderRadius: 2 },
  diffBarFill: { height: 4, borderRadius: 2 },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  topicInfo: { flex: 1 },
  topicName: { color: '#e0e0e0', fontSize: 13, fontWeight: '700' },
  topicSub: { color: '#888', fontSize: 11, fontFamily: 'monospace', marginTop: 2 },
  topicRight: { alignItems: 'flex-end', gap: 4 },
  topicConf: { fontSize: 16, fontWeight: '800', fontFamily: 'monospace' },
  confBar: { width: 60, height: 4, backgroundColor: '#1a1a1a', borderRadius: 2 },
  confBarFill: { height: 4, borderRadius: 2 },
  companyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  companyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  companyName: { color: '#e0e0e0', fontSize: 12, fontFamily: 'monospace' },
  companyCount: {
    color: '#4ECCA3',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
    backgroundColor: '#0d1f0d',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  alertBox: {
    backgroundColor: '#1a0d0d',
    borderWidth: 1,
    borderColor: '#ff4d4d',
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
  },
  alertTitle: { color: '#ff4d4d', fontSize: 13, fontWeight: '800', fontFamily: 'monospace', marginBottom: 6 },
  alertText: { color: '#cccccc', fontSize: 13, lineHeight: 20 },
  emptyText: { color: '#888', fontSize: 14, fontFamily: 'monospace', marginBottom: 20 },
  backBtn2: { borderWidth: 1, borderColor: '#4ECCA3', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});
