const express = require('express');
const { body, param, validationResult } = require('express-validator');
const articuloController = require('../controllers/articuloController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// helper middleware para validar inputs
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
 * @route   GET /api/articulos
 * @desc    Listar todos los artículos del menú
 * @access  Public
 */
router.get('/', articuloController.getArticulos);

/**
 * @route   GET /api/articulos/:id
 * @desc    Obtener un artículo por su ID
 * @access  Public
 */
router.get(
  '/:id',
  validate(param('id').isMongoId().withMessage('ID de artículo inválido')),
  articuloController.getArticuloById
);

/**
 * @route   POST /api/articulos
 * @desc    Crear un nuevo artículo (solo admin)
 * @access  Private (admin)
 */
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validate(body('nombre').notEmpty().withMessage('El nombre es obligatorio')),
  validate(body('descripcion').notEmpty().withMessage('La descripción es obligatoria')),
  validate(body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que 0')),
  validate(body('categoria').notEmpty().withMessage('La categoría es obligatoria')),
  validate(body('imagen').isURL().withMessage('La imagen debe ser una URL válida')),
  articuloController.createArticulo
);

/**
 * @route   PUT /api/articulos/:id
 * @desc    Actualizar un artículo existente (solo admin)
 * @access  Private (admin)
 */
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de artículo inválido')),
  // Los campos son opcionales al actualizar, pero si vienen, deben validarse
  validate(body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío')),
  validate(body('descripcion').optional().notEmpty().withMessage('La descripción no puede estar vacía')),
  validate(body('precio').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que 0')),
  validate(body('categoria').optional().notEmpty().withMessage('La categoría no puede estar vacía')),
  validate(body('imagen').optional().isURL().withMessage('La imagen debe ser una URL válida')),
  articuloController.updateArticulo
);

/**
 * @route   DELETE /api/articulos/:id
 * @desc    Eliminar un artículo (solo admin)
 * @access  Private (admin)
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(param('id').isMongoId().withMessage('ID de artículo inválido')),
  articuloController.deleteArticulo
);

module.exports = router;
