const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// POST /user/profile
router.post('/profile', async (req, res) => {
  const { user_id, dob, height, weight, goal, activity_level, daily_cal_target } = req.body;

  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  const { error } = await supabase
    .from('Profiles')
    .insert({ user_id, dob, height, weight, goal, activity_level, daily_cal_target });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: 'Profile saved successfully' });
});

// GET /user/profile
router.get('/profile', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  const { data, error } = await supabase
    .from('Profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

module.exports = router;