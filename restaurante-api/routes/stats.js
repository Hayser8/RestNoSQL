// routes/stats.js
const express = require('express');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

// GET /api/stats — devuelve { avgRating, totalUsers, totalDishes }
router.get('/', getStats);

module.exports = router;
