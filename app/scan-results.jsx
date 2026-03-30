import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image
} from 'react-native';
import { colors as COLORS } from '../src/constants/colors';
import { RECIPES } from '../src/data/mockData';

function RecipeRow({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: item.color }]}>
          <Text style={styles.thumbEmoji}>{item.emoji}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.calories} cal &nbsp;&nbsp; {item.weight} Protein.</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ScanResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const query = params.query ? params.query.toLowerCase() : '';
  const filteredRecipes = query
    ? RECIPES.filter(r => r.name.toLowerCase().includes(query) || (r.ingredients && r.ingredients.toLowerCase().includes(query)))
    : RECIPES;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Recipe</Text>
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeRow item={item} onPress={() => router.push({ pathname: '/selected-recipe', params: { id: item.id } })} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
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
});
