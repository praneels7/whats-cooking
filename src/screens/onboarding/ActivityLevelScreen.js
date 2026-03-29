import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import OptionCard from '../../components/OptionCard';
import { useApp } from '../../context/AppContext';

const ACTIVITY_LEVELS = [
  'Rarely Active — 0–1 workouts per week',
  'Lightly Active — 2–3 workouts per week',
  'Moderately Active — 4–5 workouts per week',
  'Very Active — 6+ workouts per week',
];

export default function ActivityLevelScreen({ navigation }) {
  const { updateOnboarding } = useApp();
  const [selected, setSelected] = useState(ACTIVITY_LEVELS[0]);

  const handleNext = () => {
    updateOnboarding({ activityLevel: selected });
    navigation.navigate('Struggles');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Activity Level</Text>
        <Text style={styles.subtitle}>How active are you on a typical week?</Text>

        <View style={styles.options}>
          {ACTIVITY_LEVELS.map((level) => (
            <OptionCard
              key={level}
              label={level}
              selected={selected === level}
              onPress={() => setSelected(level)}
            />
          ))}
        </View>

        <Button title="Next" onPress={handleNext} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 28, paddingBottom: 40 },
  backBtn: { marginTop: 8, marginBottom: 16 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.heading, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 15, color: COLORS.heading, marginBottom: 20, opacity: 0.85 },
  options: { flex: 1 },
  btn: {},
});
