import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function OptionCard({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>{label}</Text>
      {selected && (
        <View style={styles.checkCircle}>
          <Text style={styles.check}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function OptionCard({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      {selected ? (
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={18} color={colors.white} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.dark,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    paddingRight: 8,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: colors.card,
    borderRadius: colors.radiusMd,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 36,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
});
