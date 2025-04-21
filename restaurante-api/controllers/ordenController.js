// controllers/ordenController.js

const Orden = require('../models/Orden');

/**
 * Crear nueva orden
 * usuario: req.user.id
 * total: suma de articulos
 * estado: 'confirmado' por default
 */
exports.createOrden = async (req, res, next) => {
  try {
    const { restauranteId, articulos } = req.body;

    // Calcular total
    const total = articulos.reduce((sum, item) => {
      return sum + item.cantidad * item.precio;
    }, 0);

    const nuevaOrden = new Orden({
      usuarioId: req.user.id,
      restauranteId,
      articulos,
      total,
      estado: 'confirmado' // estado inicial
      // fecha: default en el modelo
    });

    const ordenGuardada = await nuevaOrden.save();
    res.status(201).json(ordenGuardada);
  } catch (error) {
    next(error);
  }
};

/**
 * Historial de pedidos del usuario autenticado
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const ordenes = await Orden.find({ usuarioId: req.user.id })
      .sort({ fecha: -1 })
      .populate('restauranteId', 'nombre direccion')
      .populate('articulos.menuItemId', 'nombre precio');
    res.json(ordenes);
  } catch (error) {
    next(error);
  }
};

/**
 * Listar todas las órdenes (solo admin)
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const ordenes = await Orden.find()
      .sort({ fecha: -1 })
      .populate('usuarioId', 'nombre apellido email')
      .populate('restauranteId', 'nombre');
    res.json(ordenes);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener orden por ID (dueño o admin)
 */
exports.getOrdenById = async (req, res, next) => {
  try {
    const orden = await Orden.findById(req.params.id)
      .populate('usuarioId', 'nombre apellido email')
      .populate('restauranteId', 'nombre direccion')
      .populate('articulos.menuItemId', 'nombre precio');
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });

    // Permitir solo al dueño o admin
    if (orden.usuarioId._id.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para ver esta orden' });
    }

    res.json(orden);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar estado de la orden (solo admin)
 */
exports.updateOrdenStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const orden = await Orden.findById(req.params.id);
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });

    orden.estado = estado;
    await orden.save();
    res.json(orden);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar orden (solo admin)
 */
exports.deleteOrden = async (req, res, next) => {
  try {
    const orden = await Orden.findByIdAndDelete(req.params.id);
    if (!orden) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};
