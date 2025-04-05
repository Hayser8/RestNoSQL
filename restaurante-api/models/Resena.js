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
  ordenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orden'
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resena', ResenaSchema);
