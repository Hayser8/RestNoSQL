// routes/export.js
const express = require('express')
const { exportDashboard } = require('../controllers/exportController')
const { protect, restrictTo } = require('../middlewares/auth')

const router = express.Router()

// Solo admin
router.get(
  '/dashboard',
  protect,
  restrictTo('admin'),
  exportDashboard
)

module.exports = router
