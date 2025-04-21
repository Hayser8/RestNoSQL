const express = require('express');
const { body, param, validationResult } = require('express-validator');
const restauranteController = require('../controllers/restauranteController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// Middleware helper para validación
const validate = (checks) => [
  checks,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * @route   GET /api/restaurantes
 * @desc    Listar todas las sucursales
 * @access  Public
 */
router.get('/', restauranteController.getAllRestaurantes);

/**
 * @route   GET /api/restaurantes/:id
 * @desc    Obtener sucursal por ID
 * @access  Public
 */
router.get(
  '/:id',
  validate(param('id').isMongoId().withMessage('ID de restaurante inválido')),
  restauranteController.getRestauranteById
);

/**
 * @route   POST /api/restaurantes
 * @desc    Crear nueva sucursal (solo admin)
 * @access  Private (admin)
 */
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
);

/**
 * @route   PUT /api/restaurantes/:id
 * @desc    Actualizar sucursal (solo admin)
 * @access  Private (admin)
 */
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de restaurante inválido')),
  // Campos opcionales pero validados si vienen
  validate(body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío')),
  validate(body('direccion').optional().notEmpty().withMessage('La dirección no puede estar vacía')),
  validate(body('ubicacion.lat').optional().isFloat().withMessage('Latitud inválida')),
  validate(body('ubicacion.lng').optional().isFloat().withMessage('Longitud inválida')),
  validate(body('telefono').optional().notEmpty().withMessage('El teléfono no puede estar vacío')),
  validate(body('email').optional().isEmail().withMessage('Email inválido')),
  validate(body('horario').optional().isArray().withMessage('Horario debe ser un array')),
  restauranteController.updateRestaurante
);

/**
 * @route   DELETE /api/restaurantes/:id
 * @desc    Eliminar sucursal (solo admin)
 * @access  Private (admin)
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de restaurante inválido')),
  restauranteController.deleteRestaurante
);

module.exports = router;
