import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors as COLORS } from '../constants/colors';

export default function Button({ title, onPress, style, textStyle, variant = 'primary' }) {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isOutline && styles.outline, style]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, isOutline && styles.outlineText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.dark,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineText: {
    color: COLORS.dark,
  },
});
