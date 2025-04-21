// routes/usuarios.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// middleware para validación
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

// @route   POST /api/usuarios/register
// @desc    Registrar nuevo usuario (rol asignado por backend: 'user')
// @access  Public
router.post(
  '/register',
  validate(body('nombre').notEmpty().withMessage('El nombre es obligatorio')),
  validate(body('apellido').notEmpty().withMessage('El apellido es obligatorio')),
  validate(body('email').isEmail().withMessage('Email inválido')),
  validate(body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')),
  validate(body('nit').notEmpty().withMessage('El NIT es obligatorio')),
  usuarioController.register
);

// @route   POST /api/usuarios/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post(
  '/login',
  validate(body('email').isEmail().withMessage('Email inválido')),
  validate(body('password').notEmpty().withMessage('La contraseña es obligatoria')),
  usuarioController.login
);

// @route   POST /api/usuarios/forgot-password
// @desc    Iniciar proceso de recuperación de contraseña
// @access  Public
router.post(
  '/forgot-password',
  validate(body('email').isEmail().withMessage('Email inválido')),
  usuarioController.forgotPassword
);

// @route   POST /api/usuarios/reset-password/:token
// @desc    Restablecer contraseña usando token
// @access  Public
router.post(
  '/reset-password/:token',
  validate(body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')),
  usuarioController.resetPassword
);

// @route   GET /api/usuarios/me
// @desc    Obtener perfil del usuario autenticado
// @access  Private
router.get('/me', protect, usuarioController.getMe);

// @route   PUT /api/usuarios/me
// @desc    Actualizar perfil del usuario autenticado
// @access  Private
router.put(
  '/me',
  protect,
  validate(body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío')),
  validate(body('apellido').optional().notEmpty().withMessage('El apellido no puede estar vacío')),
  validate(body('email').optional().isEmail().withMessage('Email inválido')),
  validate(body('direccion').optional().notEmpty().withMessage('La dirección no puede estar vacía')),
  validate(body('telefono').optional().notEmpty().withMessage('El teléfono no puede estar vacío')),
  usuarioController.updateMe
);

module.exports = router;
