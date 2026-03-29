import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import { useApp } from '../../context/AppContext';

const TICK_SPACING = 14;
const MIN_VAL = 40;
const MAX_VAL = 200;
const VALUES = Array.from({ length: MAX_VAL - MIN_VAL + 1 }, (_, i) => MIN_VAL + i);

function RulerPicker({ value, onChange, unit }) {
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / TICK_SPACING);
    const val = Math.min(Math.max(MIN_VAL + idx, MIN_VAL), MAX_VAL);
    onChange(val);
  };

  React.useEffect(() => {
    const idx = value - MIN_VAL;
    scrollRef.current?.scrollTo({ x: idx * TICK_SPACING, animated: false });
  }, []);

  return (
    <View>
      <View style={styles.valueDisplay}>
        <Text style={styles.valueNum}>{value}</Text>
        <Text style={styles.valueUnit}>{unit}</Text>
      </View>
      <View style={styles.rulerContainer}>
        <View style={styles.centerLine} />
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={TICK_SPACING}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          contentContainerStyle={{ paddingHorizontal: 160 }}
        >
          {VALUES.map((v, idx) => (
            <View key={v} style={styles.tickContainer}>
              <View style={[
                styles.tick,
                v % 10 === 0 ? styles.tickLarge : v % 5 === 0 ? styles.tickMedium : styles.tickSmall,
                v === value && styles.tickActive,
              ]} />
              {v % 10 === 0 && (
                <Text style={[styles.tickLabel, v === value && styles.tickLabelActive]}>{v}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function UnitToggle({ options, selected, onSelect }) {
  return (
    <View style={styles.toggle}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.toggleBtn, selected === opt && styles.toggleBtnActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.toggleText, selected === opt && styles.toggleTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function HeightWeightScreen({ navigation }) {
  const { updateOnboarding } = useApp();
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [tab, setTab] = useState('Weight');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [targetWeight, setTargetWeight] = useState(70);

  const handleNext = () => {
    updateOnboarding({ weightUnit, weight, height, targetWeight });
    navigation.navigate('Goals');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Height and Weight</Text>
        <Text style={styles.subtitle}>What is your current height and weight?</Text>

        <UnitToggle options={['lbs', 'kg']} selected={weightUnit} onSelect={setWeightUnit} />

        <UnitToggle options={['Weight', 'Height']} selected={tab} onSelect={setTab} />

        {tab === 'Weight' ? (
          <RulerPicker value={weight} onChange={setWeight} unit={weightUnit} />
        ) : (
          <RulerPicker value={height} onChange={setHeight} unit="cm" />
        )}

        <Text style={styles.sectionTitle}>Target Weight</Text>
        <Text style={styles.subtitle}>What's your target weight?</Text>
        <UnitToggle options={['lb', 'kg']} selected={weightUnit} onSelect={setWeightUnit} />
        <RulerPicker value={targetWeight} onChange={setTargetWeight} unit={weightUnit} />

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
  title: { fontSize: 24, fontWeight: '800', color: COLORS.heading, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.heading, textAlign: 'center', marginBottom: 16, opacity: 0.8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.heading, textAlign: 'center', marginTop: 24, marginBottom: 8 },
  toggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 50,
    padding: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  toggleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
  },
  toggleBtnActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: COLORS.heading, opacity: 0.6 },
  toggleTextActive: { color: COLORS.white, opacity: 1 },
  valueDisplay: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  valueNum: { fontSize: 60, fontWeight: '300', color: COLORS.heading },
  valueUnit: { fontSize: 18, color: COLORS.heading, alignSelf: 'flex-end', marginBottom: 12, marginLeft: 4 },
  rulerContainer: { height: 60, overflow: 'hidden', marginBottom: 8, position: 'relative' },
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.heading,
    zIndex: 1,
  },
  tickContainer: { width: TICK_SPACING, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 },
  tick: { backgroundColor: 'rgba(45,21,0,0.4)', borderRadius: 1 },
  tickSmall: { width: 1, height: 12 },
  tickMedium: { width: 1.5, height: 18 },
  tickLarge: { width: 2, height: 26 },
  tickActive: { backgroundColor: COLORS.heading },
  tickLabel: { fontSize: 9, color: 'rgba(45,21,0,0.5)', marginTop: 2 },
  tickLabelActive: { color: COLORS.heading, fontWeight: '700' },
  btn: { marginTop: 24 },
});
