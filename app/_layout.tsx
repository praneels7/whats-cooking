import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth */}
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />

      {/* Onboarding */}
      <Stack.Screen name="setup-plan" />
      <Stack.Screen name="dob" />
      <Stack.Screen name="height-weight" />
      <Stack.Screen name="main-goal" />
      <Stack.Screen name="activity-level" />
      <Stack.Screen name="struggles" />

      {/* Main App */}
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="search" />
      <Stack.Screen name="scan" />
      <Stack.Screen name="scan-results" />
      <Stack.Screen name="selected-recipe" />
      <Stack.Screen name="instructions" />
      <Stack.Screen name="log-it" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
