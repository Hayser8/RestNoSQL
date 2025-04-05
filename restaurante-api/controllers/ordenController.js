const Orden = require('../models/Orden');

exports.createOrden = async (req, res, next) => {
  try {
    const { usuarioId, restauranteId, fecha, estado, total, articulos } = req.body;
    const nuevaOrden = new Orden({
      usuarioId,
      restauranteId,
      fecha,
      estado,
      total,
      articulos
    });
    const ordenGuardada = await nuevaOrden.save();
    res.status(201).json(ordenGuardada);
  } catch (error) {
    next(error);
  }
};
