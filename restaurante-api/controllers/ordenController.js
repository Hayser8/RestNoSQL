// controllers/ordenController.js

const Orden = require('../models/Orden')

/**
 * POST /api/ordenes
 */
exports.createOrden = async (req, res, next) => {
  try {
    const {
      restauranteId,
      articulos = [],
      fecha,
      estado,
      total: totalBody
    } = req.body

    if (!Array.isArray(articulos) || articulos.length === 0) {
      return res.status(400).json({ message: 'Debe incluir al menos un artículo' })
    }

    const total = typeof totalBody === 'number'
      ? totalBody
      : articulos.reduce((sum, item) => sum + item.cantidad * item.precio, 0)

    const nuevaOrden = new Orden({
      usuarioId: req.user.id,
      restauranteId,
      articulos,
      total,
      estado: estado || 'confirmado',
      fecha: fecha ? new Date(fecha) : new Date()
    })

    const ordenGuardada = await nuevaOrden.save()
    res.status(201).json(ordenGuardada)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/ordenes/me
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const ordenes = await Orden.find({ usuarioId: req.user.id })
      .sort({ fecha: -1 })
      .populate('restauranteId', 'nombre direccion')
      .populate('articulos.menuItemId', 'nombre precio')
    res.json(ordenes)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/ordenes?limit=5
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 0
    let query = Orden.find()
      .sort({ fecha: -1 })
      .populate('usuarioId', 'nombre apellido email')
      .populate('restauranteId', 'nombre')
      .populate('articulos.menuItemId', 'nombre precio')

    if (limit > 0) query = query.limit(limit)

    const ordenes = await query
    res.json(ordenes)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/ordenes/:id
 */
exports.getOrdenById = async (req, res, next) => {
  try {
    const orden = await Orden.findById(req.params.id)
      .populate('usuarioId', 'nombre apellido email')
      .populate('restauranteId', 'nombre direccion')
      .populate('articulos.menuItemId', 'nombre precio')
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' })

    if (orden.usuarioId._id.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para ver esta orden' })
    }

    res.json(orden)
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /api/ordenes/:id/status
 */
exports.updateOrdenStatus = async (req, res, next) => {
  try {
    const { estado } = req.body
    const orden = await Orden.findById(req.params.id)
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' })

    orden.estado = estado
    await orden.save()
    res.json(orden)
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/ordenes/:id
 */
exports.deleteOrden = async (req, res, next) => {
  try {
    const orden = await Orden.findByIdAndDelete(req.params.id)
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' })
    res.json({ message: 'Orden eliminada correctamente' })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/ordenes/by-date?start=YYYY-MM-DD&end=YYYY-MM-DD&limit=5
 */
exports.getOrdersByDate = async (req, res, next) => {
  try {
    const { start, end, limit } = req.query

    if (!start || !end) {
      return res.status(400).json({
        message: 'Debes proporcionar `start` y `end` en formato YYYY-MM-DD'
      })
    }

    const startDate = new Date(start)
    const endDate   = new Date(end)
    endDate.setHours(23, 59, 59, 999)

    let query = Orden.find({
      fecha: { $gte: startDate, $lte: endDate }
    })
      .sort({ fecha: -1 })
      .populate('usuarioId', 'nombre apellido')
      .populate('restauranteId', 'nombre')
      .populate('articulos.menuItemId', 'nombre precio')

    const lim = parseInt(limit, 10) || 0
    if (lim > 0) query = query.limit(lim)

    const orders = await query
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/ordenes/bulk-status
 * Actualiza el estado de múltiples órdenes
 * Body: { orderIds: [String], estado: String }
 */
exports.bulkUpdateOrdenStatus = async (req, res, next) => {
  try {
    const { orderIds, estado } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: 'Debes enviar al menos un orderId' });
    }
    // Aseguramos sólo estos estados válidos
    const estadosPermitidos = ['pendiente', 'confirmado', 'en preparación', 'entregado', 'cancelado'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const result = await Orden.updateMany(
      { _id: { $in: orderIds } },
      { $set: { estado } }
    );

    res.json({
      message: `Se actualizaron ${result.nModified} órdenes.`,
      modifiedCount: result.nModified
    });
  } catch (error) {
    next(error);
  }
};


/**
 * DELETE /api/ordenes/bulk
 * Borra múltiples órdenes pasadas en orderIds
 * Body: { orderIds: [String] }
 */
exports.bulkDeleteOrdenes = async (req, res, next) => {
  try {
    const { orderIds } = req.body

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un orderId' })
    }

    // deleteMany devuelve { deletedCount: n, ... }
    const result = await Orden.deleteMany({ _id: { $in: orderIds } })

    return res.json({
      message: `Se eliminaron ${result.deletedCount} órdenes.`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    next(error)
  }
}
