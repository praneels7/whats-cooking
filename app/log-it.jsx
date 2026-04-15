import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MacroBar from '../src/components/MacroBar';
import { colors as COLORS } from '../src/constants/colors';

export default function LogItScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const name = params?.name || 'Grilled Chicken';
  const baseCalories = parseInt(params?.calories) || 350;
  const imageUri = params?.imageUri || null;

  const baseProtein = parseInt(params?.protein) || 30;
  const baseCarbs = parseInt(params?.carbs) || 20;
  const baseFats = parseInt(params?.fats) || 8;
  const proteinGoal = 120;
  const carbsGoal = 150;
  const fatsGoal = 50;

  const [grams, setGrams] = useState(200);

  const scaleFactor = grams / 100;
  const scaledCal = Math.round(baseCalories * scaleFactor);
  const scaledProtein = Math.round(baseProtein * scaleFactor);
  const scaledCarbs = Math.round(baseCarbs * scaleFactor);
  const scaledFats = Math.round(baseFats * scaleFactor);

  const handleAdd = async () => {
    try {
      const existing = await AsyncStorage.getItem('mockFoodLog');
      const logArray = existing ? JSON.parse(existing) : [];
      logArray.push({
        id: Date.now().toString(),
        name,
        calories: scaledCal,
        protein: scaledProtein,
        carbs: scaledCarbs,
        fats: scaledFats,
        grams,
        image: imageUri || null,
        date: new Date().toISOString().slice(0, 10),
      });
      await AsyncStorage.setItem('mockFoodLog', JSON.stringify(logArray));
      router.replace('/dashboard');
    } catch (e) {
      console.error(e);
      router.replace('/dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')}
            hitSlop={12}
            style={styles.backBtn}
          >
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Log It</Text>
          <View style={{ width: 40 }} />
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.hero} />
        ) : (
          <View style={[styles.hero, { backgroundColor: '#1A1A1A' }]}>
            <Text style={{ fontSize: 90 }}>🍽️</Text>
          </View>
        )}

        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemCal}>{scaledCal} cal</Text>

        <View style={styles.gramControlRow}>
          <TouchableOpacity onPress={() => setGrams(Math.max(10, grams - 10))} style={styles.gramBtn}>
            <Text style={styles.gramBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.gramValue}>{grams}g</Text>
          <TouchableOpacity onPress={() => setGrams(grams + 10)} style={styles.gramBtn}>
            <Text style={styles.gramBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.macros}>
          <MacroBar label="Protein" current={scaledProtein} target={proteinGoal} />
          <MacroBar label="Carbs" current={scaledCarbs} target={carbsGoal} />
          <MacroBar label="Fats" current={scaledFats} target={fatsGoal} />
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add To Log</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  back: { fontSize: 26, color: COLORS.textDark, fontWeight: '300' },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  hero: {
    width: '100%', height: 220, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, backgroundColor: '#1A1A1A',
  },
  itemName: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  itemCal: { fontSize: 15, color: COLORS.textMuted, marginBottom: 16 },
  gramControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: COLORS.card,
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gramBtn: { width: 32, alignItems: 'center' },
  gramBtnText: { fontSize: 26, fontWeight: '700', color: COLORS.white },
  gramValue: { fontSize: 18, fontWeight: '600', color: COLORS.white, minWidth: 60, textAlign: 'center' },
  macros: { marginBottom: 30, backgroundColor: COLORS.card, padding: 20, borderRadius: 16 },
  addBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  addBtnText: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
});
