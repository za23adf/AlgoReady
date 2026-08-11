import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Grid lines */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {[...Array(8)].map((_, i) => (
          <View key={i} style={[styles.gridLine, { left: (width / 8) * i }]} />
        ))}
      </View>

      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>v2.0</Text>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoSymbol}>{'</>'}</Text>
        </View>
        <Text style={styles.appName}>AlgoReady</Text>
        <View style={styles.taglineRow}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>INTERVIEW PREP TRACKER</Text>
          <View style={styles.taglineLine} />
        </View>
      </View>

      {/* Description */}
      <Text style={styles.descText}>
        Track every problem. Know every pattern.{'\n'}
        Walk into any interview — ready.
      </Text>

      {/* Feature chips */}
      <View style={styles.chipsRow}>
        {['DSA Topics', 'Company Tags', 'Confidence Scores', 'Mock Interviews'].map((chip) => (
          <View key={chip} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate('Problems')}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>START TRACKING →</Text>
      </TouchableOpacity>

      <Text style={styles.bottomNote}>No account needed · All data stored locally</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
  },
  gridLine: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0,255,160,0.04)',
  },
  badge: {
    position: 'absolute',
    top: 52, right: 24,
    borderWidth: 1,
    borderColor: '#00ffa0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#00ffa0',
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 72, height: 72,
    backgroundColor: '#0d1f0d',
    borderWidth: 1.5,
    borderColor: '#00ffa0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#00ffa0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoSymbol: {
    color: '#00ffa0',
    fontSize: 26,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  appName: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 10,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taglineLine: {
    height: 1, width: 28,
    backgroundColor: '#00ffa0',
    opacity: 0.5,
  },
  tagline: {
    color: '#00ffa0',
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
  descText: {
    color: '#8a8a8a',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#1e3a1e',
    backgroundColor: '#0d1a0d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    color: '#00ffa0',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  ctaButton: {
    backgroundColor: '#00ffa0',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#00ffa0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: {
    color: '#0a0a0a',
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  bottomNote: {
    color: '#3a3a3a',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
