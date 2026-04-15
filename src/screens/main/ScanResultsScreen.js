import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

function RecipeRow({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.thumb, { backgroundColor: '#E8951A' }]}>
        <Text style={styles.thumbEmoji}>🍽️</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.meta}>Used: {item.usedIngredientCount} ingredients</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ScanResultsScreen({ navigation, route }) {
  const { query } = route.params || {};
  const { searchRecipes } = useApp();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!query) {
        console.log('No query provided');
        setLoading(false);
        return;
      }
      console.log('Searching for:', query);
      setLoading(true);
      const data = await searchRecipes(query);
      console.log('Results:', JSON.stringify(data));
      setRecipes(data || []);
      setLoading(false);
    };
    fetchRecipes();
  }, [query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Recipe</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.heading} style={{ marginTop: 40 }} />
        ) : recipes.length === 0 ? (
          <Text style={styles.empty}>No recipes found for "{query}"</Text>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <RecipeRow
                item={item}
                onPress={() => navigation.navigate('SelectedRecipe', { recipeId: item.id, recipeTitle: item.title })}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { marginTop: 8, marginBottom: 16 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.heading, textAlign: 'center', marginBottom: 20 },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: COLORS.dark,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    gap: 14,
  },
  thumb: {
    width: 70, height: 70, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 36 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.white, marginBottom: 5 },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  arrow: { fontSize: 24, color: COLORS.white, opacity: 0.5 },
  empty: { textAlign: 'center', color: COLORS.heading, marginTop: 40, fontSize: 16 },
});
