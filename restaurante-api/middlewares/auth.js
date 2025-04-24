// middlewares/auth.js

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario'); // Ajusta el path según tu modelo

/**
 * protect: verifica el JWT y adjunta req.usuario
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1) Obtener token desde el header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, autorización denegada' });
  }

  try {
    // 2) Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Cargar usuario y excluir la contraseña
    const usuario = await Usuario.findById(decoded.id).select('-password');
    if (!usuario) {
      return res.status(401).json({ msg: 'Usuario no encontrado' });
    }

    // 4) Adjuntar usuario al request
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: 'Token no válido' });
  }
};

/**
 * restrictTo: limita el acceso a ciertos roles
 * @param  {...string} roles — lista de roles permitidos
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.usuario debe venir de protect()
    if (!req.usuario) {
      return res
        .status(500)
        .json({ msg: 'El middleware protect debe ejecutarse antes de restrictTo' });
    }
    if (!roles.includes(req.usuario.role)) {
      return res
        .status(403)
        .json({ msg: 'Permisos insuficientes para acceder a este recurso' });
    }
    next();
  };
};
