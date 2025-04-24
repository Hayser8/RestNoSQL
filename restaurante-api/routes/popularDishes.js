// routes/popularDishes.js
const express = require('express');
const { getPopularDishes } = require('../controllers/popularDishesController');

const router = express.Router();

// GET /api/popular-dishes — devuelve los 3 platos más pedidos
router.get('/', getPopularDishes);

module.exports = router;
