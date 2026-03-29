import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';

export default function DisciplineScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Set Up Your{'\n'}Personalized Plan</Text>
          <Text style={styles.body}>
            Build strength, fuel your mind, and develop discipline. We combine healthy eating and active
            living into a strategy tailored perfectly to your body, goals, and lifestyle
          </Text>
          <Text style={styles.subtext}>
            Answer a few quick questions so we can calculate your personalized calories and macros!
          </Text>
          <View style={styles.indicator}>
            <View style={styles.dot} />
          </View>
        </View>
        <Button title="Next" onPress={() => navigation.navigate('DateOfBirth')} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 32, paddingBottom: 40, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.heading,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 24,
  },
  body: {
    fontSize: 15,
    color: COLORS.heading,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 24,
    opacity: 0.85,
  },
  subtext: {
    fontSize: 15,
    color: COLORS.heading,
    textAlign: 'center',
    lineHeight: 23,
    opacity: 0.85,
  },
  indicator: { marginTop: 32, alignItems: 'center' },
  dot: { width: 30, height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  btn: {},
});
