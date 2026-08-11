import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ConfidenceDots({ score, size = 10 }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: i <= score ? '#4ECCA3' : '#1e1e1e',
              borderColor: i <= score ? '#4ECCA3' : '#2a2a2a',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    borderWidth: 1,
  },
});
