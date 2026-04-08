import { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import OptionCard from '../src/components/OptionCard';
import { colors as COLORS } from '../src/constants/colors';
import { STRUGGLE_OPTIONS } from '../src/constants/appConfig';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StrugglesScreen() {
  const router = useRouter();
  const { fromSettings, fromReset } = useLocalSearchParams();
  const isEditing = fromSettings === 'true';
  const isResetting = fromReset === 'true';
  const [selectedId, setSelectedId] = useState('cravings');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const existing = await AsyncStorage.getItem('mockUserAccount');
        if (existing) {
          const account = JSON.parse(existing);
          if (account.struggles) {
            setSelectedId(account.struggles);
          }
        }
      } catch(e) {}
      setIsLoaded(true);
    }
    loadData();
  }, []);

  if (!isLoaded) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (isEditing) {
                router.replace('/settings');
              } else {
                router.canGoBack() ? router.back() : router.replace(isResetting ? '/activity-level?fromReset=true' : '/activity-level');
              }
            }}
            hitSlop={12}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={26} color={COLORS.textDark} />
          </Pressable>
          <Text style={styles.title}>Struggles</Text>
          <View style={styles.backPlaceholder} />
        </View>

        <Text style={styles.sub}>
          What's your biggest challenge in fitness?
        </Text>

        {STRUGGLE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.id}
            label={opt.label}
            selected={selectedId === opt.id}
            onPress={() => setSelectedId(opt.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={async () => {
             try {
               const existing = await AsyncStorage.getItem('mockUserAccount');
               const account = existing ? JSON.parse(existing) : {};
               account.struggles = selectedId;
               await AsyncStorage.setItem('mockUserAccount', JSON.stringify(account));
             } catch (e) {}

             if (isEditing) {
               router.canGoBack() ? router.back() : router.replace('/settings');
             } else if (isResetting) {
               router.push('/settings');
             } else {
               router.push('/dashboard');
             }
          }}
        >
          <Text style={styles.ctaText}>{isEditing || isResetting ? 'Done' : "Let's Go!"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  sub: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '500',
    marginBottom: 20,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  cta: {
    backgroundColor: COLORS.accent,
    borderRadius: COLORS.radiusMd,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textDark,
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
