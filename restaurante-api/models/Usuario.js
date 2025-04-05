const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, match: [/.+@.+\..+/, 'Email no válido'] },
  telefono: { type: String },
  direccion: { type: String },
  nit: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'user'], required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
