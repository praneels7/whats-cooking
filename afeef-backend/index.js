const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipes');
const logRoutes = require('./routes/log');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/recipes', recipeRoutes);
app.use('/log', logRoutes);

app.get('/', (req, res) => {
  res.send('WhatsCooking backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});