// controllers/statsController.js
const Resena = require('../models/Resena');
const Usuario = require('../models/Usuario');
const ArticuloMenu = require('../models/ArticuloMenu');

exports.getStats = async (req, res) => {
  try {
    // 1) cuenta total de artículos en la colección
    const totalItems = await ArticuloMenu.countDocuments();


    // 2) restar 10 bebidas
    const totalDishes = Math.max(totalItems - 10, 0);


    // 3) promedio de calificaciones
    const [ { avgRating = 0 } = {} ] = await Resena.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$calificacion' } } }
    ]);


    // 4) total de usuarios
    const totalUsers = await Usuario.countDocuments();


    return res.json({
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalUsers,
      totalDishes
    });
  } catch (error) {
    console.error('Error en getStats:', error);
    return res.status(500).json({ msg: 'No se pudieron obtener las estadísticas' });
  }
};
