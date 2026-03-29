import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import MacroBar from '../../components/MacroBar';
import { useApp } from '../../context/AppContext';

export default function LogItScreen({ navigation, route }) {
  const { addFoodLog } = useApp();
  const item = route.params?.item || {
    name: 'Grilled Chicken', calories: 350, emoji: '🍗', color: '#8B4513',
    protein: 40, carbs: 0, fats: 8, proteinGoal: 120, carbsGoal: 150, fatsGoal: 50,
  };

  const [grams, setGrams] = useState(200);

  const scaleFactor = grams / 100;
  const scaledCal = Math.round((item.calories / 2) * scaleFactor);
  const scaledProtein = Math.round((item.protein || 0) * scaleFactor);
  const scaledCarbs = Math.round((item.carbs || 0) * scaleFactor);
  const scaledFats = Math.round((item.fats || 0) * scaleFactor);

  const handleAdd = () => {
    addFoodLog({
      name: item.name,
      calories: scaledCal,
      protein: scaledProtein,
      carbs: scaledCarbs,
      fats: scaledFats,
      emoji: item.emoji || '🍽️',
    });
    Alert.alert('Logged!', `${item.name} has been added to your food log.`, [
      { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Log It</Text>

        <View style={[styles.hero, { backgroundColor: item.color || '#8B4513' }]}>
          <Text style={styles.heroEmoji}>{item.emoji || '🍽️'}</Text>
        </View>

        <View style={styles.infoRow}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCal}>{scaledCal} cal</Text>
          </View>
          <View style={styles.gramControl}>
            <TouchableOpacity onPress={() => setGrams(Math.max(10, grams - 10))} style={styles.gramBtn}>
              <Text style={styles.gramBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.gramValue}>{grams}g</Text>
            <TouchableOpacity onPress={() => setGrams(grams + 10)} style={styles.gramBtn}>
              <Text style={styles.gramBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.macros}>
          <MacroBar label="Protein" current={scaledProtein} goal={item.proteinGoal || 120} />
          <MacroBar label="Carbs" current={scaledCarbs} goal={item.carbsGoal || 150} />
          <MacroBar label="Fats" current={scaledFats} goal={item.fatsGoal || 50} />
        </View>

        <Button title="Add To Log" onPress={handleAdd} style={styles.btn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginTop: 8, marginBottom: 4 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.heading, textAlign: 'center', marginBottom: 16 },
  hero: {
    width: '100%', height: 220, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  heroEmoji: { fontSize: 90 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  itemName: { fontSize: 20, fontWeight: '800', color: COLORS.heading },
  itemCal: { fontSize: 14, color: COLORS.heading, opacity: 0.7 },
  gramControl: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.background,
    borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: COLORS.heading,
  },
  gramBtn: { width: 24, alignItems: 'center' },
  gramBtnText: { fontSize: 20, fontWeight: '700', color: COLORS.heading },
  gramValue: { fontSize: 14, fontWeight: '600', color: COLORS.heading, minWidth: 50, textAlign: 'center' },
  macros: { marginBottom: 24 },
  btn: {},
});
