import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import api from '../api/api';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: null,
    user_id: null,
    token: null,
  });
  const [onboardingData, setOnboardingData] = useState({
    dob: { month: 'January', day: 1, year: 2000 },
    heightUnit: 'lbs',
    weightUnit: 'lbs',
    weight: 70,
    height: 170,
    targetWeight: 65,
    goal: 'Lose Weight',
    goalSpeed: 20,
    goalSpeedUnit: 'Weeks',
    activityLevel: 'Rarely Active — 0–1 workouts per week',
    struggles: [],
  });
  const [foodLog, setFoodLog] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: '1', text: "You exceeded your calorie limit! Please ensure you're following your selected diet." },
    { id: '2', text: "You met your daily activity goal! Keep up the good work!" },
    { id: '3', text: "You exceeded your calorie limit! Please ensure you're following your selected diet." },
    { id: '4', text: "You exceeded your calorie limit! Please ensure you're following your selected diet." },
    { id: '5', text: "You met your daily activity goal! Keep up the good work!" },
    { id: '6', text: "You exceeded your calorie limit! Please ensure you're following your selected diet." },
    { id: '7', text: "You exceeded your calorie limit! Please ensure you're following your selected diet." },
  ]);

  const calorieGoal = 4331;
  const consumed = foodLog.reduce((sum, item) => sum + item.calories, 0);
  const remaining = calorieGoal - consumed;
  const macroGoal = { protein: 120, carbs: 150, fats: 50 };
  const macrosConsumed = {
    protein: foodLog.reduce((s, i) => s + i.protein, 0),
    carbs: foodLog.reduce((s, i) => s + i.carbs, 0),
    fats: foodLog.reduce((s, i) => s + i.fats, 0),
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      setUser({
        username: userData.email.split('@')[0],
        email: userData.email,
        avatar: null,
        user_id: userData.id,
        token,
      });
      setIsAuthenticated(true);
      await fetchTodayLog(userData.id);
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Something went wrong');
    }
  };

  const createAccount = async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { email, password });
      setUser({
        username,
        email,
        avatar: null,
        user_id: response.data.user?.id,
        token: null,
      });
      setIsAuthenticated(true);
    } catch (error) {
      Alert.alert('Signup Failed', error.response?.data?.error || 'Something went wrong');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsOnboarded(false);
    setUser({ username: '', email: '', avatar: null, user_id: null, token: null });
    setFoodLog([]);
  };

  const completeOnboarding = async () => {
    try {
      const dobString = `${onboardingData.dob.year}-${String(new Date(Date.parse(onboardingData.dob.month + ' 1')).getMonth() + 1).padStart(2, '0')}-${String(onboardingData.dob.day).padStart(2, '0')}`;
      await api.post('/user/profile', {
        user_id: user.user_id,
        dob: dobString,
        height: onboardingData.height,
        weight: onboardingData.weight,
        goal: onboardingData.goal,
        activity_level: onboardingData.activityLevel,
        daily_cal_target: calorieGoal,
      });
      setIsOnboarded(true);
    } catch (error) {
      console.log('Onboarding save error:', error.response?.data?.error);
      setIsOnboarded(true);
    }
  };

  const updateOnboarding = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const fetchTodayLog = async (userId) => {
    try {
      const id = userId || user.user_id;
      const response = await api.get(`/log/today?user_id=${id}`);
      const meals = response.data.meals.map((meal) => ({
        id: meal.id.toString(),
        name: meal.meal_name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fat,
        emoji: '🍽️',
      }));
      setFoodLog(meals);
    } catch (error) {
      console.log('Error fetching food log:', error);
    }
  };

  const addFoodLog = async (item) => {
    try {
      await api.post('/log', {
        user_id: user.user_id,
        meal_name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fats,
      });
      await fetchTodayLog();
    } catch (error) {
      console.log('Error logging meal:', error);
    }
  };

  const searchRecipes = async (ingredients) => {
    try {
      const response = await api.post('/recipes/search', { ingredients });
      return response.data;
    } catch (error) {
      console.log('Error searching recipes:', error.message);
      return [];
    }
  };

  const getRecipeDetails = async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.log('Error fetching recipe:', error);
      return null;
    }
  };

  const updateProfile = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isOnboarded,
        user,
        onboardingData,
        foodLog,
        notifications,
        calorieGoal,
        consumed,
        remaining,
        macroGoal,
        macrosConsumed,
        login,
        createAccount,
        logout,
        completeOnboarding,
        updateOnboarding,
        addFoodLog,
        fetchTodayLog,
        searchRecipes,
        getRecipeDetails,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
