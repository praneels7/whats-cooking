import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const TICK_WIDTH = 12;

const RulerPicker = ({ min, max, value, onValueChange, suffix }) => {
  const scrollViewRef = useRef(null);
  const ticks = [];
  for (let i = min; i <= max; i++) {
    ticks.push(i);
  }

  useEffect(() => {
    if (scrollViewRef.current) {
      const targetX = Math.max(0, (value - min) * TICK_WIDTH);
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: targetX, animated: false });
      }, 50);
    }
  }, []);

  const handleScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / TICK_WIDTH);
    const val = min + index;
    if (val >= min && val <= max) {
      onValueChange(val);
    }
  };

  return (
    <View style={styles.rulerContainer}>
      <View style={styles.valueRow}>
        <Text style={styles.rulerValueText}>{value}</Text>
        <Text style={styles.rulerSuffix}>{suffix}</Text>
      </View>
      <View style={styles.rulerViewport}>
        <View style={styles.needle} />
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={TICK_WIDTH}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingHorizontal: (width - 40) / 2 - (TICK_WIDTH / 2)
          }}
        >
          {ticks.map((tick) => {
            const isTenth = tick % 10 === 0;
            return (
              <View key={tick} style={[styles.tickWrapper, { width: TICK_WIDTH }]}>
                {isTenth && <Text style={styles.tickLabel}>{tick}</Text>}
                <View style={[
                  styles.tickLine,
                  isTenth ? styles.tickLineTall : styles.tickLineShort
                ]} />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

function UnitToggle({ options, selected, onSelect }) {
  return (
    <View style={styles.tinyToggleWrap}>
      <View style={styles.tinyToggle}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            style={[styles.tinySegment, selected === opt && styles.tinySegmentActive]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.tinySegmentText, selected === opt && styles.tinySegmentTextActive]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function HeightWeight() {
  const router = useRouter();
  const { fromSettings, fromReset } = useLocalSearchParams();
  const isEditing = fromSettings === 'true';
  const isResetting = fromReset === 'true';

  const [weightUnit, setWeightUnit] = useState('lbs');
  const [heightUnit, setHeightUnit] = useState('in');
  const [bottomUnit, setBottomUnit] = useState('lb');

  const [currentWeight, setCurrentWeight] = useState(150);
  const [currentHeight, setCurrentHeight] = useState(68);
  const [targetWeight, setTargetWeight] = useState(140);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const existing = await AsyncStorage.getItem('mockUserAccount');
        if (existing) {
          const account = JSON.parse(existing);
          if (account.physicalMetrics) {
            const m = account.physicalMetrics;
            setWeightUnit(m.weightUnit || m.unit || 'lbs');
            setHeightUnit(m.heightUnit || (m.unit === 'kg' ? 'cm' : 'in'));
            setBottomUnit(m.targetUnit || 'lb');
            setCurrentWeight(m.currentWeight || 150);
            setTargetWeight(m.targetWeight || 140);
            setCurrentHeight(m.currentHeight || 68);
          }
        }
      } catch (e) {}
      setIsLoaded(true);
    }
    loadData();
  }, []);

  if (!isLoaded) return null;

  const handleWeightUnitChange = (newUnit) => {
    if (newUnit === weightUnit) return;
    setWeightUnit(newUnit);
    if (newUnit === 'kg') {
      setCurrentWeight(prev => Math.max(20, Math.round(prev / 2.20462)));
    } else {
      setCurrentWeight(prev => Math.min(400, Math.round(prev * 2.20462)));
    }
  };

  const handleHeightUnitChange = (newUnit) => {
    if (newUnit === heightUnit) return;
    setHeightUnit(newUnit);
    if (newUnit === 'cm') {
      setCurrentHeight(prev => Math.max(90, Math.round(prev * 2.54)));
    } else {
      setCurrentHeight(prev => Math.min(96, Math.round(prev / 2.54)));
    }
  };

  const handleBottomUnitChange = (newUnit) => {
    if (newUnit === bottomUnit) return;
    setBottomUnit(newUnit);
    if (newUnit === 'kg') {
      setTargetWeight(prev => Math.max(20, Math.round(prev / 2.20462)));
    } else {
      setTargetWeight(prev => Math.min(400, Math.round(prev * 2.20462)));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => {
          if (isEditing) {
            router.replace('/settings');
          } else {
            router.canGoBack() ? router.back() : router.replace(isResetting ? '/dob?fromReset=true' : '/dob');
          }
        }} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#3D2914" />
        </Pressable>
        <Text style={styles.title}>Height and Weight</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Bar 1: Current Weight ── */}
        <Text style={styles.sectionTitle}>Current Weight</Text>
        <UnitToggle
          options={['lbs', 'kg']}
          selected={weightUnit}
          onSelect={handleWeightUnitChange}
        />
        <RulerPicker
          key={`weight-${weightUnit}`}
          min={weightUnit === 'lbs' ? 40 : 20}
          max={weightUnit === 'lbs' ? 400 : 200}
          value={currentWeight}
          onValueChange={setCurrentWeight}
          suffix={weightUnit}
        />

        <View style={styles.divider} />

        {/* ── Bar 2: Target Weight ── */}
        <Text style={styles.sectionTitle}>Target Weight</Text>
        <Text style={styles.subtitle}>What&apos;s your target weight?</Text>
        <UnitToggle
          options={['lb', 'kg']}
          selected={bottomUnit}
          onSelect={handleBottomUnitChange}
        />
        <RulerPicker
          key={`target-${bottomUnit}`}
          min={bottomUnit === 'lb' ? 40 : 20}
          max={bottomUnit === 'lb' ? 400 : 200}
          value={targetWeight}
          onValueChange={setTargetWeight}
          suffix={bottomUnit}
        />

        <View style={styles.divider} />

        {/* ── Bar 3: Current Height ── */}
        <Text style={styles.sectionTitle}>Current Height</Text>
        <UnitToggle
          options={['in', 'cm']}
          selected={heightUnit}
          onSelect={handleHeightUnitChange}
        />
        <RulerPicker
          key={`height-${heightUnit}`}
          min={heightUnit === 'in' ? 36 : 90}
          max={heightUnit === 'in' ? 96 : 250}
          value={currentHeight}
          onValueChange={setCurrentHeight}
          suffix={heightUnit}
        />

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const data = {
              weightUnit,
              heightUnit,
              targetUnit: bottomUnit,
              // legacy key so existing code that reads `unit` still works
              unit: weightUnit,
              currentWeight,
              targetWeight,
              currentHeight,
            };
            try {
              const existing = await AsyncStorage.getItem('mockUserAccount');
              const account = existing ? JSON.parse(existing) : {};
              account.physicalMetrics = data;
              await AsyncStorage.setItem('mockUserAccount', JSON.stringify(account));
            } catch (e) {}

            if (isEditing) {
              router.canGoBack() ? router.back() : router.replace('/settings');
            } else if (isResetting) {
              router.push('/main-goal?fromReset=true');
            } else {
              router.push('/main-goal');
            }
          }}
        >
          <Text style={styles.buttonText}>{isEditing ? 'Done' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5C87A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backPlaceholder: { width: 40 },
  title: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#3D2914' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2914',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#3D2914',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 6,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(70, 46, 21, 0.15)',
    marginVertical: 24,
  },
  tinyToggleWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  tinyToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3D2914',
    overflow: 'hidden',
  },
  tinySegment: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  tinySegmentActive: {
    backgroundColor: '#E8930A',
  },
  tinySegmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3D2914',
  },
  tinySegmentTextActive: {
    color: '#fff',
  },
  rulerContainer: {
    alignItems: 'center',
    height: 140,
    marginVertical: 10,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  rulerValueText: {
    fontSize: 58,
    fontWeight: '400',
    color: '#1A1A1A',
    lineHeight: 64,
  },
  rulerSuffix: {
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  rulerViewport: {
    width: '100%',
    height: 60,
    position: 'relative',
    justifyContent: 'center',
  },
  needle: {
    position: 'absolute',
    top: 5,
    left: '50%',
    marginLeft: -1,
    width: 2,
    height: 50,
    backgroundColor: '#1A1A1A',
    zIndex: 10,
  },
  tickWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 60,
  },
  tickLabel: {
    fontSize: 15,
    color: '#888',
    position: 'absolute',
    top: 0,
    fontWeight: '500',
  },
  tickLine: {
    width: 1,
    backgroundColor: '#a69279',
  },
  tickLineTall: {
    height: 28,
  },
  tickLineShort: {
    height: 16,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#E8930A',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3D2914',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  }
});
