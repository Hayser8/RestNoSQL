// routes/testimonials.js
const express = require('express');
const { getTopTestimonials } = require('../controllers/testimonialController');

const router = express.Router();

// GET /api/testimonials — devuelve 3 reseñas de 5 estrellas
router.get('/', getTopTestimonials);

// GET /api/testimonials/debug — cuenta cuántas reseñas de 5 estrellas hay
router.get('/debug', async (req, res) => {
  try {
    const count = await require('../models/Resena').countDocuments({ calificacion: 5 });
    console.log('>> Count of 5-star reviews:', count);
    res.json({ count });
  } catch (err) {
    console.error('Error en /debug:', err);
    res.status(500).json({ error: 'Error al contar reseñas' });
  }
});

module.exports = router;
