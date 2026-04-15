import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import CircularProgress from '../../components/CircularProgress';
import MacroBar from '../../components/MacroBar';
import { useApp } from '../../context/AppContext';

const DAYS = ['1\nFeb', '2\nFeb', '3\nFeb', '4\nFeb', '5\nFeb', '6\nFeb', '7\nFeb'];
const TODAY_INDEX = 3;

function FoodCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.foodCard} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.foodImage, { backgroundColor: item.color || '#8B4513' }]}>
        <Text style={styles.foodEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodCal}>{item.calories} cal</Text>
      </View>
      <Text style={styles.foodArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ navigation }) {
  const { user, foodLog, calorieGoal, consumed, remaining, macroGoal, macrosConsumed } = useApp();
  const progress = consumed / calorieGoal;

  const foodColors = ['#8B4513', '#4A7C3F', '#C8A060', '#A0522D', '#6B8E23'];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👨‍🍳</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Hey {user.username || 'there'}!</Text>
              <Text style={styles.subGreeting}>Ready to conquer today?</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notifBtn}>
            <Text style={styles.bell}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Week Strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekStrip}>
          {DAYS.map((d, i) => (
            <View key={i} style={[styles.dayChip, i === TODAY_INDEX && styles.dayChipActive]}>
              {d.split('\n').map((line, j) => (
                <Text key={j} style={[styles.dayText, i === TODAY_INDEX && styles.dayTextActive]}>{line}</Text>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Calorie Card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieRow}>
            <View style={styles.calorieStat}>
              <Text style={styles.calorieNum}>{consumed} kcal</Text>
              <Text style={styles.calorieLbl}>Consumed</Text>
            </View>
            <CircularProgress size={120} strokeWidth={11} progress={progress} />
            <View style={styles.calorieStat}>
              <Text style={[styles.calorieNum, styles.calorieRemaining]}>{remaining} kcal</Text>
              <Text style={styles.calorieLbl}>Remaining</Text>
            </View>
          </View>
          <View style={styles.macroRow}>
            <MacroBar label="Protein" current={macrosConsumed.protein} goal={macroGoal.protein} dark />
            <View style={styles.macroDivider} />
            <MacroBar label="Carbs" current={macrosConsumed.carbs} goal={macroGoal.carbs} dark />
            <View style={styles.macroDivider} />
            <MacroBar label="Fats" current={macrosConsumed.fats} goal={macroGoal.fats} dark />
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View style={styles.streakText}>
            <Text style={styles.streakTitle}>Don&apos;t Let The Momentum Of Streak</Text>
            <Text style={styles.streakSub}>Keep it going &ndash; you&apos;re building momentum!</Text>
          </View>
        </View>

        {/* Food Log */}
        <Text style={styles.sectionTitle}>Food Log</Text>
        {foodLog.map((item, i) => (
          <FoodCard
            key={item.id}
            item={{ ...item, color: foodColors[i % foodColors.length] }}
            onPress={() => navigation.navigate('LogIt', { item })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#E8951D', alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  greeting: { fontSize: 18, fontWeight: '800', color: COLORS.heading },
  subGreeting: { fontSize: 13, color: COLORS.heading, opacity: 0.7 },
  notifBtn: { position: 'relative' },
  bell: { fontSize: 24 },
  notifDot: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  weekStrip: { marginBottom: 16 },
  dayChip: {
    width: 44, height: 56, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  dayChipActive: { backgroundColor: COLORS.primary },
  dayText: { fontSize: 13, color: COLORS.heading, textAlign: 'center', opacity: 0.7, lineHeight: 16 },
  dayTextActive: { color: COLORS.white, opacity: 1, fontWeight: '700' },
  calorieCard: {
    backgroundColor: COLORS.dark,
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
  },
  calorieRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  calorieStat: { alignItems: 'center', flex: 1 },
  calorieNum: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  calorieRemaining: { color: COLORS.primary },
  calorieLbl: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  macroRow: { flexDirection: 'row', gap: 6 },
  macroDivider: { width: 1, backgroundColor: '#333' },
  streakCard: {
    backgroundColor: COLORS.dark,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  streakIcon: { fontSize: 28 },
  streakText: { flex: 1 },
  streakTitle: { fontSize: 14, fontWeight: '700', color: COLORS.white, marginBottom: 3 },
  streakSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: COLORS.heading, marginBottom: 12 },
  foodCard: {
    backgroundColor: COLORS.dark,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  foodImage: {
    width: 56, height: 56, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  foodEmoji: { fontSize: 28 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 3 },
  foodCal: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  foodArrow: { fontSize: 22, color: COLORS.white, opacity: 0.5 },
});
