// routes/stats.js
const express         = require('express')
const { getStats, range, getOrdersChart, getRevenueChart, getRestaurantPerformance } = require('../controllers/statsController')

const router = express.Router()

// Landing → GET /api/stats
router.get('/', getStats)

// Dashboard → GET /api/stats/range?range=day|week|month|year
router.get('/range', range)

// GET /api/stats/orders
router.get('/orders', getOrdersChart)

router.get('/revenue', getRevenueChart)

// GET /api/stats/restaurants?range=day|week|month|year
router.get('/restaurants', getRestaurantPerformance)

module.exports = router
