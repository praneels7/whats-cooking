import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.4.233:3000';

export const apiClient = {
  async get(endpoint, options = {}) {
    if (endpoint.startsWith('/mock/')) {
      const parts = endpoint.split('/');
      const resource = parts[2];
      const id = parts[3];

      if (resource === 'stats') {
        return this.getMockStats();
      }

      if (resource === 'foodLog') {
        const logs = await AsyncStorage.getItem('mockFoodLog');
        return this.mockFetch(logs ? JSON.parse(logs) : []);
      }

      if (id && resource === 'recipes') {
        return this.request(`/recipes/${id}`, { method: 'GET' });
      }

      return this.mockFetch([]);
    }
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  async getMockStats() {
    try {
      const uStr = await AsyncStorage.getItem('mockUserAccount');
      const logsStr = await AsyncStorage.getItem('mockFoodLog');
      const logs = logsStr ? JSON.parse(logsStr) : [];

      let goalTotal = 2000;
      let displayName = 'User';

      if (uStr) {
        const user = JSON.parse(uStr);
        displayName = user.username || 'User';
        if (user.mainGoal?.goal === 'Lose Weight') goalTotal = 1800;
        if (user.mainGoal?.goal === 'Gain Weight') goalTotal = 2500;
      }

      const consumed = logs.reduce((sum, item) => sum + (item.calories || 0), 0);
      const proteinConsumed = logs.reduce((sum, item) => sum + (item.protein || 0), 0);
      const carbsConsumed = logs.reduce((sum, item) => sum + (item.carbs || 0), 0);
      const fatsConsumed = logs.reduce((sum, item) => sum + (item.fats || 0), 0);

      const stats = {
        displayName,
        consumed,
        goalTotal,
        remaining: Math.max(0, goalTotal - consumed),
        macros: [
          { key: 'protein', label: 'Protein', current: proteinConsumed, target: 120 },
          { key: 'carbs', label: 'Carbs', current: carbsConsumed, target: 150 },
          { key: 'fats', label: 'Fats', current: fatsConsumed, target: 50 },
        ]
      };
      return this.mockFetch(stats);
    } catch (e) {
      return this.mockFetch({ goalTotal: 2000, consumed: 0, remaining: 2000, macros: [] });
    }
  },

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  },

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error.'
      };
    }
  },

  async mockFetch(mockData, shouldFail = false) {
    await new Promise(resolve => setTimeout(resolve, 150));
    if (shouldFail) {
      return { success: false, error: 'Network timeout.' };
    }
    return { success: true, data: mockData };
  }
};
