// controllers/reviewStatsController.js
const Resena = require('../models/Resena')

/**
 * GET /api/resenas/stats?range=day|week|month|year
 * Devuelve total, promedio y distribución por calificación,
 * filtrando por tu campo `fecha`.
 */
exports.getReviewStats = async (req, res, next) => {
    try {
      const range = req.query.range || 'week';
      const now   = new Date();
      let start;
  
      switch (range) {
        case 'day':
          start = new Date(now.getTime() - 24*60*60*1000);
          break;
        case 'week':
          start = new Date(now.getTime() - 7*24*60*60*1000);
          break;
        case 'month':
          start = new Date(now.getTime() - 30*24*60*60*1000);
          break;
        case 'year':
          start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          start = new Date(0);
      }
  
      // 1) total y promedio
      const [{ total = 0, avgRating = 0 } = {}] = await Resena.aggregate([
        { $match: { fecha: { $gte: start } } },
        {
          $group: {
            _id:       null,
            total:     { $sum: 1 },
            avgRating: { $avg: '$calificacion' }
          }
        }
      ]);
  
      // 2) distribución por calificación
      const dist = await Resena.aggregate([
        { $match: { fecha: { $gte: start } } },
        {
          $group: {
            _id:   '$calificacion',
            count: { $sum: 1 }
          }
        }
      ]);
      const distribution = dist.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {});
  
      res.json({
        total,
        average: parseFloat(avgRating.toFixed(1)),
        distribution
      });
    } catch (err) {
      next(err);
    }
  };