// controllers/statsController.js
const Orden         = require('../models/Orden')
const Resena        = require('../models/Resena')
const Usuario       = require('../models/Usuario')
const ArticuloMenu  = require('../models/ArticuloMenu')
const Restaurante = require('../models/Restaurante')

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
      { $match: { fecha: { $gte: start } } },
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
      { $match: { fecha: { $gte: prevStart, $lt: start } } },
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


/**
 * GET /api/stats/orders?range=day|week|month|year
 * Devuelve un array de objetos { time, completados, pendientes, cancelados }
 * Listo para pasar a Recharts.
 */
exports.getOrdersChart = async (req, res, next) => {
  try {
    const range = req.query.range || 'week'
    const now   = new Date()
    let start

    switch (range) {
      case 'day':
        start = new Date(now.getTime() - 24*60*60*1000)
        break
      case 'week':
        start = new Date(now.getTime() - 7*24*60*60*1000)
        break
      case 'month':
        start = new Date(now.getTime() - 28*24*60*60*1000)
        break
      case 'year':
        start = new Date(now.getFullYear(), 0, 1)
        break
      default:
        start = new Date(0)
    }

    // 1) Agrupar según el rango
    let raw = []
    if (range === 'day') {
      // Agrupar por hora
      raw = await Orden.aggregate([
        { $match: { fecha: { $gte: start } } },
        { $project: {
            hour: { $hour: '$fecha' },
            estado: 1
          }
        },
        { $group: {
            _id: { hour: '$hour', estado: '$estado' },
            count: { $sum: 1 }
          }
        }
      ])
      // Inicializar 24 horas
      const result = Array.from({ length: 24 }, (_, h) => ({
        time: `${h}:00`,
        completados: 0,
        pendientes: 0,
        cancelados: 0
      }))
      raw.forEach(r => {
        const idx = r._id.hour
        const ct  = r.count
        if (r._id.estado === 'entregado') result[idx].completados = ct
        else if (r._id.estado === 'cancelado') result[idx].cancelados = ct
        else result[idx].pendientes += ct
      })
      return res.json(result)
    }

    if (range === 'week') {
      // Agrupar por día de la semana (0=Lun ...6=Dom)
      raw = await Orden.aggregate([
        { $match: { fecha: { $gte: start } } },
        { $project: {
            dow: { $subtract: [ { $dayOfWeek: '$fecha' }, 2 ] }, // Mon=0 ... Sun=6
            estado: 1
          }
        },
        { $addFields: {
            dow: { $cond: [ { $lt: ['$dow', 0] }, 6, '$dow' ] }
          }
        },
        { $group: {
            _id: { dow: '$dow', estado: '$estado' },
            count: { $sum: 1 }
          }
        }
      ])
      const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
      const result = days.map(d => ({
        time: d,
        completados: 0,
        pendientes: 0,
        cancelados: 0
      }))
      raw.forEach(r => {
        const idx = r._id.dow
        const ct  = r.count
        if (r._id.estado === 'entregado') result[idx].completados = ct
        else if (r._id.estado === 'cancelado') result[idx].cancelados = ct
        else result[idx].pendientes += ct
      })
      return res.json(result)
    }

    if (range === 'month') {
      // Agrupar en semanas desde start (0..3)
      raw = await Orden.aggregate([
        { $match: { fecha: { $gte: start } } },
        { $project: {
            diff: { $subtract: ['$$NOW', '$fecha'] },
            estado: 1
          }
        },
        { $addFields: {
            weekIdx: { $floor: { $divide: ['$diff', 1000*60*60*24*7] } }
          }
        },
        { $group: {
            _id: { weekIdx: '$weekIdx', estado: '$estado' },
            count: { $sum: 1 }
          }
        }
      ])
      const result = Array.from({ length: 4 }, (_, i) => ({
        time: `Semana ${4 - i}`, // invertimos para mostrar cronológico
        completados: 0,
        pendientes: 0,
        cancelados: 0
      }))
      raw.forEach(r => {
        const idx = 3 - r._id.weekIdx
        if (idx >= 0 && idx < 4) {
          const ct = r.count
          if (r._id.estado === 'entregado') result[idx].completados = ct
          else if (r._id.estado === 'cancelado') result[idx].cancelados = ct
          else result[idx].pendientes += ct
        }
      })
      return res.json(result)
    }

    if (range === 'year') {
      // Agrupar por mes 1..12
      raw = await Orden.aggregate([
        { $match: { fecha: { $gte: start } } },
        { $project: {
            m: { $month: '$fecha' },
            estado: 1
          }
        },
        { $group: {
            _id: { m: '$m', estado: '$estado' },
            count: { $sum: 1 }
          }
        }
      ])
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
      const result = months.map(m => ({
        time: m,
        completados: 0,
        pendientes: 0,
        cancelados: 0
      }))
      raw.forEach(r => {
        const idx = r._id.m - 1
        const ct  = r.count
        if (r._id.estado === 'entregado') result[idx].completados = ct
        else if (r._id.estado === 'cancelado') result[idx].cancelados = ct
        else result[idx].pendientes += ct
      })
      return res.json(result)
    }

    // fallback
    return res.json([])
  } catch (err) {
    next(err)
  }
}

