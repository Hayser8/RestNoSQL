const Restaurante = require('../models/Restaurante');

/**
 * GET /api/restaurantes
 * Listar todas las sucursales
 */
exports.getAllRestaurantes = async (req, res, next) => {
  try {
    const restaurantes = await Restaurante.find();
    res.json(restaurantes);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/restaurantes/:id
 * Obtener sucursal por ID
 */
exports.getRestauranteById = async (req, res, next) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id);
    if (!restaurante) {
      return res.status(404).json({ message: 'Restaurante no encontrado' });
    }
    res.json(restaurante);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/restaurantes
 * Crear nueva sucursal (solo admin)
 */
exports.createRestaurante = async (req, res, next) => {
  try {
    const {
      nombre,
      direccion,
      ubicacion: { lat, lng } = {},
      telefono,
      email,
      horario
    } = req.body;

    const newRestaurante = await Restaurante.create({
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      ubicacion: { lat, lng },
      telefono: telefono.trim(),
      email: email.trim(),
      horario: horario.map(h => ({
        dia: h.dia.trim(),
        apertura: h.apertura.trim(),
        cierre: h.cierre.trim()
      }))
    });

    res.status(201).json(newRestaurante);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/restaurantes/:id
 * Actualizar sucursal (solo admin)
 */
exports.updateRestaurante = async (req, res, next) => {
  try {
    const updates = {};
    const body = req.body;

    if (body.nombre       !== undefined) updates.nombre      = body.nombre.trim();
    if (body.direccion    !== undefined) updates.direccion   = body.direccion.trim();
    if (body.telefono     !== undefined) updates.telefono    = body.telefono.trim();
    if (body.email        !== undefined) updates.email       = body.email.trim();
    if (body.ubicacion) {
      updates.ubicacion = {};
      if (body.ubicacion.lat !== undefined) updates.ubicacion.lat = body.ubicacion.lat;
      if (body.ubicacion.lng !== undefined) updates.ubicacion.lng = body.ubicacion.lng;
    }
    if (body.horario) {
      updates.horario = body.horario.map(h => ({
        dia: h.dia.trim(),
        apertura: h.apertura.trim(),
        cierre: h.cierre.trim()
      }));
    }

    const updated = await Restaurante.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Restaurante no encontrado' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/restaurantes/:id
 * Eliminar sucursal (solo admin)
 */
exports.deleteRestaurante = async (req, res, next) => {
  try {
    const deleted = await Restaurante.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Restaurante no encontrado' });
    }
    res.json({ message: 'Restaurante eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
