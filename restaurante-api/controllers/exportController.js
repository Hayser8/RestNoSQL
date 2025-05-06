// controllers/exportController.js
const { Parser } = require('json2csv')
const statsController = require('./statsController')
const Orden            = require('../models/Orden')
const Restaurante      = require('../models/Restaurante')
const Resena           = require('../models/Resena')

/**
 * GET /api/export/dashboard?range=day|week|month|year
 * Genera un CSV con secciones:
 * 1) StatCards (revenue, orders, customers, rating)
 * 2) OrdersChart (completados, pendientes, cancelados)
 * 3) RevenueChart (ingresos)
 * 4) RestaurantPerformance
 * 5) ReviewStats
 */
exports.exportDashboard = async (req, res, next) => {
  try {
    const range = req.query.range || 'week'
    // 1) obtenemos todos los datos reutilizando los controllers existentes
    const stats    = await statsController._rangeData(range)     // _rangeData devuelve objeto JS
    const ordersCh = await statsController._ordersChartData(range)
    const revCh    = await statsController._revenueChartData(range)
    const perf     = await statsController._restaurantPerfData(range)
    const rvStats  = await require('./reviewStatsController')._getReviewStatsData(range)

    // 2) convertimos cada sección a CSV
    const sections = []

    // StatCards
    sections.push({
      name: 'Stats',
      data: Object.entries(stats).map(([k, v]) => ({
        metric: k,
        value: v.value ?? v,
        change: v.change ?? ''
      }))
    })
    // OrdersChart
    sections.push({ name: 'OrdersChart', data: ordersCh })
    // RevenueChart
    sections.push({ name: 'RevenueChart', data: revCh })
    // RestaurantPerformance
    sections.push({ name: 'RestPerformance', data: perf })
    // ReviewStats (distribution)
    const dist = Object.entries(rvStats.distribution).map(([rating, cnt]) => ({
      rating, count: cnt
    }))
    sections.push({ name: 'ReviewsDist', data: dist })
    sections.push({ name: 'ReviewsSummary', data: [{ total: rvStats.total, average: rvStats.average }] })

    // 3) para cada sección generamos csv
    let csvAll = ''
    for (const sect of sections) {
      if (!sect.data.length) continue
      const parser = new Parser({ fields: Object.keys(sect.data[0]) })
      csvAll += `\n\n# --- ${sect.name} ---\n`
      csvAll += parser.parse(sect.data) + '\n'
    }

    // 4) devolvemos como attachment
    const filename = `dashboard_export_${range}_${Date.now()}.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(csvAll)
  } catch (err) {
    next(err)
  }
}
