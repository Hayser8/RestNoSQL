const mongoose = require('mongoose');

const RestauranteSchema = new mongoose.Schema({
  nombre:     { type: String, required: true },
  direccion:  { type: String, required: true },

  /* GeoJSON Point ✔️ */
  ubicacion: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],        // [lng, lat]
      required: true
    }
  },

  telefono:   { type: String, required: true },
  email:      { type: String, required: true, match: /.+@.+\..+/ },
  horario:    [{
    dia:      { type: String, required: true },
    apertura: { type: String, required: true },
    cierre:   { type: String, required: true }
  }]
});

module.exports =
  mongoose.models.Restaurante ||
  mongoose.model('Restaurante', RestauranteSchema);
