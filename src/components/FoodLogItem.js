import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function FoodLogItem({ name, calories, imageUri, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Image source={{ uri: imageUri }} style={styles.thumb} />
      <View style={styles.textCol}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.cals}>{calories} cal</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: colors.radiusMd,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  rowPressed: {
    opacity: 0.9,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: colors.track,
  },
  textCol: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  cals: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
