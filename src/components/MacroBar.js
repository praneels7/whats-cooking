import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function MacroBar({ label, current, goal, dark = false }) {
  const progress = goal > 0 ? Math.min(current / goal, 1) : 0;
  const textColor = dark ? COLORS.textLight : COLORS.text;
  const trackColor = dark ? '#333' : 'rgba(0,0,0,0.15)';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>
        {label} — {current}/{goal}g
      </Text>
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});
