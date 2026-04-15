import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as COLORS } from '../src/constants/colors';
import { ChefHat, Utensils } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    
    try {
      // 1. Check if the user has an AsyncStorage account they created
      const storedAccount = await AsyncStorage.getItem('mockUserAccount');
      if (storedAccount !== null) {
        const account = JSON.parse(storedAccount);
        if (email.trim().toLowerCase() === account.email.trim().toLowerCase() && password === account.password) {
          router.replace('/dashboard');
          return;
        }
      }

      // 2. Fall back check removed - users must create an account via Signup
      setError('Incorrect email/password or account not found');
    } catch (e) {
      setError('Login error. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoSection}>
        <View style={styles.logoCircle}>
          <ChefHat size={40} color="#4a2916" strokeWidth={2} style={styles.chefIcon} />
          <Text style={styles.logoText}>What&apos;s</Text>
          <Text style={styles.logoText}>Cooking</Text>
          <Utensils size={24} color="#4a2916" style={styles.utensilsIcon} />
        </View>
      </View>

      <View style={styles.formContainer}>
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor="rgba(0,0,0,0.35)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="rgba(0,0,0,0.35)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.createAccountBtn} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchAuthMode}>
        <Text style={styles.switchText}>Don&apos;t have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.linkBtn}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Export styles so we can reuse them safely in signup.jsx
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  logoSection: {
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    backgroundColor: '#ffe654',
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  chefIcon: {
    marginBottom: -4,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a2916',
    textAlign: 'center',
  },
  utensilsIcon: {
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    maxWidth: 340,
    gap: 20,
  },
  input: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#3b2a47',
    backgroundColor: COLORS.white,
    borderColor: 'rgba(0,0,0,0.12)',
    borderWidth: 1,
    borderRadius: 50,
    shadowColor: COLORS.card,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  createAccountBtn: {
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 15,
    backgroundColor: '#e08b1a',
    borderColor: '#433a5b',
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: COLORS.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#bf2424',
    backgroundColor: '#ffd8d8',
    borderColor: '#eba5a5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    marginTop: -10,
    marginBottom: 0,
    overflow: 'hidden',
  },
  switchAuthMode: {
    marginTop: 40,
    alignItems: 'center',
  },
  switchText: {
    color: COLORS.textDark,
    fontSize: 15,
    marginBottom: 8,
  },
  linkBtn: {
    color: '#b54f02',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
