// controllers/resenaFilterController.js
const Resena = require('../models/Resena');

/**
 * GET /api/resenas/filter   (admin)
 * Query params  ─────────────────────────────────────────────
 *   q               → texto libre en comentario
 *   restauranteId   → ObjectId
 *   calificacion    → 1‑5
 *   periodo         → hoy | semana | mes | año
 *
 * Ej.: /api/resenas/filter?restauranteId=...&calificacion=5&periodo=mes&q=excelente
 */
exports.filterResenas = async (req, res, next) => {
  try {
    const { q, restauranteId, calificacion, periodo } = req.query;

    /* ---------- construye query dinámicamente ---------- */
    const query = {};

    if (q) query.comentario = { $regex: q, $options: 'i' };

    if (restauranteId) query.restauranteId = restauranteId;

    if (calificacion)  query.calificacion  = Number(calificacion);

    if (periodo) {
      const hoy = new Date();
      const inicio = {
        hoy:    new Date(hoy.toDateString()),                 // 00:00 de hoy
        semana: new Date(hoy.setDate(hoy.getDate() - hoy.getDay())),
        mes:    new Date(hoy.getFullYear(), hoy.getMonth(), 1),
        año:    new Date(hoy.getFullYear(), 0, 1)
      }[periodo];
      if (inicio) query.createdAt = { $gte: inicio };
    }

    const resenas = await Resena.find(query)
      .populate('usuarioId',     'nombre apellido')
      .populate('restauranteId', 'nombre')
      .populate('ordenId',       'fecha')
      .populate('menuItemId',    'nombre precio')
      .sort({ createdAt: -1 });

    res.json(resenas);
  } catch (err) { next(err); }
};
