import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Button from '../../components/Button';
import { useApp } from '../../context/AppContext';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => 2024 - i);

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

function PickerColumn({ data, selected, onSelect, width }) {
  const scrollRef = useRef(null);
  const selectedIndex = data.indexOf(selected);

  const handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      onSelect(data[index]);
    }
  };

  React.useEffect(() => {
    if (scrollRef.current && selectedIndex >= 0) {
      scrollRef.current.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
    }
  }, []);

  return (
    <View style={[styles.pickerColumn, { width }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
      >
        {data.map((item, idx) => {
          const isSelected = item === selected;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
              onPress={() => {
                onSelect(item);
                scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
              }}
            >
              <Text style={[styles.pickerText, isSelected && styles.pickerTextSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.selectionIndicator} pointerEvents="none" />
    </View>
  );
}

export default function DateOfBirthScreen({ navigation }) {
  const { updateOnboarding } = useApp();
  const [month, setMonth] = useState('January');
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(2000);

  const handleNext = () => {
    updateOnboarding({ dob: { month, day, year } });
    navigation.navigate('HeightWeight');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Date of Birth</Text>
        <Text style={styles.subtitle}>Enter your date of birth</Text>

        <View style={styles.pickers}>
          <PickerColumn data={MONTHS} selected={month} onSelect={setMonth} width={130} />
          <PickerColumn data={DAYS} selected={day} onSelect={setDay} width={70} />
          <PickerColumn data={YEARS} selected={year} onSelect={setYear} width={90} />
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
  title: { fontSize: 24, fontWeight: '800', color: COLORS.heading, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: COLORS.heading, textAlign: 'center', marginBottom: 24, opacity: 0.8 },
  pickers: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  pickerColumn: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    position: 'relative',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  pickerItemSelected: {},
  pickerText: {
    fontSize: 16,
    color: 'rgba(45,21,0,0.4)',
    fontWeight: '400',
  },
  pickerTextSelected: {
    fontSize: 18,
    color: COLORS.heading,
    fontWeight: '700',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: COLORS.heading,
    borderRadius: 4,
  },
  btn: { marginTop: 20 },
});
