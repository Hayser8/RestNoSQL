const Resena = require('../models/Resena');

// Crear una nueva reseña
exports.createResena = async (req, res, next) => {
  try {
    const newResena = new Resena(req.body);
    const savedResena = await newResena.save();
    res.status(201).json(savedResena);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las reseñas (con populate de datos relevantes)
exports.getResenas = async (req, res, next) => {
  try {
    const resenas = await Resena.find()
      .populate('usuarioId', 'nombre apellido')
      .populate('restauranteId', 'nombre');
    res.json(resenas);
  } catch (error) {
    next(error);
  }
};

// Obtener una reseña por ID
exports.getResenaById = async (req, res, next) => {
  try {
    const resena = await Resena.findById(req.params.id)
      .populate('usuarioId', 'nombre apellido')
      .populate('restauranteId', 'nombre');
    if (!resena) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json(resena);
  } catch (error) {
    next(error);
  }
};

// Actualizar una reseña por ID
exports.updateResena = async (req, res, next) => {
  try {
    const updatedResena = await Resena.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedResena) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json(updatedResena);
  } catch (error) {
    next(error);
  }
};

// Eliminar una reseña por ID
exports.deleteResena = async (req, res, next) => {
  try {
    const deletedResena = await Resena.findByIdAndDelete(req.params.id);
    if (!deletedResena) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json({ message: 'Reseña eliminada' });
  } catch (error) {
    next(error);
  }
};
