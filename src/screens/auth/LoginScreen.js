import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useApp } from '../../context/AppContext';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter your username and password.');
      return;
    }
    login(username.trim(), password);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>{'What\'s'}</Text>
              <Text style={styles.logoText}>Cooking</Text>
              <Text style={styles.logoIcon}>🍴</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              placeholder="USERNAME"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
            <Input
              placeholder="PASSWORD"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Password reset functionality coming soon.')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            <Button title="Log In" onPress={handleLogin} style={styles.btn} />
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')} style={styles.createLink}>
              <Text style={styles.createText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingHorizontal: 32, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logoCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F5D060',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.heading,
    fontStyle: 'italic',
    lineHeight: 30,
  },
  logoIcon: { fontSize: 24, marginTop: 4 },
  form: { width: '100%' },
  input: { marginBottom: 14 },
  forgotText: {
    color: COLORS.heading,
    fontSize: 13,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20,
    marginTop: 4,
  },
  btn: { marginBottom: 20 },
  createLink: { alignItems: 'center' },
  createText: {
    color: COLORS.heading,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
