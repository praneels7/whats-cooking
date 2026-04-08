import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors as COLORS } from '../src/constants/colors';
import { useRouter } from 'expo-router';

const MENU_ITEMS = [
  'Change Height/Weight',
  'Change Fitness Goal',
  'Change Activity Level',
  'Change Biggest Challenge',
];

export default function SettingsScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [displayUsername, setDisplayUsername] = useState('User');
  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('email@example.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await AsyncStorage.getItem('mockUserAccount');
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.username) {
            setDisplayUsername(parsed.username);
            setUsername(parsed.username);
          }
          if (parsed.email) {
            setEmail(parsed.email);
          }
        }
      } catch (e) {}
    }
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      const storedAccount = await AsyncStorage.getItem('mockUserAccount');
      let accountObj = storedAccount ? JSON.parse(storedAccount) : {};
      
      accountObj.username = username;
      accountObj.email = email;
      if (newPassword) {
        accountObj.password = newPassword;
      }
      
      await AsyncStorage.setItem('mockUserAccount', JSON.stringify(accountObj));
      
      setDisplayUsername(username);
      setNewPassword('');
      setConfirmPassword('');
      
      setIsEditing(false);
      Alert.alert('Saved', 'Your profile has been successfully updated!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }
    router.replace('/dashboard');
  };

  const openMenu = (label) => {
    if (label === 'Change Height/Weight') {
      router.push('/height-weight?fromSettings=true');
    } else if (label === 'Change Fitness Goal') {
      router.push('/main-goal?fromSettings=true');
    } else if (label === 'Change Activity Level') {
      router.push('/activity-level?fromSettings=true');
    } else if (label === 'Change Biggest Challenge') {
      router.push('/struggles?fromSettings=true');
    } else {
      Alert.alert(label, 'This screen will be available in a future update.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.headerSide}>
          <Ionicons name="arrow-back" size={26} color={COLORS.textDark} />
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
            <Ionicons name="person" size={48} color={COLORS.white} />
            <View style={styles.camBadge}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </View>
          </View>
          {!isEditing ? (
            <Text style={styles.profileName}>{displayUsername}</Text>
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
                  color={COLORS.textMuted}
                />
              </Pressable>
            ))}

            <View style={styles.toggleCard}>
              <Text style={styles.menuText}>Notification</Text>
              <Switch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                trackColor={{ false: '#555', true: COLORS.accent }}
                thumbColor={COLORS.white}
                ios_backgroundColor="#444"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.resetBtn,
                pressed && styles.resetPressed,
              ]}
              onPress={() => router.push('/main-goal?fromReset=true')}
            >
              <Text style={styles.resetText}>Reset Goals</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.amberBtn,
                pressed && styles.amberPressed,
              ]}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.amberBtnText}>Logout</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.amberBtn,
                pressed && styles.amberPressed,
              ]}
              onPress={async () => {
                if (Platform.OS === 'web') {
                  const confirmDelete = window.confirm('Are you sure you want to permanently delete your account?');
                  if (confirmDelete) {
                    await AsyncStorage.removeItem('mockUserAccount');
                    router.replace('/signup');
                  }
                } else {
                  Alert.alert(
                    'Delete Account',
                    'Are you sure you want to permanently delete your account?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Delete', 
                        style: 'destructive',
                        onPress: async () => {
                          await AsyncStorage.removeItem('mockUserAccount');
                          router.replace('/signup');
                        }
                      }
                    ]
                  );
                }
              }}
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
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
              />
            </View>
            <View style={styles.field}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
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
                placeholderTextColor={COLORS.textMuted}
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
                  color={COLORS.white}
                />
              </Pressable>
            </View>
            <View style={styles.field}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor={COLORS.textMuted}
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
                  color={COLORS.white}
                />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.amberBtn,
                pressed && styles.amberPressed,
                { marginTop: 8 },
              ]}
              onPress={handleSaveProfile}
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
    backgroundColor: COLORS.background,
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
    color: COLORS.textDark,
  },
  editLink: {
    color: COLORS.accent,
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
    backgroundColor: COLORS.avatarPlaceholder,
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
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  profileName: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  profileNameSmall: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    opacity: 0.85,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: COLORS.radiusMd,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  menuCardPressed: {
    opacity: 0.92,
  },
  menuText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: COLORS.radiusMd,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: COLORS.white,
    borderRadius: COLORS.radiusMd,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.textDark,
  },
  resetPressed: {
    opacity: 0.9,
  },
  resetText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '700',
  },
  amberBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: COLORS.radiusMd,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  amberPressed: {
    opacity: 0.92,
  },
  amberBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  field: {
    backgroundColor: COLORS.card,
    borderRadius: COLORS.radiusMd,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  eyeBtn: {
    padding: 10,
  },
});
