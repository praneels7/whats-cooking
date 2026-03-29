import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

function SettingRow({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useApp();
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: logout },
    ]);
  };

  const handleResetGoals = () => {
    Alert.alert('Reset Goals', 'Your goals have been reset.', [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('EditProfile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.username}>{user.username || 'User'}</Text>
        </View>

        {/* Settings Rows */}
        <View style={styles.settingsCard}>
          <SettingRow label="Change Fitness Goal" onPress={() => Alert.alert('Change Fitness Goal', 'Navigate to fitness goal settings.')} />
          <View style={styles.divider} />
          <SettingRow label="Change Motivation Tone" onPress={() => Alert.alert('Motivation Tone', 'Choose your motivation style.')} />
          <View style={styles.divider} />
          <SettingRow label="Change Activity Level" onPress={() => Alert.alert('Activity Level', 'Update your activity level.')} />
          <View style={styles.divider} />
          <SettingRow label="Manual Goal Adjustment" onPress={() => Alert.alert('Manual Adjustment', 'Set custom calorie and macro goals.')} />
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Notification</Text>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: '#555', true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleResetGoals}>
          <Text style={styles.resetText}>Reset Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 20 },
  editText: { fontSize: 15, color: COLORS.primary, fontWeight: '600', width: 40 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.heading },
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
  username: { fontSize: 18, fontWeight: '700', color: COLORS.heading },
  settingsCard: {
    backgroundColor: COLORS.dark,
    borderRadius: 16,
    paddingHorizontal: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, paddingHorizontal: 16,
  },
  rowLabel: { fontSize: 15, fontWeight: '500', color: COLORS.white },
  rowArrow: { fontSize: 22, color: COLORS.white, opacity: 0.5 },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginHorizontal: 16 },
  resetBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 50, paddingVertical: 16,
    alignItems: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: '#DDD',
  },
  resetText: { fontSize: 15, fontWeight: '700', color: COLORS.heading },
  logoutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50, paddingVertical: 16,
    alignItems: 'center', marginBottom: 12,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
  deleteBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 50, paddingVertical: 16,
    alignItems: 'center',
  },
  deleteText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
