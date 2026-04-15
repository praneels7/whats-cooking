import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors as COLORS } from '../src/constants/colors';

const SCAN_MODES = ['Food Scan', 'Bar Code', 'Manual'];

export default function ScanScreen() {
  const router = useRouter();
  const [mode, setMode] = useState('Food Scan');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleCapture = () => {
    if (mode === 'Manual') {
      router.replace('/search');
      return;
    }
    if (mode === 'Food Scan') {
      router.push({ pathname: '/search' });
      return;
    }
  };

  const handleModeChange = (m) => {
    setMode(m);
    setScanned(false);
    if (m === 'Manual') {
      router.replace('/search');
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    Alert.alert('Barcode Scanned', `Code: ${data}`, [
      {
        text: 'Search Recipes',
        onPress: () => {
          setScanned(false);
          router.push({ pathname: '/scan-results', params: { query: data } });
        }
      },
      {
        text: 'Scan Again',
        onPress: () => setScanned(false),
      }
    ]);
  };

  if (!permission) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={styles.permText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={styles.permText}>Camera access is required for scanning.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')}
          style={styles.backBtn}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Camera View */}
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={mode === 'Bar Code' ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
            }}
          >
            {/* Scan Frame Overlay */}
            <View style={styles.overlay}>
              <View style={[styles.scanFrame, mode === 'Bar Code' && styles.scanFrameBar]}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.cameraHint}>
                {mode === 'Food Scan' ? 'Point camera at food or a dish' :
                 mode === 'Bar Code' ? 'Point camera at a product barcode' :
                 'Search by name or ingredient'}
              </Text>
            </View>
          </CameraView>
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
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => handleModeChange(m)}
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
  container: { flex: 1, alignItems: 'center', paddingBottom: 20 },
  center: { alignItems: 'center', justifyContent: 'center' },
  backBtn: { alignSelf: 'flex-start', padding: 16 },
  back: { fontSize: 26, color: COLORS.heading, fontWeight: '300' },
  cameraWrapper: {
    width: '88%',
    flex: 1,
    minHeight: 180,
    maxHeight: 340,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: '65%',
    aspectRatio: 1,
    position: 'relative',
    marginBottom: 16,
  },
  scanFrameBar: {
    aspectRatio: 2,
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
  cameraHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 6,
    borderRadius: 8,
  },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    marginBottom: 20,
  },
  captureInner: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.white, borderWidth: 2, borderColor: '#ccc',
  },
  modeBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 50, padding: 4, gap: 4,
  },
  modeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50 },
  modeBtnActive: { backgroundColor: COLORS.accent },
  modeText: { fontSize: 13, fontWeight: '600', color: COLORS.heading, opacity: 0.6 },
  modeTextActive: { color: COLORS.white, opacity: 1, fontWeight: '800' },
  permText: { fontSize: 16, color: COLORS.heading, textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 },
  permBtn: { backgroundColor: COLORS.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  permBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
