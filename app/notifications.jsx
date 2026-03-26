import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NotificationCard from '../src/components/NotificationCard';
import { colors } from '../src/constants/colors';
import { NOTIFICATIONS } from '../src/constants/mockData';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color={colors.textDark} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATIONS.map((n) => (
          <NotificationCard key={n.id} message={n.message} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 4,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
});
