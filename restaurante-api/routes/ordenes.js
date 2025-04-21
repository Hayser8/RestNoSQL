const express = require('express');
const { body, param, validationResult } = require('express-validator');
const ordenController = require('../controllers/ordenController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// middleware de validación
const validate = (checks) => [
  checks,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];

/**
 * @route   POST /api/ordenes
 * @desc    Crear un nuevo pedido (usuario autenticado)
 * @access  Private (user)
 */
router.post(
  '/',
  protect,
  validate(body('restauranteId').isMongoId().withMessage('restauranteId inválido')),
  validate(body('articulos')
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un artículo')),
  validate(body('articulos.*.menuItemId')
    .isMongoId().withMessage('menuItemId inválido')),
  validate(body('articulos.*.cantidad')
    .isInt({ gt: 0 }).withMessage('cantidad debe ser entero > 0')),
  validate(body('articulos.*.precio')
    .isFloat({ gt: 0 }).withMessage('precio debe ser número > 0')),
  ordenController.createOrden
);

/**
 * @route   GET /api/ordenes/me
 * @desc    Obtener historial de pedidos del usuario autenticado
 * @access  Private (user)
 */
router.get(
  '/me',
  protect,
  ordenController.getMyOrders
);

/**
 * @route   GET /api/ordenes
 * @desc    Listar todos los pedidos
 * @access  Private (admin)
 */
router.get(
  '/',
  protect,
  restrictTo('admin'),
  ordenController.getAllOrders
);

/**
 * @route   GET /api/ordenes/:id
 * @desc    Obtener un pedido por ID
 * @access  Private (user/admin)
 */
router.get(
  '/:id',
  protect,
  validate(param('id').isMongoId().withMessage('ID de orden inválido')),
  ordenController.getOrdenById
);

/**
 * @route   PUT /api/ordenes/:id/status
 * @desc    Actualizar estado de un pedido
 * @access  Private (admin)
 */
router.put(
  '/:id/status',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de orden inválido')),
  validate(body('estado')
    .isIn(['confirmado','en preparación','entregado','cancelado'])
    .withMessage('Estado inválido')),
  ordenController.updateOrdenStatus
);

/**
 * @route   DELETE /api/ordenes/:id
 * @desc    Eliminar un pedido
 * @access  Private (admin)
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de orden inválido')),
  ordenController.deleteOrden
);

module.exports = router;
