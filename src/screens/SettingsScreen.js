import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { USER } from '../constants/mockData';

const MENU_ITEMS = [
  'Change Fitness Goal',
  'Change Motivation Tone',
  'Change Activity Level',
  'Manual Goal Adjustment',
];

export default function SettingsScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [username, setUsername] = useState(USER.editUsername);
  const [email, setEmail] = useState(USER.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }
    navigation.goBack();
  };

  const openMenu = (label) => {
    Alert.alert(label, 'This screen will be available in a future update.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.headerSide}>
          <Ionicons name="arrow-back" size={26} color={colors.textDark} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={[styles.headerSide, styles.headerSideEnd]}>
          {!isEditing ? (
            <Pressable onPress={() => setIsEditing(true)} hitSlop={12}>
              <Text style={styles.editLink}>Edit</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarBlock}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color={colors.white} />
            <View style={styles.camBadge}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </View>
          </View>
          {!isEditing ? (
            <Text style={styles.profileName}>{USER.settingsName}</Text>
          ) : (
            <Text style={styles.profileNameSmall}>{username}</Text>
          )}
        </View>

        {!isEditing ? (
          <>
            {MENU_ITEMS.map((label) => (
              <Pressable
                key={label}
                style={({ pressed }) => [
                  styles.menuCard,
                  pressed && styles.menuCardPressed,
                ]}
                onPress={() => openMenu(label)}
              >
                <Text style={styles.menuText}>{label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            ))}

            <View style={styles.toggleCard}>
              <Text style={styles.menuText}>Notification</Text>
              <Switch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                trackColor={{ false: '#555', true: colors.accent }}
                thumbColor={colors.white}
                ios_backgroundColor="#444"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.resetBtn,
                pressed && styles.resetPressed,
              ]}
              onPress={() => Alert.alert('Reset Goals', 'Goals reset (mock).')}
            >
              <Text style={styles.resetText}>Reset Goals</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.amberBtn,
                pressed && styles.amberPressed,
              ]}
              onPress={() => Alert.alert('Logout', 'Logged out (mock).')}
            >
              <Text style={styles.amberBtnText}>Logout</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.amberBtn,
                pressed && styles.amberPressed,
              ]}
              onPress={() =>
                Alert.alert(
                  'Delete Account',
                  'This would delete your account (mock).',
                )
              }
            >
              <Text style={styles.amberBtnText}>Delete Account</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.field}>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                secureTextEntry={!showNewPw}
              />
              <Pressable
                onPress={() => setShowNewPw((v) => !v)}
                style={styles.eyeBtn}
                hitSlop={8}
              >
                <Ionicons
                  name={showNewPw ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={colors.white}
                />
              </Pressable>
            </View>
            <View style={styles.field}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                secureTextEntry={!showConfirmPw}
              />
              <Pressable
                onPress={() => setShowConfirmPw((v) => !v)}
                style={styles.eyeBtn}
                hitSlop={8}
              >
                <Ionicons
                  name={showConfirmPw ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={colors.white}
                />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.amberBtn,
                pressed && styles.amberPressed,
                { marginTop: 8 },
              ]}
              onPress={() => {
                setIsEditing(false);
                Alert.alert('Saved', 'Profile updated (mock).');
              }}
            >
              <Text style={styles.amberBtnText}>Save Changes</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  headerSide: {
    minWidth: 56,
    alignItems: 'center',
  },
  headerSideEnd: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  editLink: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.avatarPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  profileName: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  profileNameSmall: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    opacity: 0.85,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: colors.radiusMd,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  menuCardPressed: {
    opacity: 0.92,
  },
  menuText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: colors.radiusMd,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: colors.white,
    borderRadius: colors.radiusMd,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.textDark,
  },
  resetPressed: {
    opacity: 0.9,
  },
  resetText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },
  amberBtn: {
    backgroundColor: colors.accent,
    borderRadius: colors.radiusMd,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  amberPressed: {
    opacity: 0.92,
  },
  amberBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  field: {
    backgroundColor: colors.card,
    borderRadius: colors.radiusMd,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  eyeBtn: {
    padding: 10,
  },
});
