const express = require('express');
const { body, param, validationResult } = require('express-validator');
const resenaController = require('../controllers/resenaController');
const { protect, restrictTo } = require('../middlewares/auth');
const { getReviewStats } = require('../controllers/reviewStatsController')
const filterCtrl   = require('../controllers/resenaFilterController'); 

const router = express.Router();

// 1) GET /api/resenas/me — Obtener reseñas del usuario autenticado
router.get(
  '/me',
  protect,
  resenaController.getResenasByUser
);


// 2) GET /api/resenas/product/:menuItemId — Listar reseñas de un producto específico
router.get(
  '/product/:menuItemId',
  param('menuItemId').isMongoId().withMessage('menuItemId inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  resenaController.getResenasByProducto
);

// 3) POST /api/resenas — Crear nueva reseña (usuario autenticado)
router.post(
  '/',
  protect,
  body('restauranteId').isMongoId().withMessage('restauranteId inválido'),
  body('ordenId').isMongoId().withMessage('ordenId inválido'),
  body('menuItemId').optional().isMongoId().withMessage('menuItemId inválido'),
  body('calificacion')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5'),
  body('comentario').notEmpty().withMessage('El comentario es obligatorio'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  resenaController.createResena
);

// 4) GET /api/resenas/all — Listar todas las reseñas (admin)
router.get(
  '/all',
  protect,
  restrictTo('admin'),
  resenaController.getResenas
);

// Nueva ruta para stats de reseñas (solo admin)
router.get(
  '/stats',
  protect,
  restrictTo('admin'),
  getReviewStats
)

/* NUEVO: filtrado */
router.get('/filter',
  protect, restrictTo('admin'),
  filterCtrl.filterResenas
);

// 5) GET /api/resenas/:id — Obtener reseña por ID (admin)
router.get(
  '/:id',
  protect,
  restrictTo('admin'),
  param('id').isMongoId().withMessage('ID de reseña inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  resenaController.getResenaById
);

// 6) PUT /api/resenas/:id — Actualizar reseña por ID (admin)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  param('id').isMongoId().withMessage('ID de reseña inválido'),
  body('calificacion')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5'),
  body('comentario')
    .optional()
    .notEmpty().withMessage('El comentario no puede estar vacío'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  resenaController.updateResena
);

// 7) DELETE /api/resenas/:id — Eliminar reseña por ID (admin)
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  param('id').isMongoId().withMessage('ID de reseña inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  resenaController.deleteResena
);

module.exports = router;
