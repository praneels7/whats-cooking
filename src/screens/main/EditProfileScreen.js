import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useApp } from '../../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useApp();
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    updateProfile({ username: username.trim(), email: email.trim() });
    Alert.alert('Saved', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
              <View style={styles.cameraOverlay}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.username}>{username || 'User'}</Text>
          </View>

          <View style={styles.form}>
            <Input placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
            <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
            <Input placeholder="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.input} />
            <Input placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
          </View>

          <Button title="Save Changes" onPress={handleSave} style={styles.btn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 28, paddingBottom: 40 },
  backBtn: { marginTop: 8, marginBottom: 4 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.heading, textAlign: 'center', marginBottom: 24 },
  profileSection: { alignItems: 'center', marginBottom: 28 },
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#CCC', alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 44 },
  cameraOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.background,
  },
  cameraIcon: { fontSize: 14 },
  username: { fontSize: 16, fontWeight: '700', color: COLORS.heading },
  form: {},
  input: { marginBottom: 12 },
  btn: { marginTop: 8 },
});
