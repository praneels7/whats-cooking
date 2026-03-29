import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function Input({ placeholder, value, onChangeText, secureTextEntry, keyboardType, style }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.7)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
          <Text style={styles.eye}>{showPassword ? '👁' : '👁‍🗨'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 54,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  eyeBtn: {
    padding: 4,
  },
  eye: {
    fontSize: 18,
  },
});
