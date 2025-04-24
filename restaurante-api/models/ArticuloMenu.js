// models/ArticuloMenu.js
const mongoose = require('mongoose');

const ArticuloMenuSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  imagen: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'articulos_menu'  
});

module.exports = mongoose.model('ArticuloMenu', ArticuloMenuSchema);
