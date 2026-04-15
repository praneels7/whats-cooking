import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../src/components/Button';
import { colors as COLORS } from '../src/constants/colors';
import { apiClient } from '../src/services/apiClient';

const DEFAULT_INSTRUCTIONS = [
  'Gather all ingredients and prepare your workspace.',
  'Follow the recipe steps carefully.',
  'Cook until done and serve warm.',
];

export default function InstructionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!params.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await apiClient.get(`/recipes/${params.id}`);
        if (response.success) {
          setRecipe(response.data);
        }
      } catch (e) {
        console.log('Error fetching recipe:', e.message);
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [params.id]);

  if (loading || !recipe) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.accent || '#E8930A'} />
      </SafeAreaView>
    );
  }

  // Spoonacular returns instructions as analyzedInstructions array
  let steps = DEFAULT_INSTRUCTIONS;
  if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
    steps = recipe.analyzedInstructions[0].steps.map((s) => s.step);
  } else if (recipe.instructions) {
    steps = [recipe.instructions];
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')}
          style={styles.backBtn}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{recipe.title || 'Instructions'}</Text>

        {recipe.image ? (
          <Image source={{ uri: recipe.image }} style={styles.heroImg} />
        ) : (
          <View style={[styles.hero, { backgroundColor: '#E8951A' }]}>
            <Text style={styles.heroEmoji}>🍽️</Text>
          </View>
        )}

        <View style={styles.steps}>
          {steps.map((step, i) => (
            <Text key={i} style={styles.step}>{i + 1}. {step}</Text>
          ))}
        </View>

        <Button
          title="Log This Meal"
          onPress={() => router.push({
            pathname: '/log-it',
            params: {
              name: recipe.title || 'Meal',
              calories: recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
              imageUri: recipe.image || '',
              protein: recipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0,
              carbs: recipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0,
              fats: recipe.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 0,
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
    width: '100%', height: 200, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  heroImg: { width: '100%', height: 280, borderRadius: 24, marginBottom: 20 },
  heroEmoji: { fontSize: 80 },
  steps: { marginBottom: 24 },
  step: {
    fontSize: 14, color: COLORS.heading, lineHeight: 22,
    marginBottom: 14, opacity: 0.9,
  },
  btn: {},
});
