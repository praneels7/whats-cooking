import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import MacroBar from '../../components/MacroBar';

export default function SelectedRecipeScreen({ navigation, route }) {
  const recipe = route.params?.recipe || {
    name: 'Grilled Chicken', calories: 350, weight: '400g', servings: '2 Plate',
    emoji: '🍗', color: '#8B4513',
    protein: 40, carbs: 0, fats: 8,
    proteinGoal: 120, carbsGoal: 150, fatsGoal: 50,
    ingredients: '2 boneless chicken breasts, olive oil, garlic powder, paprika, salt, black pepper, dried oregano, onion powder, lemon juice',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Hero Image */}
        <View style={[styles.hero, { backgroundColor: recipe.color }]}>
          <Text style={styles.heroEmoji}>{recipe.emoji}</Text>
        </View>

        {/* Info */}
        <Text style={styles.recipeName}>{recipe.name}</Text>

        <View style={styles.tags}>
          <View style={styles.tag}><Text style={styles.tagText}>{recipe.calories} cal</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>{recipe.weight}</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>{recipe.servings}</Text></View>
        </View>

        <Text style={styles.sectionLabel}>Ingredients:</Text>
        <Text style={styles.ingredients}>{recipe.ingredients}</Text>

        <View style={styles.macros}>
          <MacroBar label="Protein" current={recipe.protein} goal={recipe.proteinGoal} />
          <MacroBar label="Carbs" current={recipe.carbs} goal={recipe.carbsGoal} />
          <MacroBar label="Fats" current={recipe.fats} goal={recipe.fatsGoal} />
        </View>

        <Button
          title="Let's Cook"
          onPress={() => navigation.navigate('Instructions', { recipe })}
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  backBtn: { marginTop: 8, marginBottom: 12 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  hero: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroEmoji: { fontSize: 90 },
  recipeName: { fontSize: 24, fontWeight: '800', color: COLORS.heading, marginBottom: 12 },
  tags: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tag: {
    backgroundColor: COLORS.background,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: COLORS.heading,
  },
  tagText: { fontSize: 13, fontWeight: '600', color: COLORS.heading },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: COLORS.heading, marginBottom: 6 },
  ingredients: { fontSize: 14, color: COLORS.heading, lineHeight: 22, marginBottom: 20, opacity: 0.85 },
  macros: { marginBottom: 24 },
  btn: {},
});
