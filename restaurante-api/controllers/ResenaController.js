const Resena = require("../models/Resena");
const Orden  = require("../models/Orden");

/* helpers de paginación */
const getPagination = (req) => {
  const limit = Math.max(parseInt(req.query.limit) || 9, 1);
  const page  = Math.max(parseInt(req.query.page)  || 1, 1);
  return { limit, skip: (page - 1) * limit };
};

/*───────────────────────────────────────────────────────────────────────────
  POST /api/resenas            – Crear reseña (usuario autenticado)
───────────────────────────────────────────────────────────────────────────*/
exports.createResena = async (req, res, next) => {
  try {
    const { restauranteId, ordenId, menuItemId, calificacion, comentario } =
      req.body;

    const newResena = await Resena.create({
      usuarioId:     req.user.id,
      restauranteId,
      ordenId,
      menuItemId: menuItemId || null,
      calificacion,
      comentario: comentario.trim(),
    });

    res.status(201).json(newResena);
  } catch (err) {
    next(err);
  }
};

/*───────────────────────────────────────────────────────────────
  GET /api/resenas/all? page=1&limit=9
───────────────────────────────────────────────────────────────*/
exports.getResenas = async (req, res, next) => {
  try {
    const { limit, skip } = getPagination(req);

    const [resenas, total] = await Promise.all([
      Resena.find()
        .populate("usuarioId",     "nombre apellido")
        .populate("restauranteId", "nombre")
        .populate("ordenId",       "numero fecha")
        .populate("menuItemId",    "nombre precio")
        .sort({ fecha: -1 })
        .skip(skip)
        .limit(limit),
      Resena.countDocuments(),
    ]);

    res.json({ data: resenas, total });
  } catch (err) {
    next(err);
  }
};


/*───────────────────────────────────────────────────────────────────────────
  GET /api/resenas/:id          – Obtener reseña por ID (admin)
───────────────────────────────────────────────────────────────────────────*/
exports.getResenaById = async (req, res, next) => {
  try {
    const resena = await Resena.findById(req.params.id)
      .populate("usuarioId",     "nombre apellido")
      .populate("restauranteId", "nombre")
      .populate("ordenId",       "numero fecha")
      .populate("menuItemId",    "nombre precio");

    if (!resena)
      return res.status(404).json({ message: "Reseña no encontrada" });

    res.json(resena);
  } catch (err) {
    next(err);
  }
};

/*───────────────────────────────────────────────────────────────────────────
  PUT /api/resenas/:id          – Actualizar reseña (admin)
───────────────────────────────────────────────────────────────────────────*/
exports.updateResena = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.calificacion !== undefined)
      updates.calificacion = req.body.calificacion;
    if (req.body.comentario !== undefined)
      updates.comentario = req.body.comentario.trim();

    const updated = await Resena.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Reseña no encontrada" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/*───────────────────────────────────────────────────────────────────────────
  DELETE /api/resenas/:id       – Eliminar reseña (admin)
───────────────────────────────────────────────────────────────────────────*/
exports.deleteResena = async (req, res, next) => {
  try {
    const deleted = await Resena.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Reseña no encontrada" });

    res.json({ message: "Reseña eliminada correctamente" });
  } catch (err) {
    next(err);
  }
};

/*───────────────────────────────────────────────────────────────────────────
  GET /api/resenas/product/:menuItemId   – Top‑5 reseñas de un plato
───────────────────────────────────────────────────────────────────────────*/
exports.getResenasByProducto = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;

    /* 1) _id de órdenes que incluyan ese menú item */
    const ordenIds = (
      await Orden.find({ "articulos.menuItemId": menuItemId }, { _id: 1 })
    ).map((o) => o._id);

    /* 2) reseñas filtradas */
    const reviews = await Resena.find({
      ordenId:    { $in: ordenIds },
      menuItemId: menuItemId,
    })
      .populate("usuarioId", "nombre apellido avatar")
      .sort({ calificacion: -1, fecha: -1 })
      .limit(5);

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

/*───────────────────────────────────────────────────────────────────────────
  GET /api/resenas/me           – Reseñas del usuario autenticado
───────────────────────────────────────────────────────────────────────────*/
exports.getResenasByUser = async (req, res, next) => {
  try {
    const resenas = await Resena.find({ usuarioId: req.user.id })
      .populate("restauranteId", "nombre")
      .populate("ordenId",       "numero fecha")
      .populate("menuItemId",    "nombre precio");

    res.json(resenas);
  } catch (err) {
    next(err);
  }
};
