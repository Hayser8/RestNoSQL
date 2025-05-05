// routes/stats.js
const express         = require('express')
const { getStats, range } = require('../controllers/statsController')

const router = express.Router()

// Landing → GET /api/stats
router.get('/', getStats)

// Dashboard → GET /api/stats/range?range=day|week|month|year
router.get('/range', range)

module.exports = router
