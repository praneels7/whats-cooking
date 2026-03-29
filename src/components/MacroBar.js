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
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function MacroBar({ label, current, target }) {
  const filled = Math.max(current, 0.0001);
  const empty = Math.max(target - current, 0);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label} - {current}/{target}g
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { flex: filled }]} />
        <View style={{ flex: empty }} />
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
  wrap: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '500',
  },
  track: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
});
