const mongoose = require('mongoose');

// Definir el esquema para cada artículo del pedido
const ArticuloSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ArticuloMenu' // referencia al modelo del artículo del menú
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
}, { _id: false }); // No es necesario un _id para cada subdocumento

// Definir el esquema para la Orden
const OrdenSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario' // referencia al modelo de Usuario
  },
  restauranteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurante' // referencia al modelo de Restaurante
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
});

module.exports = mongoose.model('Orden', OrdenSchema);
