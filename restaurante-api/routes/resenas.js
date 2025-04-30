// routes/resenas.js
const express = require('express')
const { body, param, query, validationResult } = require('express-validator')
const resenaController = require('../controllers/resenaController')
const { protect, restrictTo } = require('../middlewares/auth')

const router = express.Router()

// Middleware para validar inputs
const validate = (checks) => [
  checks,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

/**
 * @route   GET /api/resenas/product/:menuItemId
 * @desc    Listar reseñas de un producto específico
 * @access  Public
 */
router.get(
  '/product/:menuItemId',
  validate(param('menuItemId').isMongoId().withMessage('menuItemId inválido')),
  resenaController.getResenasByProducto
)

/**
 * @route   POST /api/resenas
 * @desc    Crear una nueva reseña (usuario autenticado)
 * @access  Private (user)
 */
router.post(
  '/',
  protect,
  validate(body('restauranteId').isMongoId().withMessage('restauranteId inválido')),
  validate(body('ordenId').optional().isMongoId().withMessage('ordenId inválido')),
  validate(body('calificacion')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5')),
  validate(body('comentario')
    .notEmpty().withMessage('El comentario es obligatorio')),
  resenaController.createResena
)

/**
 * @route   GET /api/resenas/all
 * @desc    Listar todas las reseñas (admin)
 * @access  Private (admin)
 */
router.get(
  '/all',
  protect,
  restrictTo('admin'),
  resenaController.getResenas
)

/**
 * @route   GET /api/resenas/:id
 * @desc    Obtener una reseña por ID (admin)
 * @access  Private (admin)
 */
router.get(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de reseña inválido')),
  resenaController.getResenaById
)

/**
 * @route   PUT /api/resenas/:id
 * @desc    Actualizar una reseña por ID (admin)
 * @access  Private (admin)
 */
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de reseña inválido')),
  validate(body('calificacion')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5')),
  validate(body('comentario')
    .optional()
    .notEmpty().withMessage('El comentario no puede estar vacío')),
  resenaController.updateResena
)

/**
 * @route   DELETE /api/resenas/:id
 * @desc    Eliminar una reseña por ID (admin)
 * @access  Private (admin)
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de reseña inválido')),
  resenaController.deleteResena
)

module.exports = router
