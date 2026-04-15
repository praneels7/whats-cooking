import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/Button';
import { COLORS } from '../../theme/colors';

const SUGGESTIONS = [
  { id: '1', name: 'Chicken', color: '#C4956A' },
  { id: '2', name: 'Salmon', color: '#E07B6A' },
  { id: '3', name: 'Broccoli', color: '#4A7C59' },
  { id: '4', name: 'Eggs', color: '#E8D9B5' },
  { id: '5', name: 'Rice', color: '#E8E0D0' },
  { id: '6', name: 'Avocado', color: '#4A7C59' },
  { id: '7', name: 'Oats', color: '#C4956A' },
  { id: '8', name: 'Steak', color: '#8B2020' },
];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const searchQuery = query.trim();
    if (!searchQuery) return;
    navigation.navigate('ScanResults', { query: searchQuery });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.gridItem, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate('ScanResults', { query: item.name })}
      activeOpacity={0.8}
    >
      <Text style={styles.gridEmoji}>🥘</Text>
      <Text style={styles.gridName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
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

        <FlatList
          data={SUGGESTIONS}
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
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 30,
    paddingHorizontal: 16, height: 50,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
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
    width: '48%', aspectRatio: 1, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', opacity: 0.85,
  },
  gridEmoji: { fontSize: 40, marginBottom: 8 },
  gridName: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  btn: { marginTop: 8 },
});
