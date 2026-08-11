import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { INITIAL_PROBLEMS } from '../data';
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

const FILTERS = ['All', 'Easy', 'Medium', 'Hard'];

function ProblemCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => onPress(item)}>
      <View style={styles.cardTop}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.diffBadge, { borderColor: DIFFICULTY_COLORS[item.difficulty] }]}>
            <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[item.difficulty] }]}>
              {item.difficulty}
            </Text>
          </View>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.metaChip}>#{item.topic}</Text>
          <Text style={styles.metaChip}>🏢 {item.company}</Text>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.confidenceLabel}>Confidence</Text>
        <ConfidenceDots score={item.confidence} size={12} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProblemsScreen({ navigation }) {
  const [problems, setProblems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  const loadProblems = async () => {
    try {
      const stored = await AsyncStorage.getItem('problems');
      if (stored) {
        setProblems(JSON.parse(stored));
      } else {
        await AsyncStorage.setItem('problems', JSON.stringify(INITIAL_PROBLEMS));
        setProblems(INITIAL_PROBLEMS);
      }
    } catch (e) {
      setProblems(INITIAL_PROBLEMS);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProblems();
    }, [])
  );

  const filtered = problems.filter((p) => {
    const matchesDiff = activeFilter === 'All' || p.difficulty === activeFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'confidence_asc') return a.confidence - b.confidence;
    if (sortBy === 'confidence_desc') return b.confidence - a.confidence;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'difficulty') {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      return order[a.difficulty] - order[b.difficulty];
    }
    return 0;
  });

  const handleSortPress = () => {
    Alert.alert('Sort Problems', 'Choose sort order', [
      { text: 'Default', onPress: () => setSortBy('default') },
      { text: 'Confidence: Low → High', onPress: () => setSortBy('confidence_asc') },
      { text: 'Confidence: High → Low', onPress: () => setSortBy('confidence_desc') },
      { text: 'Title (A → Z)', onPress: () => setSortBy('title') },
      { text: 'Difficulty', onPress: () => setSortBy('difficulty') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const solved = problems.filter((p) => p.status === 'Solved').length;
  const attempted = problems.filter((p) => p.status === 'Attempted').length;
  const notStarted = problems.filter((p) => p.status === 'Not Started').length;
  const avgConf = problems.length
    ? (problems.reduce((a, p) => a + p.confidence, 0) / problems.length).toFixed(1)
    : '0.0';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Splash')} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Problem Bank</Text>
          <Text style={styles.headerSub}>{sorted.length} problems</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => { setSearchVisible(!searchVisible); setSearchQuery(''); }}
          >
            <Text style={styles.iconBtnText}>{searchVisible ? '✕' : '🔍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Stats')}>
            <Text style={styles.iconBtnText}>📊</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, topic, or company..."
            placeholderTextColor="#444"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{solved}</Text>
          <Text style={styles.statLabel}>Solved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#f0a500' }]}>{attempted}</Text>
          <Text style={styles.statLabel}>Attempted</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#ff4d4d' }]}>{notStarted}</Text>
          <Text style={styles.statLabel}>To Do</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#00bfff' }]}>{avgConf}</Text>
          <Text style={styles.statLabel}>Avg Conf.</Text>
        </View>
      </View>

      {/* Filters + Sort */}
      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.sortBtn} onPress={handleSortPress}>
          <Text style={styles.sortBtnText}>↕</Text>
        </TouchableOpacity>
      </View>

      {/* Empty state */}
      {sorted.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>No problems found</Text>
          <Text style={styles.emptySubText}>Try a different search or filter</Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProblemCard
            item={item}
            onPress={(p) => navigation.navigate('ProblemDetail', { problem: p })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('LogProblem')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+ LOG</Text>
      </TouchableOpacity>
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
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  backText: { color: '#4ECCA3', fontSize: 22, fontFamily: 'monospace' },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: '#444', fontSize: 12, fontFamily: 'monospace' },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    borderWidth: 1,
    borderColor: '#1e3a1e',
    backgroundColor: '#0d1a0d',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  iconBtnText: { fontSize: 14 },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: '#111',
    borderWidth: 1.5,
    borderColor: '#4ECCA3',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#e0e0e0',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#111',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#4ECCA3', fontSize: 20, fontWeight: '800', fontFamily: 'monospace' },
  statLabel: { color: '#444', fontSize: 10, fontFamily: 'monospace', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#1e1e1e' },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  filterPill: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#111',
  },
  filterPillActive: { borderColor: '#4ECCA3', backgroundColor: '#0d1f0d' },
  filterText: { color: '#555', fontSize: 12, fontFamily: 'monospace' },
  filterTextActive: { color: '#4ECCA3' },
  sortBtn: {
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#1e3a1e',
    backgroundColor: '#0d1a0d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sortBtnText: { color: '#4ECCA3', fontSize: 14, fontFamily: 'monospace' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  cardTop: { marginBottom: 10 },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: { color: '#e0e0e0', fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
  diffBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  diffText: { fontSize: 10, fontFamily: 'monospace', fontWeight: '700' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  metaChip: {
    color: '#888',
    fontSize: 11,
    fontFamily: 'monospace',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: 'monospace' },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    paddingTop: 10,
  },
  confidenceLabel: { color: '#888', fontSize: 11, fontFamily: 'monospace' },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: '#e0e0e0', fontSize: 16, fontWeight: '700' },
  emptySubText: { color: '#555', fontSize: 13, marginTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    backgroundColor: '#4ECCA3',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#4ECCA3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: '#0a0a0a',
    fontWeight: '800',
    fontFamily: 'monospace',
    fontSize: 13,
    letterSpacing: 1,
  },
});
