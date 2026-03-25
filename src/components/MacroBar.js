import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function MacroBar({ label, current, target }) {
  const filled = Math.max(current, 0.0001);
  const empty = Math.max(target - current, 0);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label} - {current}/{target}g
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { flex: filled }]} />
        <View style={{ flex: empty }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '500',
  },
  track: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
});
