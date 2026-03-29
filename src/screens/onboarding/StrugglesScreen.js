import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import OptionCard from '../../components/OptionCard';
import { useApp } from '../../context/AppContext';

const STRUGGLES = [
  'I struggle with consistency',
  'I give in to cravings',
  'I lose motivation',
  'I eat from emotions/stress',
  "I don't know what to do",
];

export default function StrugglesScreen({ navigation }) {
  const { updateOnboarding, completeOnboarding } = useApp();
  const [selected, setSelected] = useState([]);

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    updateOnboarding({ struggles: selected });
    completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Struggles</Text>
        <Text style={styles.subtitle}>What's your biggest challenge in fitness?</Text>

        <View style={styles.options}>
          {STRUGGLES.map((s) => (
            <OptionCard
              key={s}
              label={s}
              selected={selected.includes(s)}
              onPress={() => toggle(s)}
            />
          ))}
        </View>

        <Button title="Let's Go!" onPress={handleFinish} style={styles.btn} />
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