exports.getRevenueChart = async (req, res, next) => {
  try {
    const range = req.query.range || 'week'
    const now   = new Date()
    let start

    // 1) Calcula la fecha de inicio según el rango
    switch (range) {
      case 'day':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        start = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        start = new Date(now.getFullYear(), 0, 1)
        break
      default:
        start = new Date(0)
    }

    let raw, result

    if (range === 'day') {
      // agrupa en intervalos de 2 horas: bucket = floor(hour/2)
      raw = await Orden.aggregate([
        { $match: { fecha: { $gte: start } } },
        {
          $project: {
            bucket: { $floor: { $divide: [{ $hour: '$fecha' }, 2] } },
            total: 1
          }
        },
        {
          $group: {
            _id: '$bucket',
            ingresos: { $sum: '$total' }
          }
        }
      ])
      // inicializa 12 buckets
      result = Array.from({ length: 12 }, (_, i) => ({
        time: `${i * 2}:00`,
        ingresos: 0
      }))
      raw.forEach(r => {
        if (r._id >= 0 && r._id < 12) {
          result[r._id].ingresos = r.ingresos
        }
      })
    } else if (range === 'week') {
      // agrupa por día de la semana (Lun=0...Dom=6)
      raw = await Orden.aggregate([
        { $match: { fecha: { $gte: start } } },
        {
          $project: {
            dow: { $subtract: [{ $dayOfWeek: '$fecha' }, 2] },
            total: 1
          }
        },
        {
          $addFields: {
            dow: { $cond: [{ $lt: ['$dow', 0] }, 6, '$dow'] }
          }
        },
        {
          $group: {
            _id: '$dow',
            ingresos: { $sum: '$total' }
          }
        }
      ])
      const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
      result = days.map(d => ({ time: d, ingresos: 0 }))
      raw.forEach(r => {
        result[r._id].ingresos = r.ingresos
      })
    } else if (range === 'month') {
      // agrupa en semanas desde start (0=última semana...3=semana más antigua)
      raw = await Orden.aggregate([
        { $match: { fecha: { $gte: start } } },
        {
          $project: {
            diff: { $subtract: ['$$NOW', '$fecha'] },
            total: 1
          }
        },
        {
          $addFields: {
            weekIdx: { $floor: { $divide: ['$diff', 1000*60*60*24*7] } }
          }
        },
        {
          $group: {
            _id: '$weekIdx',
            ingresos: { $sum: '$total' }
          }
        }
      ])
      result = Array.from({ length: 4 }, (_, i) => ({
        time: `Semana ${i+1}`,
        ingresos: 0
      }))
      raw.forEach(r => {
        const idx = 3 - r._id
        if (idx >= 0 && idx < 4) {
          result[idx].ingresos = r.ingresos
        }
      })
    } else if (range === 'year') {
      // agrupa por mes (1..12)
      raw = await Orden.aggregate([
        { $match: { fecha: { $gte: start } } },
        {
          $project: {
            m: { $month: '$fecha' },
            total: 1
          }
        },
        {
          $group: {
            _id: '$m',
            ingresos: { $sum: '$total' }
          }
        }
      ])
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
      result = months.map(m => ({ time: m, ingresos: 0 }))
      raw.forEach(r => {
        result[r._id - 1].ingresos = r.ingresos
      })
    } else {
      result = []
    }

    res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/stats/restaurants?range=day|week|month|year
 * Devuelve para cada restaurante:
 * - name, ventas (suma total), pedidos (número de órdenes), calificacion (promedio)
 * Filtra por fecha si se pasa `range`.
 */
exports.getRestaurantPerformance = async (req, res, next) => {
  try {
    const range = req.query.range
    const now   = new Date()
    let start

    // si te interesa filtrar por rango de fecha, igual que en otros endpoints:
    if (range) {
      switch (range) {
        case 'day':
          start = new Date(now.getTime() - 24*60*60*1000)
          break
        case 'week':
          start = new Date(now.getTime() - 7*24*60*60*1000)
          break
        case 'month':
          start = new Date(now.getTime() - 30*24*60*60*1000)
          break
        case 'year':
          start = new Date(now.getFullYear()-1, now.getMonth(), now.getDate())
          break
      }
    }

    // Pipeline sobre la colección de Restaurantes
    const pipeline = [
      // opcional: si quieres ignorar restaurantes sin órdenes/reseñas
      // { $match: { /* algún criterio */ } },

      // 1) Lookup de órdenes
      {
        $lookup: {
          from: 'ordenes',
          let: { rid: '$_id' },
          pipeline: [
            ...(start
              ? [{ $match: { $expr: { $and: [
                  { $eq: ['$restauranteId', '$$rid'] },
                  { $gte: ['$fecha', start] }
                ] } } }]
              : [{ $match: { $expr: { $eq: ['$restauranteId', '$$rid'] } } }]),
            { $group: {
                _id: null,
                totalRevenue: { $sum: '$total' },
                totalOrders:  { $sum: 1 }
              }
            }
          ],
          as: 'orderStats'
        }
      },

      // 2) Lookup de reseñas
      {
        $lookup: {
          from: 'resenas',
          let: { rid: '$_id' },
          pipeline: [
            ...(start
              ? [{ $match: { $expr: { $and: [
                  { $eq: ['$restauranteId', '$$rid'] },
                  { $gte: ['$fecha', start] }
                ] } } }]
              : [{ $match: { $expr: { $eq: ['$restauranteId', '$$rid'] } } }]),
            { $group: {
                _id: null,
                avgRating: { $avg: '$calificacion' }
              }
            }
          ],
          as: 'ratingStats'
        }
      },

      // 3) Dar forma final
      {
        $project: {
          _id:            0,
          name:           '$nombre',
          ventas:         { $ifNull: [{ $arrayElemAt: ['$orderStats.totalRevenue', 0] }, 0] },
          pedidos:        { $ifNull: [{ $arrayElemAt: ['$orderStats.totalOrders', 0] }, 0] },
          calificacion:   { $round: [
                              { $ifNull: [{ $arrayElemAt: ['$ratingStats.avgRating', 0] }, 0] },
                              1
                            ] }
        }
      }
    ]

    const result = await Restaurante.aggregate(pipeline)
    res.json(result)
  } catch (err) {
    next(err)
  }
}