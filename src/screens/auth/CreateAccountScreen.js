import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useApp } from '../../context/AppContext';

export default function CreateAccountScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { createAccount } = useApp();

  const handleCreate = () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    createAccount(username.trim(), email.trim(), password);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Small Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>{'What\'s'}</Text>
              <Text style={styles.logoText}>Cooking</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Input placeholder="USERNAME" value={username} onChangeText={setUsername} style={styles.input} />
            <Input placeholder="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
            <Input placeholder="PASSWORD" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <Button title="Create Account" onPress={handleCreate} style={styles.btn} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingHorizontal: 32, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5D060',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.heading,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  form: { width: '100%' },
  input: { marginBottom: 14 },
  btn: { marginTop: 6 },
});
