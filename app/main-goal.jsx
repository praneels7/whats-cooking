import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const GOALS = ['Lose Weight', 'Gain Weight', 'Maintain Weight'];

export default function MainGoal() {
  const router = useRouter();
  const { fromSettings, fromReset } = useLocalSearchParams();
  const isEditing = fromSettings === 'true';
  const isResetting = fromReset === 'true';
  const [selectedGoal, setSelectedGoal] = useState('Lose Weight');
  const [speedUnit, setSpeedUnit] = useState('Weeks');
  const [speedValue, setSpeedValue] = useState(20);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const existing = await AsyncStorage.getItem('mockUserAccount');
        if (existing) {
          const account = JSON.parse(existing);
          if (account.mainGoal) {
            setSelectedGoal(account.mainGoal.selectedGoal || 'Lose Weight');
            setSpeedUnit(account.mainGoal.speedUnit || 'Weeks');
            setSpeedValue(account.mainGoal.speedValue || 20);
          }
        }
      } catch(e) {}
      setIsLoaded(true);
    }
    loadData();
  }, []);

  if (!isLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/height-weight')} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#3D2914" />
        </Pressable>
        <Text style={styles.title}>Main Goal</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>What's your main goal right now?</Text>

        <View style={styles.goalsContainer}>
          {GOALS.map((goal) => {
            const isSelected = selectedGoal === goal;
            return (
              <Pressable 
                key={goal} 
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                onPress={() => setSelectedGoal(goal)}
              >
                <Text style={styles.goalText}>{goal}</Text>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.subtitle, styles.speedTitle]}>How quickly would you like to reach your goal?</Text>

        <View style={styles.toggleOutline}>
          <View style={styles.toggleInner}>
            <Pressable style={[styles.segment, speedUnit === 'Weeks' && styles.segmentActive]} onPress={() => { setSpeedUnit('Weeks'); setSpeedValue(20); }}>
              <Text style={styles.segmentText}>Weeks</Text>
            </Pressable>
            <Pressable style={[styles.segment, speedUnit === 'Months' && styles.segmentActive]} onPress={() => { setSpeedUnit('Months'); setSpeedValue(6); }}>
              <Text style={styles.segmentText}>Months</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sliderSection}>
          <View style={styles.iconRow}>
            <MaterialCommunityIcons name="snail" size={28} color="white" />
            <MaterialCommunityIcons name="rabbit" size={28} color="white" />
          </View>

          <Slider
            style={styles.slider}
            minimumValue={speedUnit === 'Weeks' ? 10 : 1}
            maximumValue={speedUnit === 'Weeks' ? 30 : 12}
            step={1}
            value={speedValue}
            onValueChange={setSpeedValue}
            minimumTrackTintColor="#E8930A"
            maximumTrackTintColor="#ffffff"
            thumbTintColor="#E8930A"
          />

          <View style={styles.labelsRow}>
            <Text style={styles.sliderLabel}>{speedUnit === 'Weeks' ? '10' : '1'}</Text>
            <Text style={styles.sliderLabel}>{speedUnit === 'Weeks' ? '20' : '6'}</Text>
            <Text style={styles.sliderLabel}>{speedUnit === 'Weeks' ? '30' : '12'}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={styles.button}
          onPress={async () => {
             try {
               const data = { selectedGoal, speedUnit, speedValue };
               const existing = await AsyncStorage.getItem('mockUserAccount');
               const account = existing ? JSON.parse(existing) : {};
               account.mainGoal = data;
               await AsyncStorage.setItem('mockUserAccount', JSON.stringify(account));
             } catch (e) {}

             if (isEditing) { router.canGoBack() ? router.back() : router.replace('/settings'); }
             else if (isResetting) router.push('/activity-level?fromReset=true');
             else router.push('/activity-level');
          }} 
        >
          <Text style={styles.buttonText}>{isEditing ? 'Done' : 'Next'}</Text>
        </Pressable>
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
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#3D2914' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#3D2914',
    textAlign: 'center',
    marginBottom: 20,
  },
  speedTitle: {
    marginTop: 30,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: '#E8930A',
  },
  goalText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  checkBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#E8930A',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F5C87A',
  },
  toggleOutline: {
    alignSelf: 'center',
    padding: 3,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#3D2914',
    marginBottom: 30,
  },
  toggleInner: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 26,
    overflow: 'hidden',
  },
  segment: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    minWidth: 120,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#E8930A',
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D2914',
  },
  sliderSection: {
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: -10, 
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
