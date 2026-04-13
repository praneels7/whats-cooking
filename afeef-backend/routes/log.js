const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// POST /log
router.post('/', async (req, res) => {
  const { user_id, meal_name, calories, protein, carbs, fat } = req.body;

  if (!user_id || !meal_name) {
    return res.status(400).json({ error: 'user_id and meal_name are required' });
  }

  const { error } = await supabase
    .from('food_log')
    .insert({ user_id, meal_name, calories, protein, carbs, fat });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: 'Meal logged successfully' });
});

// GET /log/today
router.get('/today', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('food_log')
    .select('*')
    .eq('user_id', user_id)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`);

  if (error) return res.status(400).json({ error: error.message });

  const totalCalories = data.reduce((sum, meal) => sum + (meal.calories || 0), 0);

  res.status(200).json({ meals: data, totalCalories });
});

module.exports = router;