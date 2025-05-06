// controllers/ordenController.js

const Orden = require('../models/Orden')



/*──────────────────────────────────────────────
  helper de paginación
──────────────────────────────────────────────*/
const getPagination = (req) => {
  const limit = Math.max(parseInt(req.query.limit) || 30, 1); // default 30
  const page  = Math.max(parseInt(req.query.page)  || 1, 1);
  return { limit, skip: (page - 1) * limit };
};


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

/*──────────────────────────────────────────────
  GET /api/ordenes?page&limit&q&status&restaurantId&start&end   (admin)
──────────────────────────────────────────────*/
exports.getAllOrders = async (req, res, next) => {
  try {
    const { q, status, restaurantId, start, end } = req.query;
    const { limit, skip } = getPagination(req);

    /* crea match dinámico */
    const match = {};
    if (status)          match.estado        = status;
    if (restaurantId)    match.restauranteId = restaurantId;
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end); e.setHours(23,59,59,999);
      match.fecha = { $gte: s, $lte: e };
    }

    /* pipeline con lookup para buscar por nombre del usuario */
    const pipeline = [
      { $match: match },
      { $lookup: {              // une con usuarios
          from: 'usuarios',
          localField: 'usuarioId',
          foreignField: '_id',
          as: 'usr'
        }
      },
      { $unwind: '$usr' }
    ];

    /* búsqueda (q) por id o nombre */
    if (q && q.trim()) {
      const term = q.trim();
      const or = [
        { _id: Types.ObjectId.isValid(term) ? new Types.ObjectId(term) : null },
        { 'usr.nombre'  : { $regex: term, $options: 'i' } },
        { 'usr.apellido': { $regex: term, $options: 'i' } }
      ];
      pipeline.push({ $match: { $or: or } });
    }

    /* total antes de paginar */
    const [{ total = 0 } = {}] = await Orden.aggregate([
      ...pipeline,
      { $count: 'total' }
    ]);

    /* paginación */
    pipeline.push(
      { $sort: { fecha: -1 } },
      { $skip: skip },
      { $limit: limit },
      // vuelca campos necesarios
      { $lookup: {
          from: 'restaurantes',
          localField: 'restauranteId',
          foreignField: '_id',
          as: 'rest'
        }
      },
      { $unwind: '$rest' },
      { $lookup: {
          from: 'articulosmenus',   // nombre real de la colección
          localField: 'articulos.menuItemId',
          foreignField: '_id',
          as: 'items'
        }
      }
    );

    const orders = await Orden.aggregate(pipeline);

    res.json({ data: orders, total });
  } catch (err) { next(err); }
};


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

/*──────────────────────────────────────────────
  GET /api/ordenes/by-date?start&end&limit&page
──────────────────────────────────────────────*/
exports.getOrdersByDate = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end)
      return res.status(400).json({ message:'Debes proporcionar start y end YYYY-MM-DD' });

    const { limit, skip } = getPagination(req);
    const startDate = new Date(start);
    const endDate   = new Date(end); endDate.setHours(23,59,59,999);

    const filter = { fecha:{ $gte:startDate, $lte:endDate } };

    const [orders,total] = await Promise.all([
      Orden.find(filter)
        .sort({ fecha:-1 })
        .skip(skip)
        .limit(limit)
        .populate('usuarioId','nombre apellido')
        .populate('restauranteId','nombre')
        .populate('articulos.menuItemId','nombre precio'),
      Orden.countDocuments(filter)
    ]);

    res.json({ data: orders, total });
  } catch (err) { next(err); }
};

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

/**
 * GET /api/ordenes/by-date-no-limit
 * Filtrar pedidos por rango de fechas sin límite de resultados (solo admin)
 */
exports.getOrdersByDateNoLimit = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Debes proporcionar start y end YYYY-MM-DD' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999); // Asegura que el final del día esté cubierto

    const filter = { fecha: { $gte: startDate, $lte: endDate } };

    const orders = await Orden.find(filter)
      .sort({ fecha: -1 }) // Ordenar por fecha descendente
      .populate('usuarioId', 'nombre apellido')
      .populate('restauranteId', 'nombre')
      .populate('articulos.menuItemId', 'nombre precio');

    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
};
