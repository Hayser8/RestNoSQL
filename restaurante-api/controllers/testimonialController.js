// controllers/testimonialController.js
const Resena = require('../models/Resena');

exports.getTopTestimonials = async (req, res) => {
  try {
    const testimonials = await Resena.aggregate([
      // 1) Solo reseñas de 5 estrellas
      { $match: { calificacion: 5 } },
      // 2) Tomar 3 al azar
      { $sample: { size: 3 } },
      // 3) Unir con usuarios usando la clave correcta
      {
        $lookup: {
          from: 'usuarios',
          localField: 'usuarioId',
          foreignField: '_id',
          as: 'usuario'
        }
      },
      // 4) Desenrollar el array
      { $unwind: '$usuario' },
      // 5) Proyectar solo los campos que necesitamos
      {
        $project: {
          _id:     0,
          id:      '$_id',
          name:    { $concat: ['$usuario.nombre', ' ', '$usuario.apellido'] },
          comment: '$comentario',
          rating:  '$calificacion'
        }
      }
    ]);

    return res.json(testimonials);
  } catch (error) {
    console.error('Error en getTopTestimonials:', error);
    return res.status(500).json({ msg: 'Error al obtener testimonios' });
  }
};
