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

export default function HeightWeight() {
  const router = useRouter();
  const { fromSettings, fromReset } = useLocalSearchParams();
  const isEditing = fromSettings === 'true';
  const isResetting = fromReset === 'true';
  const [topTab, setTopTab] = useState('Weight');
  const [globalUnit, setGlobalUnit] = useState('lbs');
  const [bottomUnit, setBottomUnit] = useState('lb');
  
  const [currentWeight, setCurrentWeight] = useState(70);
  const [currentHeight, setCurrentHeight] = useState(170);
  const [targetWeight, setTargetWeight] = useState(70);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const existing = await AsyncStorage.getItem('mockUserAccount');
        if (existing) {
          const account = JSON.parse(existing);
          if (account.physicalMetrics) {
            const m = account.physicalMetrics;
            setGlobalUnit(m.unit || 'lbs');
            setBottomUnit(m.targetUnit || 'lb');
            setCurrentWeight(m.currentWeight || 70);
            setTargetWeight(m.targetWeight || 70);
            setCurrentHeight(m.currentHeight || 170);
          }
        }
      } catch (e) {}
      setIsLoaded(true);
    }
    loadData();
  }, []);

  if (!isLoaded) return null;

  const handleGlobalUnitChange = (newUnit) => {
    if (newUnit === globalUnit) return;
    setGlobalUnit(newUnit);
    if (newUnit === 'kg') {
      setCurrentWeight(prev => Math.max(20, Math.round(prev / 2.20462)));
      setCurrentHeight(prev => Math.max(90, Math.round(prev * 2.54)));
    } else {
      setCurrentWeight(prev => Math.min(400, Math.round(prev * 2.20462)));
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
        
        <Text style={styles.subtitle}>What is your current height and weight?</Text>

        <View style={styles.tinyToggleWrap}>
           <View style={styles.tinyToggle}>
             <Pressable style={[styles.tinySegment, globalUnit === 'lbs' && styles.tinySegmentActive]} onPress={() => handleGlobalUnitChange('lbs')}>
               <Text style={[styles.tinySegmentText, globalUnit === 'lbs' && styles.tinySegmentTextActive]}>
                 {topTab === 'Weight' ? 'lbs' : 'in'}
               </Text>
             </Pressable>
             <Pressable style={[styles.tinySegment, globalUnit === 'kg' && styles.tinySegmentActive]} onPress={() => handleGlobalUnitChange('kg')}>
               <Text style={[styles.tinySegmentText, globalUnit === 'kg' && styles.tinySegmentTextActive]}>
                 {topTab === 'Weight' ? 'kg' : 'cm'}
               </Text>
             </Pressable>
           </View>
        </View>

        <View style={styles.largeToggleOutline}>
          <View style={styles.largeToggleInner}>
            <Pressable style={[styles.largeSegment, topTab === 'Weight' && styles.largeSegmentActive]} onPress={() => setTopTab('Weight')}>
              <Text style={styles.largeSegmentText}>Weight</Text>
            </Pressable>
            <Pressable style={[styles.largeSegment, topTab === 'Height' && styles.largeSegmentActive]} onPress={() => setTopTab('Height')}>
              <Text style={styles.largeSegmentText}>Height</Text>
            </Pressable>
          </View>
        </View>

        {topTab === 'Weight' ? (
           <RulerPicker 
             key={`weight-${globalUnit}`}
             min={globalUnit === 'lbs' ? 40 : 20} 
             max={globalUnit === 'lbs' ? 400 : 200} 
             value={currentWeight} 
             onValueChange={setCurrentWeight} 
             suffix={globalUnit} 
           />
        ) : (
           <RulerPicker 
             key={`height-${globalUnit}`}
             min={globalUnit === 'lbs' ? 36 : 90} 
             max={globalUnit === 'lbs' ? 96 : 250} 
             value={currentHeight} 
             onValueChange={setCurrentHeight} 
             suffix={globalUnit === 'lbs' ? 'in' : 'cm'} 
           />
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Target Weight</Text>
        <Text style={styles.subtitle}>What's your target weight?</Text>

        <View style={styles.largeToggleOutline}>
          <View style={styles.largeToggleInner}>
            <Pressable style={[styles.largeSegment, bottomUnit === 'lb' && styles.largeSegmentActive]} onPress={() => handleBottomUnitChange('lb')}>
              <Text style={styles.largeSegmentText}>lb</Text>
            </Pressable>
            <Pressable style={[styles.largeSegment, bottomUnit === 'kg' && styles.largeSegmentActive]} onPress={() => handleBottomUnitChange('kg')}>
              <Text style={styles.largeSegmentText}>kg</Text>
            </Pressable>
          </View>
        </View>

        <RulerPicker 
          key={`target-${bottomUnit}`}
          min={bottomUnit === 'lb' ? 40 : 20} 
          max={bottomUnit === 'lb' ? 400 : 200} 
          value={targetWeight} 
          onValueChange={setTargetWeight} 
          suffix={bottomUnit} 
        />

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={async () => {
             const data = { unit: globalUnit, targetUnit: bottomUnit, currentWeight, targetWeight, currentHeight };
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
  subtitle: {
    fontSize: 18,
    color: '#3D2914',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2914',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(70, 46, 21, 0.1)',
    marginVertical: 20,
  },
  tinyToggleWrap: {
    alignItems: 'center',
    marginBottom: 10,
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
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  tinySegmentActive: {
    backgroundColor: '#E8930A',
  },
  tinySegmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3D2914',
  },
  tinySegmentTextActive: {
    color: '#fff',
  },
  largeToggleOutline: {
    alignSelf: 'center',
    padding: 3,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#3D2914',
    marginBottom: 20,
  },
  largeToggleInner: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 26,
    overflow: 'hidden',
  },
  largeSegment: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    minWidth: 100,
    alignItems: 'center',
  },
  largeSegmentActive: {
    backgroundColor: '#E8930A',
  },
  largeSegmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D2914',
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
