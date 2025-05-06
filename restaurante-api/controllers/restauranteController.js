// controllers/restauranteController.js
const Restaurante = require('../models/Restaurante')

/**
 * GET /api/restaurantes
 * Listar todas las sucursales
 */
exports.getAllRestaurantes = async (req, res, next) => {
  try {
    const restaurantes = await Restaurante.find()
    res.json(restaurantes)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/restaurantes/:id
 * Obtener sucursal por ID
 */
exports.getRestauranteById = async (req, res, next) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id)
    if (!restaurante) {
      return res.status(404).json({ message: 'Restaurante no encontrado' })
    }
    res.json(restaurante)
  } catch (error) {
    next(error)
  }
}

exports.createRestaurante = async (req, res, next) => {
  try {
    const {
      nombre = '',
      direccion = '',
      ubicacion,
      telefono = '',
      email = '',
      horario = []
    } = req.body;

    /* ✔️  Validación */
    if (
      !ubicacion ||
      typeof ubicacion.lat !== 'number' ||
      typeof ubicacion.lng !== 'number'
    ) {
      return res.status(400).json({
        errors: { ubicacion: 'Latitud y longitud obligatorias y numéricas' }
      });
    }

    /* ✔️  Conversión a GeoJSON Point */
    const geoUbicacion = {
      type: 'Point',
      coordinates: [ ubicacion.lng, ubicacion.lat ]   // [lng, lat]
    };

    const newRestaurante = await Restaurante.create({
      nombre:    nombre.trim(),
      direccion: direccion.trim(),
      ubicacion: geoUbicacion,                        // <-- aquí
      telefono:  telefono.trim(),
      email:     email.trim(),
      horario:   horario.map(h => ({
        dia:      h.dia?.trim()      || '',
        apertura: h.apertura?.trim() || '',
        cierre:   h.cierre?.trim()   || ''
      }))
    });

    res.status(201).json(newRestaurante);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/restaurantes/:id
 * Actualizar sucursal (solo admin)
 */
exports.updateRestaurante = async (req, res, next) => {
  try {
    const updates = {};
    const body    = req.body;

    if (body.nombre    !== undefined) updates.nombre    = body.nombre.trim();
    if (body.direccion !== undefined) updates.direccion = body.direccion.trim();
    if (body.telefono  !== undefined) updates.telefono  = body.telefono.trim();
    if (body.email     !== undefined) updates.email     = body.email.trim();

    /* ✔️  GeoJSON al actualizar */
    if (body.ubicacion) {
      const { lat, lng } = body.ubicacion;
      if (typeof lat === 'number' && typeof lng === 'number') {
        updates.ubicacion = { type: 'Point', coordinates: [ lng, lat ] };
      }
    }

    if (body.horario) {
      updates.horario = body.horario.map(h => ({
        dia:      h.dia.trim(),
        apertura: h.apertura.trim(),
        cierre:   h.cierre.trim()
      }));
    }

    const updated = await Restaurante.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ message: 'Restaurante no encontrado' });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};


/**
 * DELETE /api/restaurantes/:id
 * Eliminar sucursal (solo admin)
 */
exports.deleteRestaurante = async (req, res, next) => {
  try {
    const deleted = await Restaurante.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Restaurante no encontrado' })
    }
    res.json({ message: 'Restaurante eliminado correctamente' })
  } catch (error) {
    next(error)
  }
}

/* ------------------------------------------------------------------ *
 *  POST /api/restaurantes/:id/horario   →  $push en el array         *
 *  Body: { dia, apertura, cierre }                                   *
 * ------------------------------------------------------------------ */
exports.addHorario = async (req, res, next) => {
  try {
    const { dia, apertura, cierre } = req.body;
    if (!dia || !apertura || !cierre)
      return res.status(400).json({ message: 'Faltan campos' });

    const result = await Restaurante.updateOne(
      { _id: req.params.id },
      { $push: { horario: { dia, apertura, cierre } } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: 'Restaurante no encontrado' });

    res.json({ message: 'Día añadido', modifiedCount: result.modifiedCount });
  } catch (err) { next(err); }
};

/* ------------------------------------------------------------------ *
 *  DELETE /api/restaurantes/:id/horario/:dia   →  $pull              *
 * ------------------------------------------------------------------ */
exports.removeHorario = async (req, res, next) => {
  try {
    const { dia } = req.params;
    const result = await Restaurante.updateOne(
      { _id: req.params.id },
      { $pull: { horario: { dia } } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: 'Restaurante no encontrado' });

    res.json({ message: 'Día eliminado', modifiedCount: result.modifiedCount });
  } catch (err) { next(err); }
};