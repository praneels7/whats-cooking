import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity,
  FlatList, Alert,
} from 'react-native';
import { colors as COLORS } from '../src/constants/colors';
import Button from '../src/components/Button';
import { SEARCH_CATEGORIES } from '../src/constants/appConfig';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(SEARCH_CATEGORIES);

  const handleSearch = () => {
    if (query.trim()) {
      router.push({ pathname: '/scan-results', params: { query } });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.gridItem, { backgroundColor: item.color }]}
      onPress={() => router.push({ pathname: '/scan-results', params: { query: item.name } })}
      activeOpacity={0.8}
    >
      <Text style={styles.gridEmoji}>{item.emoji}</Text>
      <Text style={styles.gridName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search ingredients..."
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (!text.trim()) {
                  setResults(SEARCH_CATEGORIES);
                } else {
                  setResults(SEARCH_CATEGORIES.filter(s => s.name.toLowerCase().includes(text.toLowerCase())));
                }
              }}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={() => router.replace('/scan')}
          >
            <Text style={styles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Grid */}
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />

        <Button title="Search" onPress={handleSearch} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.heading },
  cameraBtn: {
    width: 50, height: 50, borderRadius: 12,
    backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center',
  },
  cameraIcon: { fontSize: 22 },
  grid: { paddingBottom: 16 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  gridItem: {
    width: '48%',
    height: 110,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
  gridEmoji: { fontSize: 40, marginBottom: 4 },
  gridName: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  btn: { marginTop: 8 },
});
