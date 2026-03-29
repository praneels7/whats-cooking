import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function SetupPlan() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.spacer} />
        
        <Text style={styles.title}>
          Set Up Your{'\n'}Personalized Plan
        </Text>
        
        <Text style={styles.bodyText}>
          Build strength, fuel your mind, and develop discipline. We combine healthy eating and active living into a strategy tailored perfectly to your body, goals, and lifestyle
        </Text>
        
        <Text style={styles.bodyTextSmall}>
          Answer a few quick questions so we can calculate your personalized calories and macros!
        </Text>

        <View style={styles.spacer} />

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/dob')}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5C87A', // peach
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D2914', // dark brown
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 34,
  },
  bodyText: {
    fontSize: 15,
    color: '#3D2914',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  bodyTextSmall: {
    fontSize: 15,
    color: '#3D2914',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  progressBarContainer: {
    height: 4,
    width: 60,
    backgroundColor: 'rgba(223, 158, 66, 0.3)',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressBarFill: {
    width: '40%',
    height: '100%',
    backgroundColor: '#E8930A',
    borderRadius: 2,
  },
  button: {
    backgroundColor: '#E8930A',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3D2914',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  }
});
