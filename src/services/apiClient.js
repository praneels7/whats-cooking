import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.example.com';

// Fallback static data for demonstration if AsyncStorage is empty
const DB = {
  recipes: [
    {
      id: '1',
      name: 'Grilled Chicken',
      calories: 350,
      weight: '400g',
      servings: '2 Plate',
      protein: 40,
      carbs: 0,
      fats: 8,
      proteinGoal: 120,
      carbsGoal: 150,
      fatsGoal: 50,
      emoji: '🍗',
      color: '#8B4513',
      imageUri: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop',
      ingredients: '2 boneless chicken breasts, 1 tablespoon olive oil, 1 teaspoon garlic powder, 1 teaspoon paprika, ½ teaspoon salt, ½ teaspoon black pepper, ½ teaspoon dried oregano, ½ teaspoon onion powder, 1 tablespoon lemon juice',
      instructions: [
        'Preheat the grill to medium-high heat (about 400°F / 200°C).',
        'Pat the chicken breasts dry with a paper towel.',
        'In a small bowl, mix olive oil, garlic powder, paprika, salt, black pepper, oregano, onion powder, and lemon juice.',
        'Rub the seasoning mixture evenly over both sides of the chicken breasts.',
        'Place the chicken on the hot grill and cook for 6–7 minutes on the first side.',
        'Flip the chicken and grill for another 6–7 minutes, or until the internal temperature reaches 165°F (74°C).',
        'Remove the chicken from the grill and let it rest for 3–5 minutes before serving.',
        'Slice and serve warm. Optionally garnish with fresh parsley or a squeeze of lemon.',
      ],
    },
    {
      id: '2',
      name: 'Chicken Salad',
      calories: 240,
      weight: '300g',
      servings: '1 Bowl',
      protein: 28,
      carbs: 12,
      fats: 10,
      proteinGoal: 120,
      carbsGoal: 150,
      fatsGoal: 50,
      emoji: '🥗',
      color: '#4A7C3F',
      imageUri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
      ingredients: '2 cooked chicken breasts (shredded), 2 cups mixed greens, 1 cup cherry tomatoes, ½ cucumber sliced, ¼ red onion thinly sliced, 2 tablespoons olive oil, 1 tablespoon lemon juice, salt and pepper to taste',
      instructions: [
        'Cook and shred the chicken breasts.',
        'Combine mixed greens, cherry tomatoes, cucumber, and red onion in a large bowl.',
        'Add the shredded chicken on top.',
        'Whisk together olive oil, lemon juice, salt and pepper.',
        'Drizzle dressing over the salad and toss gently.',
      ],
    },
    {
      id: '3',
      name: 'Pan-Seared Salmon',
      calories: 410,
      weight: '250g',
      servings: '1 Plate',
      protein: 34,
      carbs: 0,
      fats: 22,
      proteinGoal: 120,
      carbsGoal: 150,
      fatsGoal: 50,
      emoji: '🐟',
      color: '#FA8072',
      imageUri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
      ingredients: '2 salmon fillets, 1 tablespoon olive oil, ½ lemon (juiced), 2 cloves garlic (minced), salt, black pepper, fresh dill',
      instructions: [
        'Pat salmon dry and season with salt and pepper.',
        'Heat olive oil in a skillet over medium-high heat.',
        'Place salmon skin-side up and sear for 4 minutes until golden crust forms.',
        'Flip the fillets, add garlic and lemon juice.',
        'Cook for 3 more minutes. Garnish with fresh dill and serve.',
      ],
    },
  ],
  foodLog: [],
  notifications: [
    { id: '1', message: "Welcome to What's Cooking! Log your first meal to get started." },
    { id: '2', message: "Tip: Drinking water after a meal helps with digestion." },
  ]
};

export const apiClient = {
  async get(endpoint, options = {}) {
    if (endpoint.startsWith('/mock/')) {
      const parts = endpoint.split('/');
      const resource = parts[2];
      const id = parts[3];
      
      if (id && resource === 'recipes') {
        const item = DB.recipes.find(r => r.id === id);
        return this.mockFetch(item || null);
      }

      if (resource === 'stats') {
        return this.getMockStats();
      }

      if (resource === 'foodLog') {
        const logs = await AsyncStorage.getItem('mockFoodLog');
        return this.mockFetch(logs ? JSON.parse(logs) : DB.foodLog);
      }
      
      return this.mockFetch(DB[resource]);
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
        // Simple heuristic: if goal is weight loss, lower calories
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
