import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DOB() {
  const router = useRouter();
  const [date, setDate] = useState(new Date(2000, 0, 1));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/setup-plan')} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#3D2914" />
        </Pressable>
        <Text style={styles.title}>Date of Birth</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Enter your date of birth</Text>
        
        <View style={styles.pickerContainer}>
          {Platform.OS === 'web' ? (
             <input 
               type="date" 
               value={date ? date.toISOString().split('T')[0] : ''}
               onChange={(e) => {
                 if (e.target.value) {
                   const parsed = new Date(e.target.value);
                   if (!isNaN(parsed.getTime())) {
                     setDate(parsed);
                   }
                 }
               }}
               style={webStyle.input}
             />
          ) : (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
              textColor="#3D2914"
              style={styles.datePicker}
            />
          )}
        </View>

      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/height-weight')}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const webStyle = {
  input: {
    padding: 10,
    borderRadius: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#3D2914',
    backgroundColor: 'white',
    color: '#3D2914',
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5C87A', // peach
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#3D2914', // dark brown
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#3D2914',
    textAlign: 'center',
    marginBottom: 40,
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 200,
  },
  datePicker: {
    width: 320,
    height: 200,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
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
