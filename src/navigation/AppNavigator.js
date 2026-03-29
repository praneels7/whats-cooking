import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';

// Onboarding
import DisciplineScreen from '../screens/onboarding/DisciplineScreen';
import DateOfBirthScreen from '../screens/onboarding/DateOfBirthScreen';
import HeightWeightScreen from '../screens/onboarding/HeightWeightScreen';
import GoalsScreen from '../screens/onboarding/GoalsScreen';
import ActivityLevelScreen from '../screens/onboarding/ActivityLevelScreen';
import StrugglesScreen from '../screens/onboarding/StrugglesScreen';

// Main
import DashboardScreen from '../screens/main/DashboardScreen';
import SearchScreen from '../screens/main/SearchScreen';
import ScanScreen from '../screens/main/ScanScreen';
import ScanResultsScreen from '../screens/main/ScanResultsScreen';
import SelectedRecipeScreen from '../screens/main/SelectedRecipeScreen';
import InstructionsScreen from '../screens/main/InstructionsScreen';
import LogItScreen from '../screens/main/LogItScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  const icons = { Home: '🏠', Scan: '⊙', Settings: '⚙️' };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[name]}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ScanResults" component={ScanResultsScreen} />
      <Stack.Screen name="SelectedRecipe" component={SelectedRecipeScreen} />
      <Stack.Screen name="Instructions" component={InstructionsScreen} />
      <Stack.Screen name="LogIt" component={LogItScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Discipline" component={DisciplineScreen} />
      <Stack.Screen name="DateOfBirth" component={DateOfBirthScreen} />
      <Stack.Screen name="HeightWeight" component={HeightWeightScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} />
      <Stack.Screen name="Struggles" component={StrugglesScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isOnboarded } = useApp();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : !isOnboarded ? (
        <OnboardingStack />
      ) : (
        <MainStack />
      )}
    </NavigationContainer>
  );
}
