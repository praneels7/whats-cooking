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
import MacroBar from '../src/components/MacroBar';
import { colors as COLORS } from '../src/constants/colors';
import { apiClient } from '../src/services/apiClient';

export default function SelectedRecipeScreen() {
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

  // Extract nutrition from Spoonacular response
  const nutrients = recipe.nutrition?.nutrients || [];
  const getnutrient = (name) => nutrients.find(n => n.name === name)?.amount || 0;
  const calories = Math.round(getnutrient('Calories'));
  const protein = Math.round(getnutrient('Protein'));
  const carbs = Math.round(getnutrient('Carbohydrates'));
  const fats = Math.round(getnutrient('Fat'));

  // Extract ingredients
  const ingredients = recipe.extendedIngredients
    ? recipe.extendedIngredients.map(i => i.original).join('\n')
    : 'No ingredients available';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')}
          style={styles.backBtn}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {recipe.image ? (
          <Image source={{ uri: recipe.image }} style={styles.heroImg} />
        ) : (
          <View style={[styles.hero, { backgroundColor: '#E8951A' }]}>
            <Text style={styles.heroEmoji}>🍽️</Text>
          </View>
        )}

        <Text style={styles.recipeName}>{recipe.title}</Text>

        <View style={styles.tags}>
          <View style={styles.tag}><Text style={styles.tagText}>{calories} cal</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>{recipe.readyInMinutes || '?'} min</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>{recipe.servings || '?'} servings</Text></View>
        </View>

        <Text style={styles.sectionLabel}>Ingredients:</Text>
        <Text style={styles.ingredients}>{ingredients}</Text>

        <View style={styles.macros}>
          <MacroBar label="Protein" current={protein} target={120} labelColor="#000000" />
          <MacroBar label="Carbs" current={carbs} target={150} labelColor="#000000" />
          <MacroBar label="Fats" current={fats} target={50} labelColor="#000000" />
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
    width: '100%', height: 220, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  heroImg: { width: '100%', height: 300, borderRadius: 24, marginBottom: 16 },
  heroEmoji: { fontSize: 90 },
  recipeName: { fontSize: 24, fontWeight: '800', color: COLORS.heading, marginBottom: 12 },
  tags: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tag: {
    backgroundColor: COLORS.background, borderRadius: 50,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1.5, borderColor: COLORS.heading,
  },
  tagText: { fontSize: 13, fontWeight: '600', color: COLORS.heading },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: COLORS.heading, marginBottom: 6 },
  ingredients: { fontSize: 13, color: COLORS.heading, lineHeight: 18, marginBottom: 20, opacity: 0.85 },
  macros: { marginBottom: 24 },
  btn: {},
});
