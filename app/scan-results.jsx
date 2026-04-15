import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors as COLORS } from '../src/constants/colors';
import { apiClient } from '../src/services/apiClient';

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
        <Text style={styles.meta}>Tap to see details</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ScanResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const query = params.query || '';

  const [filteredRecipes, setFilteredRecipes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchRecipes = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/recipes/search', { ingredients: query });
        if (response.success) {
          const mapped = response.data.map((item) => ({
            id: item.id.toString(),
            name: item.title,
            calories: 0,
            weight: '',
            protein: 0,
            emoji: '🍽️',
            color: '#E8951A',
            imageUri: item.image,
          }));
          setFilteredRecipes(mapped);
        } else {
          setError(response.error);
        }
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };
    fetchRecipes();
  }, [query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')}
          style={styles.backBtn}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Recipe</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color='#E8930A' />
            <Text style={styles.loadingText}>Fetching delicious recipes...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>Oops! {error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
              <Text style={styles.retryText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredRecipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RecipeRow
                item={item}
                onPress={() => router.push({ pathname: '/selected-recipe', params: { id: item.id } })}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{`No recipes found for "${query}"`}</Text>
            }
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { marginTop: 16, fontSize: 16, color: COLORS.heading, opacity: 0.8 },
  errorText: { fontSize: 16, color: '#D32F2F', textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: '#E8951A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: COLORS.heading, opacity: 0.6 },
});
