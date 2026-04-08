import { apiClient } from '../src/services/apiClient';
import { useApi } from '../src/hooks/useApi';
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import { colors as COLORS } from '../src/constants/colors';
import Button from '../src/components/Button';
import MacroBar from '../src/components/MacroBar';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SelectedRecipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { data: recipe, loading, execute: fetchRecipe } = useApi((id) => apiClient.get(`/mock/recipes/${id}`));

  useEffect(() => {
    if (params.id) fetchRecipe(params.id);
  }, [params.id]);

  if (loading || !recipe) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.accent || '#E8930A'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Hero Image */}
        {recipe.imageUri ? (
          <Image source={{ uri: recipe.imageUri }} style={styles.heroImg} />
        ) : (
          <View style={[styles.hero, { backgroundColor: recipe.color }]}>
            <Text style={styles.heroEmoji}>{recipe.emoji}</Text>
          </View>
        )}

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
          <MacroBar label="Protein" current={recipe.protein} target={recipe.proteinGoal} />
          <MacroBar label="Carbs" current={recipe.carbs} target={recipe.carbsGoal} />
          <MacroBar label="Fats" current={recipe.fats} target={recipe.fatsGoal} />
        </View>

        <Button
          title="Let's Cook"
          onPress={() => router.push({ pathname: '/instructions', params: { id: recipe.id } })}
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center' },
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
  heroImg: {
    width: '100%',
    height: 300,
    borderRadius: 24,
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
  ingredients: { fontSize: 13, color: COLORS.heading, lineHeight: 18, marginBottom: 20, opacity: 0.85 },
  macros: { marginBottom: 24 },
  btn: {},
});