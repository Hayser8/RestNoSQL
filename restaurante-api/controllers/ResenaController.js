// controllers/resenaController.js

const Resena = require('../models/Resena');
const Orden = require('../models/Orden') 

/**
 * POST /api/resenas
 * Crear una nueva reseña (usuario autenticado)
 */
exports.createResena = async (req, res, next) => {
  try {
    const {
      restauranteId,
      ordenId,
      calificacion
    } = req.body;

    // Protegemos comentario de ser undefined
    const comentario = req.body.comentario ? req.body.comentario.trim() : '';

    const newResena = await Resena.create({
      usuarioId: req.user.id,
      restauranteId,
      ordenId,
      calificacion,
      comentario
    });

    res.status(201).json(newResena);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resenas
 * Listar todas las reseñas (admin)
 */
exports.getResenas = async (req, res, next) => {
  try {
    const resenas = await Resena.find()
      .populate('usuarioId', 'nombre apellido')
      .populate('restauranteId', 'nombre')
      .populate('ordenId', 'fecha');    // opcionalmente incluimos info de la orden
    res.json(resenas);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resenas/:id
 * Obtener una reseña por ID (admin)
 */
exports.getResenaById = async (req, res, next) => {
  try {
    const resena = await Resena.findById(req.params.id)
      .populate('usuarioId', 'nombre apellido')
      .populate('restauranteId', 'nombre')
      .populate('ordenId', 'fecha');
    if (!resena) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json(resena);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/resenas/:id
 * Actualizar una reseña por ID (admin)
 */
exports.updateResena = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.calificacion !== undefined) updates.calificacion = req.body.calificacion;
    if (req.body.comentario   !== undefined) updates.comentario   = req.body.comentario.trim();

    const updated = await Resena.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resenas/:id
 * Eliminar una reseña por ID (admin)
 */
exports.deleteResena = async (req, res, next) => {
  try {
    const deleted = await Resena.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resenas/product/:menuItemId
 * Listar las 5 mejores reseñas asociadas a un artículo del menú
 */
exports.getResenasByProducto = async (req, res, next) => {
  try {
    const { menuItemId } = req.params

    // 1) Obtén solo los _id de las órdenes que incluyan ese menuItemId
    const ordenes = await Orden.find(
      { 'articulos.menuItemId': menuItemId },
      { _id: 1 }
    )
    const ordenIds = ordenes.map(o => o._id)

    // 2) Busca las reseñas cuya ordenId esté en la lista,
    //    ordena por calificación descendente, luego fecha descendente,
    //    y limita a 5 documentos.
    const reviews = await Resena.find({ ordenId: { $in: ordenIds } })
      .populate('usuarioId', 'nombre apellido')
      .sort({ calificacion: -1, fecha: -1 })
      .limit(5)

    return res.json(reviews)
  } catch (err) {
    next(err)
  }
}