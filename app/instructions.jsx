import { apiClient } from '../src/services/apiClient';
import { useApi } from '../src/hooks/useApi';
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import { colors as COLORS } from '../src/constants/colors';
import Button from '../src/components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';

const DEFAULT_INSTRUCTIONS = [
  'Preheat the grill to medium-high heat (about 400°F / 200°C).',
  'Pat the chicken breasts dry with a paper towel.',
  'In a small bowl, mix olive oil, garlic powder, paprika, salt, black pepper, oregano, onion powder, and lemon juice.',
  'Rub the seasoning mixture evenly over both sides of the chicken breasts.',
  'Place the chicken on the hot grill and cook for 6–7 minutes on the first side.',
  'Flip the chicken and grill for another 6–7 minutes, or until the internal temperature reaches 165°F (74°C).',
  'Remove the chicken from the grill and let it rest for 3–5 minutes before serving.',
  'Slice and serve warm. Optionally garnish with fresh parsley or a squeeze of lemon.',
];

export default function InstructionsScreen() {
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

  const steps = recipe.instructions || DEFAULT_INSTRUCTIONS;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Instructions</Text>

        {recipe.imageUri ? (
          <Image source={{ uri: recipe.imageUri }} style={styles.heroImg} />
        ) : (
          <View style={[styles.hero, { backgroundColor: recipe.color || '#8B4513' }]}>
            <Text style={styles.heroEmoji}>{recipe.emoji || '🍗'}</Text>
          </View>
        )}

        <View style={styles.steps}>
          {steps.map((step, i) => (
            <Text key={i} style={styles.step}>{i + 1}. {step}</Text>
          ))}
        </View>

        <Button
          title="Next"
          onPress={() => router.push({
            pathname: '/log-it',
            params: {
              name: recipe.name,
              calories: recipe.calories,
              imageUri: recipe.imageUri || '',
              protein: recipe.protein || 0,
              carbs: recipe.carbs || 0,
              fats: recipe.fats || 0,
            },
          })}
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 24, paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center' },
  backBtn: { marginTop: 8, marginBottom: 12 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.heading, textAlign: 'center', marginBottom: 16 },
  hero: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroImg: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    marginBottom: 20,
  },
  heroEmoji: { fontSize: 80 },
  steps: { marginBottom: 24 },
  step: {
    fontSize: 14,
    color: COLORS.heading,
    lineHeight: 22,
    marginBottom: 14,
    opacity: 0.9,
  },
  btn: {},
});