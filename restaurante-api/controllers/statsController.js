// controllers/statsController.js
const Orden         = require('../models/Orden')
const Resena        = require('../models/Resena')
const Usuario       = require('../models/Usuario')
const ArticuloMenu  = require('../models/ArticuloMenu')

/**
 * GET /api/stats
 * Datos para el landing
 */
exports.getStats = async (req, res) => {
  try {
    const totalItems  = await ArticuloMenu.countDocuments()
    const totalDishes = Math.max(totalItems - 10, 0)
    const [ratingResult] = await Resena.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$calificacion' } } }
    ])
    const avgRating = parseFloat((ratingResult?.avgRating || 0).toFixed(1))
    const totalUsers = await Usuario.countDocuments()

    return res.json({
      avgRating,
      totalUsers,
      totalDishes
    })
  } catch (error) {
    console.error('Error en getStats:', error)
    return res.status(500).json({ message: 'No se pudieron obtener las estadísticas' })
  }
}

/**
 * GET /api/stats/range?range=day|week|month|year
 * Datos para el dashboard (StatCards)
 */
exports.range = async (req, res, next) => {
  try {
    const range = req.query.range || 'week'
    const now   = new Date()
    let start

    switch (range) {
      case 'day':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        break
      case 'week':
        start = new Date(now); start.setDate(now.getDate() - 7)
        break
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'year':
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default:
        start = new Date(0)
    }

    // Período actual
    const [revAgg] = await Orden.aggregate([
      { $match: { fecha: { $gte: start } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const revenue       = revAgg?.total    || 0
    const ordersCount   = await Orden.countDocuments({ fecha: { $gte: start } })
    const custIds       = await Orden.distinct('usuarioId', { fecha: { $gte: start } })
    const customers     = custIds.length
    const [ratAgg]      = await Resena.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, avg: { $avg: '$calificacion' } } }
    ])
    const avgRating     = ratAgg?.avg     || 0

    // Período anterior
    let prevStart = new Date(start)
    switch (range) {
      case 'day':   prevStart.setDate(start.getDate() - 1);   break
      case 'week':  prevStart.setDate(start.getDate() - 7);   break
      case 'month': prevStart.setMonth(start.getMonth() - 1); break
      case 'year':  prevStart.setFullYear(start.getFullYear() - 1); break
      default:      prevStart = new Date(0)
    }

    const [prevRevAgg] = await Orden.aggregate([
      { $match: { fecha: { $gte: prevStart, $lt: start } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const prevRevenue       = prevRevAgg?.total    || 0
    const prevOrdersCount   = await Orden.countDocuments({ fecha: { $gte: prevStart, $lt: start } })
    const prevCustIds       = await Orden.distinct('usuarioId', { fecha: { $gte: prevStart, $lt: start } })
    const prevCustomers     = prevCustIds.length
    const [prevRatAgg]      = await Resena.aggregate([
      { $match: { createdAt: { $gte: prevStart, $lt: start } } },
      { $group: { _id: null, avg: { $avg: '$calificacion' } } }
    ])
    const prevAvgRating     = prevRatAgg?.avg    || 0

    const pct = (curr, prev) =>
      prev === 0 ? 0 : parseFloat(((curr - prev) / prev * 100).toFixed(1))

    return res.json({
      revenue:   { value: revenue,    change: pct(revenue,    prevRevenue) },
      orders:    { value: ordersCount,change: pct(ordersCount,prevOrdersCount) },
      customers: { value: customers,  change: pct(customers,  prevCustomers) },
      rating:    { value: parseFloat(avgRating.toFixed(1)), change: parseFloat((avgRating - prevAvgRating).toFixed(1)) }
    })
  } catch (err) {
    next(err)
  }
}
