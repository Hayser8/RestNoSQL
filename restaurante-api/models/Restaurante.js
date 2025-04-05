const mongoose = require('mongoose');

const RestauranteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  ubicacion: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  telefono: { type: String, required: true },
  email: { type: String, required: true, match: [/.+@.+\..+/, 'Ingrese un email válido'] },
  horario: [{
    dia: { type: String, required: true },
    apertura: { type: String, required: true },
    cierre: { type: String, required: true },
  }],
});

module.exports = mongoose.model('Restaurante', RestauranteSchema);
