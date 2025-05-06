// routes/articulos-menu.js

const express = require('express')
const { body, param, validationResult } = require('express-validator')
const ctrl = require('../controllers/articuloController')
const { protect, restrictTo } = require('../middlewares/auth')

const router = express.Router()

// Validador genérico
const validate = (check) => [
  check,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Listar todos
router.get('/', ctrl.getArticulos)

// Obtener por ID
router.get(
  '/:id',
  validate(param('id').isMongoId().withMessage('ID inválido')),
  ctrl.getArticuloById
)

// Crear (admin)
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validate(body('nombre').notEmpty()),
  validate(body('descripcion').notEmpty()),
  validate(body('precio').isFloat({ gt: 0 })),
  validate(body('categoria').notEmpty()),
  validate(body('imagen').isURL()),
  ctrl.createArticulo
)

// Actualizar (admin)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId()),
  validate(body('nombre').optional().notEmpty()),
  validate(body('descripcion').optional().notEmpty()),
  validate(body('precio').optional().isFloat({ gt: 0 })),
  validate(body('categoria').optional().notEmpty()),
  validate(body('imagen').optional().isURL()),
  ctrl.updateArticulo
)

// Eliminar (admin)
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId()),
  ctrl.deleteArticulo
)

// Bulk-importar (admin)
router.post(
  '/bulk',
  protect,
  restrictTo('admin'),
  validate(body().isArray().withMessage('Debe ser array')),
  ctrl.bulkImport
)

module.exports = router
