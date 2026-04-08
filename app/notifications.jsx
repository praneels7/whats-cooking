import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NotificationCard from '../src/components/NotificationCard';
import { colors as COLORS } from '../src/constants/colors';
import { apiClient } from '../src/services/apiClient';
import { useApi } from '../src/hooks/useApi';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function NotificationsScreen() {
  const router = useRouter();
  const { data: notifications, execute: fetchNotifications } = useApi(() => apiClient.get('/mock/notifications'));

  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.canGoBack() ? router.back() : router.replace('/dashboard')}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color={COLORS.textDark} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {(notifications || []).map((n) => (
          <NotificationCard key={n.id} message={n.message} />
        ))}
        {(!notifications || notifications.length === 0) && (
          <Text style={styles.emptyText}>No notifications for today!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.textDark,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textDark,
    opacity: 0.6,
    marginTop: 40,
    fontSize: 16,
  },
});
