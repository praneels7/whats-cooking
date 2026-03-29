import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function NotificationCard({ message }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="notifications" size={22} color={colors.white} />
      </View>
      <Text style={styles.body}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: colors.radiusMd,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  body: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
});
