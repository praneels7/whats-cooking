import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChefHat, Utensils } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as COLORS } from '../src/constants/colors';
import { styles } from './login';

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = async () => {
    if (!username || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields to create an account.');
      return;
    }
    
    try {
      const accountData = JSON.stringify({ username, email, password });
      // Persist the mock account info locally
      await AsyncStorage.setItem('mockUserAccount', accountData);
      router.push('/setup-plan');
    } catch (e) {
      console.error('Failed to save account', e);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.logoSection, { marginBottom: 40 }]}>
        <View style={styles.logoCircle}>
          <ChefHat size={40} color="#4a2916" strokeWidth={2} style={styles.chefIcon} />
          <Text style={styles.logoText}>What's</Text>
          <Text style={styles.logoText}>Cooking</Text>
          <Utensils size={24} color="#4a2916" style={styles.utensilsIcon} />
        </View>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="USERNAME"
          placeholderTextColor="#6d4b2e"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor="#6d4b2e"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#6d4b2e"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.createAccountBtn} onPress={handleCreateAccount} activeOpacity={0.8}>
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchAuthMode}>
        <Text style={styles.switchText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkBtn}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
