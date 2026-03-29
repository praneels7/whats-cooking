import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: null,
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

  const [foodLog, setFoodLog] = useState([
    { id: '1', name: 'Grilled Chicken', calories: 350, protein: 40, carbs: 0, fats: 8, emoji: '🍗' },
    { id: '2', name: 'Chicken Salad', calories: 240, protein: 22, carbs: 10, fats: 12, emoji: '🥗' },
    { id: '3', name: 'Oat Meal', calories: 180, protein: 6, carbs: 32, fats: 4, emoji: '🥣' },
  ]);

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

  const login = (username, password) => {
    setUser({ username, email: `${username.toLowerCase()}@gmail.com`, avatar: null });
    setIsAuthenticated(true);
  };

  const createAccount = (username, email, password) => {
    setUser({ username, email, avatar: null });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsOnboarded(false);
    setUser({ username: '', email: '', avatar: null });
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  const updateOnboarding = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const addFoodLog = (item) => {
    setFoodLog((prev) => [...prev, { ...item, id: Date.now().toString() }]);
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
