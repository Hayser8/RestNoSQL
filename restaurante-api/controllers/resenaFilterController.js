// controllers/resenaFilterController.js
const Resena = require('../models/Resena');


/* helpers de paginación */
const getPagination = (req) => {
  const limit = Math.max(parseInt(req.query.limit) || 9, 1);
  const page  = Math.max(parseInt(req.query.page)  || 1, 1);
  return { limit, skip: (page - 1) * limit };
};

/*───────────────────────────────────────────────────────────────
  GET /api/resenas/filter?...&page=1&limit=9   (admin)
───────────────────────────────────────────────────────────────*/
exports.filterResenas = async (req, res, next) => {
  try {
    const { q, restauranteId, calificacion, periodo } = req.query;
    const { limit, skip } = getPagination(req);

    const query = {};
    if (q)            query.comentario    = { $regex: q, $options: "i" };
    if (restauranteId) query.restauranteId = restauranteId;
    if (calificacion)  query.calificacion  = Number(calificacion);

    if (periodo) {
      const hoy = new Date();
      const inicio = {
        hoy   : new Date(hoy.toDateString()),
        semana: new Date(hoy.setDate(hoy.getDate() - hoy.getDay())),
        mes   : new Date(hoy.getFullYear(), hoy.getMonth(), 1),
        año   : new Date(hoy.getFullYear(), 0, 1),
      }[periodo];
      if (inicio) query.fecha = { $gte: inicio };
    }

    const [resenas, total] = await Promise.all([
      Resena.find(query)
        .populate("usuarioId",     "nombre apellido")
        .populate("restauranteId", "nombre")
        .populate("ordenId",       "numero fecha")
        .populate("menuItemId",    "nombre precio")
        .sort({ fecha: -1 })
        .skip(skip)
        .limit(limit),
      Resena.countDocuments(query),
    ]);

    res.json({ data: resenas, total });
  } catch (err) {
    next(err);
  }
};

