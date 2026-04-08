import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import MacroBar from '../src/components/MacroBar';
import FoodLogItem from '../src/components/FoodLogItem';
import { colors as COLORS } from '../src/constants/colors';
import { apiClient } from '../src/services/apiClient';
import { useApi } from '../src/hooks/useApi';
import { getDateStrip } from '../src/utils/dateUtils';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80';

const RING_SIZE = 118;
const RING_STROKE = 10;

function CalorieRing({ progress }) {
  const size = RING_SIZE;
  const strokeWidth = RING_STROKE;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const dashOffset = circumference * (1 - clamped);
  const rot = `rotate(-90 ${cx} ${cy})`;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={COLORS.ringTrack}
        strokeWidth={strokeWidth}
        fill="none"
        transform={rot}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={COLORS.accent}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={rot}
      />
    </Svg>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState({ displayName: 'Guest', avatarUrl: DEFAULT_AVATAR });

  const { data: stats, execute: fetchStats } = useApi(() => apiClient.get('/mock/stats'));
  const { data: apiFoodLog, execute: fetchApiFoodLog } = useApi(() => apiClient.get('/mock/foodLog'));
  const [localFoodLog, setLocalFoodLog] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        try {
          const uStr = await AsyncStorage.getItem('mockUserAccount');
          if (uStr) {
            const parsed = JSON.parse(uStr);
            setUser({
              displayName: parsed.username || 'Friend',
              avatarUrl: parsed.avatarUrl || DEFAULT_AVATAR
            });
          }

          // Fetch operational data
          fetchStats();
          fetchApiFoodLog();

          const fStr = await AsyncStorage.getItem('mockFoodLog');
          if (fStr) {
             const parsedLogs = JSON.parse(fStr);
             setLocalFoodLog(parsedLogs.filter(log => log.image).reverse());
          }
        } catch (e) {
          console.error('Loader error:', e);
        }
      }
      loadData();
    }, [])
  );

  const combinedFoodLog = useMemo(() => {
    return [...localFoodLog, ...(apiFoodLog || [])];
  }, [localFoodLog, apiFoodLog]);
  const insets = useSafeAreaInsets();
  const dateStrip = useMemo(() => getDateStrip(), []);
  const todayId = useMemo(() => {
    const t = dateStrip.find((d) => d.isToday);
    return t ? t.id : dateStrip[3]?.id;
  }, [dateStrip]);
  const [selectedDateId, setSelectedDateId] = useState(todayId);

  const displayLog = useMemo(() => {
    return combinedFoodLog.filter((log) => {
      if (log.date) {
        return log.date === selectedDateId;
      }
      if (selectedDateId > todayId) {
        return false;
      }
      return true;
    });
  }, [combinedFoodLog, selectedDateId, todayId]);

  const dynamicConsumed = useMemo(() => {
    return displayLog.reduce((sum, log) => sum + log.calories, 0);
  }, [displayLog]);

  const goalTotal = stats?.goalTotal || 2000;
  const progress = dynamicConsumed / goalTotal;

  const handleDeleteLog = async (id) => {
    try {
      const fStr = await AsyncStorage.getItem('mockFoodLog');
      if (fStr) {
        const parsed = JSON.parse(fStr);
        const filtered = parsed.filter((log) => log.id !== id);
        await AsyncStorage.setItem('mockFoodLog', JSON.stringify(filtered));
        setLocalFoodLog(filtered.filter((log) => log.image).reverse());
      }
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 110 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <View style={styles.greetingCol}>
            <Text style={styles.greetingTitle}>Hi, {user.displayName}</Text>
            <Text style={styles.greetingSub}>Ready to conquer today?</Text>
          </View>
          <Pressable
            onPress={() => router.push('/notifications')}
            hitSlop={10}
            style={styles.bellWrap}
          >
            <Ionicons name="notifications-outline" size={26} color={COLORS.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}
        >
          {dateStrip.map((d) => {
            const active = d.id === selectedDateId;
            return (
              <Pressable
                key={d.id}
                onPress={() => setSelectedDateId(d.id)}
                style={[styles.datePill, active && styles.datePillActive]}
              >
                <Text
                  style={[styles.dateDay, active && styles.dateTextActive]}
                >
                  {d.day}
                </Text>
                <Text
                  style={[styles.dateMonth, active && styles.dateTextActive]}
                >
                  {d.month}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.calorieCard}>
          <View style={styles.calorieRow}>
            <View style={styles.calStat}>
              <Text style={styles.calValue}>
                {dynamicConsumed} kcal
              </Text>
              <Text style={styles.calLabel}>Consumed</Text>
            </View>
            <CalorieRing progress={progress} />
            <View style={styles.calStat}>
              <Text style={styles.calValue}>
                {Math.max(0, goalTotal - dynamicConsumed)} kcal
              </Text>
              <Text style={styles.calLabel}>Remaining</Text>
            </View>
          </View>
          <View style={styles.macroRow}>
            {(stats?.macros || []).map((m) => (
              <MacroBar
                key={m.key}
                label={m.label}
                current={m.current}
                target={m.target}
              />
            ))}
          </View>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.flameBox}>
            <Ionicons name="flame" size={28} color={COLORS.accent} />
          </View>
          <View style={styles.streakTextCol}>
            <Text style={styles.streakTitle}>
              Don't Let The Momentum Of Streak
            </Text>
            <Text style={styles.streakSub}>
              Keep it going – you're building momentum!
            </Text>
          </View>
        </View>

        <Text style={styles.foodLogHeading}>Food Log</Text>
        {displayLog.map((item) => (
          <FoodLogItem
            key={item.id}
            name={item.name}
            calories={item.calories}
            imageUri={item.image}
            onPress={() => router.push({ pathname: '/log-it', params: { name: item.name, calories: item.calories, imageUri: item.image } })}
            onDelete={item.date ? () => handleDeleteLog(item.id) : null}
          />
        ))}
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[
          styles.bottomWrap,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={styles.bottomBar}>
          <View style={styles.navItem}>
            <Ionicons name="home" size={26} color={COLORS.accent} />
            <Text style={styles.navLabelActive}>Home</Text>
          </View>
          <Pressable
            onPress={() => router.push('/search')}
            style={styles.navItem}
          >
            <Ionicons name="search-outline" size={26} color={COLORS.accent} />
            <Text style={styles.navLabel}>Search</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/scan')}
            style={styles.navItem}
          >
            <Ionicons name="scan-outline" size={26} color={COLORS.accent} />
            <Text style={styles.navLabel}>Scan</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.navItem}
          >
            <Ionicons name="settings-outline" size={26} color={COLORS.accent} />
            <Text style={styles.navLabel}>Settings</Text>
          </Pressable>
        </View>
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
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    backgroundColor: COLORS.track,
  },
  greetingCol: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  greetingSub: {
    fontSize: 14,
    color: COLORS.textDark,
    opacity: 0.85,
    marginTop: 2,
  },
  bellWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.datePillInactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  dateRow: {
    paddingVertical: 4,
    paddingRight: 8,
    marginBottom: 18,
    gap: 10,
  },
  datePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: COLORS.datePillInactive,
    alignItems: 'center',
    marginRight: 10,
    minWidth: 56,
  },
  datePillActive: {
    backgroundColor: COLORS.accent,
  },
  dateDay: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  dateTextActive: {
    color: COLORS.white,
    opacity: 1,
  },
  calorieCard: {
    backgroundColor: COLORS.card,
    borderRadius: COLORS.radiusLg,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  calStat: {
    flex: 1,
    alignItems: 'center',
  },
  calValue: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  calLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: COLORS.radiusLg,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  flameBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  streakTextCol: {
    flex: 1,
  },
  streakTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  streakSub: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  foodLogHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.foodLogTitle,
    marginBottom: 14,
    fontFamily: 'Georgia',
  },
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.bottomBar,
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginHorizontal: 24,
    minWidth: 280,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  navLabel: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  navLabelActive: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
});
