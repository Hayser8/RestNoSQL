const mongoose = require('mongoose');

const ResenaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  },
  restauranteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurante'
  },
  // ahora ordenId es obligatorio
  ordenId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Orden'
  },
  // menuItemId opcional para reseñas de plato
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArticuloMenu',
    default: null
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resena', ResenaSchema);
