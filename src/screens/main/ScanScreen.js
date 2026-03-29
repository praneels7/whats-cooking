import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert,
} from 'react-native';
import { COLORS } from '../../theme/colors';

const SCAN_MODES = ['Food Scan', 'Bar Code', 'Manual Click'];

export default function ScanScreen({ navigation }) {
  const [mode, setMode] = useState('Food Scan');

  const handleCapture = () => {
    Alert.alert(
      'Scan Complete',
      'Ingredients detected! Showing recipe suggestions.',
      [{ text: 'See Recipes', onPress: () => navigation.navigate('ScanResults', { query: 'chicken' }) }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Camera View */}
        <View style={styles.cameraView}>
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraEmoji}>🍽️</Text>
            <Text style={styles.cameraHint}>Point camera at food or ingredients</Text>
          </View>
          {/* Scan Frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>

        {/* Capture Button */}
        <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        {/* Mode Selector */}
        <View style={styles.modeBar}>
          {SCAN_MODES.map((m) => (
            <TouchableOpacity
              key={m}
              style={styles.modeBtn}
              onPress={() => {
                setMode(m);
                if (m === 'Manual Click') {
                  navigation.navigate('Search');
                }
              }}
            >
              <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, alignItems: 'center', paddingBottom: 30 },
  backBtn: { alignSelf: 'flex-start', padding: 16 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  cameraView: {
    width: '88%',
    aspectRatio: 0.9,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  cameraPlaceholder: { alignItems: 'center' },
  cameraEmoji: { fontSize: 80, marginBottom: 16 },
  cameraHint: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: 20 },
  scanFrame: {
    position: 'absolute',
    width: '65%',
    aspectRatio: 1,
    top: '15%',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.white,
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    marginBottom: 20,
  },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.white, borderWidth: 2, borderColor: '#ccc' },
  modeBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 50,
    padding: 4,
    gap: 4,
  },
  modeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50 },
  modeText: { fontSize: 13, fontWeight: '600', color: COLORS.heading, opacity: 0.6 },
  modeTextActive: { opacity: 1, fontWeight: '800' },
});
