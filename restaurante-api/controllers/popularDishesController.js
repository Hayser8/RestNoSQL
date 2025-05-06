// controllers/popularDishesController.js
const Orden = require('../models/Orden')
const ArticuloMenu = require('../models/ArticuloMenu')

/**
 * GET /api/popular-dishes
 * Top 3 platos de todos los tiempos (para landing)
 */
exports.getPopularDishes = async (req, res) => {
  try {
    const popular = await Orden.aggregate([
      { $unwind: '$articulos' },
      {
        $group: {
          _id: '$articulos.menuItemId',
          totalOrdered: { $sum: '$articulos.cantidad' }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'articulos_menu',
          localField: '_id',
          foreignField: '_id',
          as: 'dish'
        }
      },
      { $unwind: '$dish' },
      {
        $project: {
          id:           '$_id',
          nombre:       '$dish.nombre',
          descripcion:  '$dish.descripcion',
          precio:       '$dish.precio',
          imagen:       '$dish.imagen',
          totalOrdered: 1
        }
      }
    ])
    return res.json(popular)
  } catch (error) {
    console.error('Error en getPopularDishes:', error)
    return res.status(500).json({ msg: 'No se pudieron obtener los platos populares' })
  }
}

/**
 * GET /api/popular-dishes/range?range=day|week|month|year&limit=5
 * Top 5 más vendidos en un rango de fechas (para dashboard)
 */
exports.getPopularDishesRange = async (req, res, next) => {
  try {
    const range = req.query.range || 'week'
    const limit = parseInt(req.query.limit, 10) || 5
    const now   = new Date()
    let start

    switch (range) {
      case 'day':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default:
        start = new Date(0)
    }

    const agg = await Orden.aggregate([
      { $unwind: '$articulos' },
      { $match: { fecha: { $gte: start } } },
      {
        $group: {
          _id:            '$articulos.menuItemId',
          totalOrdered:   { $sum: '$articulos.cantidad' },
          revenue:        { $sum: { $multiply: ['$articulos.cantidad', '$articulos.precio'] } }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'articulos_menu',
          localField: '_id',
          foreignField: '_id',
          as: 'dish'
        }
      },
      { $unwind: '$dish' },
      {
        $project: {
          id:           '$_id',
          nombre:       '$dish.nombre',
          categoria:    '$dish.categoria',
          imagen:       '$dish.imagen',
          sales:        '$totalOrdered',
          revenue:      '$revenue'
        }
      }
    ])

    return res.json(agg)
  } catch (err) {
    next(err)
  }
}
