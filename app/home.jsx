import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeIngredientsInput() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#3D2914" />
        </TouchableOpacity>
        <Text style={styles.title}>Ingredients Input</Text>
        <View style={styles.backPlaceholder} />
      </View>
      <View style={styles.content}>
        <Ionicons name="fast-food-outline" size={80} color="#E8930A" style={{marginBottom: 20}} />
        <Text style={styles.sub}>What&apos;s in your fridge?</Text>
        <Text style={styles.desc}>This is the placeholder for the Ingredients Input feature!</Text>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.btn}>
           <Text style={styles.btnText}>Go To Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5C87A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backPlaceholder: { width: 40 },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: '#3D2914' },
  content: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 30
  },
  sub: { fontSize: 24, fontWeight: 'bold', color: '#3D2914', marginBottom: 10 },
  desc: { fontSize: 16, color: '#3D2914', marginBottom: 30, textAlign: 'center' },
  btn: { padding: 16, paddingHorizontal: 30, backgroundColor: '#E8930A', borderRadius: 12, borderWidth: 1, borderColor: '#3D2914' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
