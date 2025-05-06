// routes/ordenes.js
const express = require('express')
const { body, param, query, validationResult } = require('express-validator')
const ordenController = require('../controllers/ordenController')
const { protect, restrictTo } = require('../middlewares/auth')

const router = express.Router()

// middleware genérico de validación
const validate = (checks) => [
  checks,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]

////////////////////////////////////////////////////////////////////////////////
// POST /api/ordenes
// Crear un nuevo pedido (usuario autenticado)
////////////////////////////////////////////////////////////////////////////////
router.post(
  '/',
  protect,
  validate(body('restauranteId').isMongoId().withMessage('restauranteId inválido')),
  validate(body('articulos').isArray({ min: 1 }).withMessage('Debe incluir al menos un artículo')),
  validate(body('articulos.*.menuItemId').isMongoId().withMessage('menuItemId inválido')),
  validate(body('articulos.*.cantidad').isInt({ gt: 0 }).withMessage('cantidad debe ser entero > 0')),
  validate(body('articulos.*.precio').isFloat({ gt: 0 }).withMessage('precio debe ser número > 0')),
  ordenController.createOrden
)



////////////////////////////////////////////////////////////////////////////////
// GET /api/ordenes/by-date
// Filtrar pedidos por rango de fechas y limitar resultados (solo admin)
////////////////////////////////////////////////////////////////////////////////
router.get(
  '/by-date',
  protect, restrictTo('admin'),
  validate(query('start').isISO8601()),
  validate(query('end').isISO8601()),
  validate(query('page').optional().isInt({gt:0})),
  validate(query('limit').optional().isInt({gt:0})),
  ordenController.getOrdersByDate
);


////////////////////////////////////////////////////////////////////////////////
// GET /api/ordenes/me
// Historial de pedidos del usuario autenticado
////////////////////////////////////////////////////////////////////////////////
router.get(
  '/me',
  protect,
  ordenController.getMyOrders
)

////////////////////////////////////////////////////////////////////////////////
// GET /api/ordenes
// Listar todos los pedidos con límite opcional (solo admin)
////////////////////////////////////////////////////////////////////////////////
router.get(
  '/',
  protect, restrictTo('admin'),
  validate(query('page').optional().isInt({gt:0})),
  validate(query('limit').optional().isInt({gt:0})),
  ordenController.getAllOrders
);

////////////////////////////////////////////////////////////////////////////////
// GET /api/ordenes/:id
// Obtener un pedido por ID (dueño o admin)
////////////////////////////////////////////////////////////////////////////////
router.get(
  '/:id',
  protect,
  validate(param('id').isMongoId().withMessage('ID de orden inválido')),
  ordenController.getOrdenById
)

////////////////////////////////////////////////////////////////////////////////
// PUT /api/ordenes/:id/status
// Actualizar estado de un pedido (solo admin)
////////////////////////////////////////////////////////////////////////////////
router.put(
  '/:id/status',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de orden inválido')),
  validate(body('estado')
    .isIn(['confirmado', 'en preparación', 'entregado', 'cancelado'])
    .withMessage('Estado inválido')),
  ordenController.updateOrdenStatus
)

router.put(
  '/bulk-status',
  protect,
  restrictTo('admin'),
  validate(body('orderIds')
    .isArray({ min: 1 })
    .withMessage('orderIds debe ser un array con al menos un ID')),
  validate(body('estado')
    .isIn(['pendiente', 'confirmado', 'en preparación', 'entregado', 'cancelado'])
    .withMessage('Estado inválido')),
  ordenController.bulkUpdateOrdenStatus
);

router.delete(
  '/bulk',
  protect,
  restrictTo('admin'),
  validate(
    body('orderIds')
      .isArray({ min: 1 })
      .withMessage('orderIds debe ser un array con al menos un ID')
  ),
  ordenController.bulkDeleteOrdenes
)

////////////////////////////////////////////////////////////////////////////////
// DELETE /api/ordenes/:id
// Eliminar un pedido (solo admin)
////////////////////////////////////////////////////////////////////////////////
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de orden inválido')),
  ordenController.deleteOrden
)

module.exports = router
