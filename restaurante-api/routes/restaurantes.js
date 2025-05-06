// routes/restaurantes.js
const express = require('express')
const { body, param, validationResult } = require('express-validator')
const restauranteController = require('../controllers/restauranteController')
const { protect, restrictTo } = require('../middlewares/auth')

const router = express.Router()

// Mapea errores de express-validator a { campo: mensaje }
const validate = (checks) => [
  checks,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const formatted = errors.array().reduce((acc, { param, msg }) => {
        acc[param] = msg
        return acc
      }, {})
      return res.status(400).json({ errors: formatted })
    }
    next()
  }
]

// Public: listar y obtener por ID
router.get('/', restauranteController.getAllRestaurantes)

router.get(
  '/:id',
  validate(param('id').isMongoId().withMessage('ID de restaurante inválido')),
  restauranteController.getRestauranteById
)

// Privado (admin): crear
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validate(body('nombre').notEmpty().withMessage('El nombre es obligatorio')),
  validate(body('direccion').notEmpty().withMessage('La dirección es obligatoria')),
  validate(body('ubicacion.lat').isFloat().withMessage('Latitud inválida')),
  validate(body('ubicacion.lng').isFloat().withMessage('Longitud inválida')),
  validate(body('telefono').notEmpty().withMessage('El teléfono es obligatorio')),
  validate(body('email').isEmail().withMessage('Email inválido')),
  validate(body('horario').isArray({ min: 1 }).withMessage('Horario debe ser un array con al menos un elemento')),
  validate(body('horario.*.dia').notEmpty().withMessage('Cada horario debe incluir el día')),
  validate(body('horario.*.apertura').matches(/^\d{2}:\d{2}$/).withMessage('Hora de apertura inválida (HH:MM)')),
  validate(body('horario.*.cierre').matches(/^\d{2}:\d{2}$/).withMessage('Hora de cierre inválida (HH:MM)')),
  restauranteController.createRestaurante
)

// Privado (admin): actualizar
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de restaurante inválido')),
  validate(body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío')),
  validate(body('direccion').optional().notEmpty().withMessage('La dirección no puede estar vacía')),
  validate(body('ubicacion.lat').optional().isFloat().withMessage('Latitud inválida')),
  validate(body('ubicacion.lng').optional().isFloat().withMessage('Longitud inválida')),
  validate(body('telefono').optional().notEmpty().withMessage('El teléfono no puede estar vacío')),
  validate(body('email').optional().isEmail().withMessage('Email inválido')),
  validate(body('horario').optional().isArray().withMessage('Horario debe ser un array')),
  validate(body('horario.*.dia').optional().notEmpty().withMessage('Cada horario debe incluir el día')),
  validate(body('horario.*.apertura').optional().matches(/^\d{2}:\d{2}$/).withMessage('Hora de apertura inválida (HH:MM)')),
  validate(body('horario.*.cierre').optional().matches(/^\d{2}:\d{2}$/).withMessage('Hora de cierre inválida (HH:MM)')),
  restauranteController.updateRestaurante
)

// Privado (admin): eliminar
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de restaurante inválido')),
  restauranteController.deleteRestaurante
)

module.exports = router
