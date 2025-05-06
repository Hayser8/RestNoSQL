// routes/popularDishes.js
const express = require('express')
const { protect, restrictTo } = require('../middlewares/auth')
const {
  getPopularDishes,
  getPopularDishesRange
} = require('../controllers/popularDishesController')

const router = express.Router()

// Para landing (sin auth)
router.get('/', getPopularDishes)

// Para dashboard (solo admin)
router.get(
  '/range',
  protect,
  restrictTo('admin'),
  getPopularDishesRange
)

module.exports = router
