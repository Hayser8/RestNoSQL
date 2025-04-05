const Restaurante = require('../models/Restaurante');

exports.getAllRestaurantes = async (req, res, next) => {
  try {
    const restaurantes = await Restaurante.find();
    res.json(restaurantes);
  } catch (error) {
    next(error);
  }
};
