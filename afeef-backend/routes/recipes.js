const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// POST /recipes/search
router.post('/search', async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients) return res.status(400).json({ error: 'ingredients are required' });

  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${process.env.SPOONACULAR_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json(data);
});

// GET /recipes/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${process.env.SPOONACULAR_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json(data);
});

module.exports = router;