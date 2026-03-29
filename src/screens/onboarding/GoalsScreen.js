import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import OptionCard from '../../components/OptionCard';
import { useApp } from '../../context/AppContext';

const GOALS = ['Lose Weight', 'Gain Weight', 'Maintain Weight'];

export default function GoalsScreen({ navigation }) {
  const { updateOnboarding } = useApp();
  const [goal, setGoal] = useState('Lose Weight');
  const [speedUnit, setSpeedUnit] = useState('Weeks');
  const [speed, setSpeed] = useState(20);

  const handleNext = () => {
    updateOnboarding({ goal, goalSpeed: speed, goalSpeedUnit: speedUnit });
    navigation.navigate('ActivityLevel');
  };

  const handleSlider = (e) => {
    const x = e.nativeEvent.locationX;
    const sliderWidth = 300;
    const val = Math.round(10 + (x / sliderWidth) * 20);
    setSpeed(Math.min(Math.max(val, 10), 30));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Main Goal</Text>
        <Text style={styles.subtitle}>What's your main goal right now?</Text>

        {GOALS.map((g) => (
          <OptionCard key={g} label={g} selected={goal === g} onPress={() => setGoal(g)} />
        ))}

        <Button title="Next" onPress={handleNext} style={styles.btn} />

        <Text style={styles.speedTitle}>How quickly would you like to reach{'\n'}your goal?</Text>

        <View style={styles.speedToggle}>
          {['Weeks', 'Months'].map((u) => (
            <TouchableOpacity
              key={u}
              style={[styles.speedBtn, speedUnit === u && styles.speedBtnActive]}
              onPress={() => setSpeedUnit(u)}
            >
              <Text style={[styles.speedBtnText, speedUnit === u && styles.speedBtnTextActive]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sliderRow}>
          <Text style={styles.sliderIcon}>🐌</Text>
          <View style={styles.sliderTrack} onTouchEnd={handleSlider}>
            <View style={[styles.sliderFill, { width: `${((speed - 10) / 20) * 100}%` }]} />
            <View style={[styles.sliderThumb, { left: `${((speed - 10) / 20) * 100}%` }]} />
          </View>
          <Text style={styles.sliderIcon}>🐇</Text>
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>10</Text>
          <Text style={[styles.sliderLabel, styles.sliderLabelCenter]}>{speed}</Text>
          <Text style={styles.sliderLabel}>30</Text>
        </View>

        <Button title="Next" onPress={handleNext} style={styles.btn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 28, paddingBottom: 40 },
  backBtn: { marginTop: 8, marginBottom: 16 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.heading, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 15, color: COLORS.heading, marginBottom: 16, opacity: 0.85 },
  btn: { marginTop: 16, marginBottom: 24 },
  speedTitle: { fontSize: 16, fontWeight: '600', color: COLORS.heading, textAlign: 'center', marginBottom: 16, lineHeight: 24 },
  speedToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 50,
    padding: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  speedBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 50 },
  speedBtnActive: { backgroundColor: COLORS.primary },
  speedBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.heading, opacity: 0.6 },
  speedBtnTextActive: { color: COLORS.white, opacity: 1 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginBottom: 6 },
  sliderIcon: { fontSize: 22 },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 3,
    marginHorizontal: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  sliderThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    top: -8,
    marginLeft: -11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 36, marginBottom: 20 },
  sliderLabel: { fontSize: 12, color: COLORS.heading, opacity: 0.7 },
  sliderLabelCenter: { fontWeight: '700', opacity: 1 },
});
