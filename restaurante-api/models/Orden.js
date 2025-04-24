const mongoose = require('mongoose');

// Subdocumento para los artículos de cada pedido
const ArticuloSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ArticuloMenu'
  },
  nombre: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  precio: {
    type: Number,
    required: true
  }
}, { _id: false });

// Esquema principal para la colección "ordenes"
const OrdenSchema = new mongoose.Schema({
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
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  estado: {
    type: String,
    required: true,
    enum: ['confirmado', 'en preparación', 'entregado', 'cancelado']
  },
  total: {
    type: Number,
    required: true
  },
  articulos: {
    type: [ArticuloSchema],
    required: true
  }
}, {
  collection: 'ordenes',  // fuerza el uso de "ordenes"
  timestamps: false
});

module.exports = mongoose.model('Orden', OrdenSchema);
