import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity,
  FlatList, Alert,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import { SEARCH_SUGGESTIONS } from '../../data/mockData';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(SEARCH_SUGGESTIONS);

  const handleSearch = () => {
    if (!query.trim()) {
      setResults(SEARCH_SUGGESTIONS);
      return;
    }
    const filtered = SEARCH_SUGGESTIONS.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.length ? filtered : SEARCH_SUGGESTIONS);
    navigation.navigate('ScanResults', { query });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.gridItem, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate('ScanResults', { query: item.name })}
      activeOpacity={0.8}
    >
      <Text style={styles.gridEmoji}>{item.emoji}</Text>
      <Text style={styles.gridName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search ingredients..."
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={() => navigation.navigate('Scan')}
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
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
  gridEmoji: { fontSize: 40, marginBottom: 8 },
  gridName: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  btn: { marginTop: 8 },
});
