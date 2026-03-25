import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Text style={styles.subtitle}>
        [Placeholder for Home Page / Ingredients Input]
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6c88f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b2a47',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#3b2a47',
    textAlign: 'center',
    lineHeight: 24,
  },
});
