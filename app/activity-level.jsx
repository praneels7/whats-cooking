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
import { colors } from '../src/constants/colors';
import { ACTIVITY_OPTIONS } from '../src/constants/mockData';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ActivityLevelScreen() {
  const router = useRouter();
  const { fromSettings, fromReset } = useLocalSearchParams();
  const isEditing = fromSettings === 'true';
  const isResetting = fromReset === 'true';
  const [selectedId, setSelectedId] = useState('rarely');
  const showBack = router.canGoBack();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const existing = await AsyncStorage.getItem('mockUserAccount');
        if (existing) {
          const account = JSON.parse(existing);
          if (account.activityLevel) {
            setSelectedId(account.activityLevel);
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
          {showBack ? (
            <Pressable
              onPress={() => router.canGoBack() ? router.back() : router.replace('/main-goal')}
              hitSlop={12}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={26} color={colors.textDark} />
            </Pressable>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
          <Text style={styles.title}>Activity Level</Text>
          <View style={styles.backPlaceholder} />
        </View>

        <Text style={styles.sub}>
          How active are you on a typical week?
        </Text>

        {ACTIVITY_OPTIONS.map((opt) => (
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
               account.activityLevel = selectedId;
               await AsyncStorage.setItem('mockUserAccount', JSON.stringify(account));
             } catch (e) {}

             if (isEditing) { router.canGoBack() ? router.back() : router.replace('/settings'); }
             else if (isResetting) router.push('/struggles?fromReset=true');
             else router.push('/struggles');
          }}
        >
          <Text style={styles.ctaText}>{isEditing ? 'Done' : 'Next'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textDark,
  },
  sub: {
    fontSize: 16,
    color: colors.textDark,
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
    backgroundColor: colors.accent,
    borderRadius: colors.radiusMd,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.textDark,
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
