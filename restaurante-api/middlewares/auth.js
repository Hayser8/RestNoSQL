// middlewares/auth.js

const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')

/**
 * protect: verifica el JWT y adjunta req.user
 */
exports.protect = async (req, res, next) => {
  let token

  // 1) Obtener token desde el header Authorization: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, autorización denegada' })
  }

  try {
    // 2) Verificar y decodificar
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3) Buscar usuario y excluir la contraseña
    const user = await Usuario.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    // 4) Adjuntar user al request
    req.user = user
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Token no válido o expirado' })
  }
}

/**
 * restrictTo: limita el acceso a ciertos roles
 * @param  {...string} roles — lista de roles permitidos (ej: 'admin', 'user')
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user debe venir de protect()
    if (!req.user) {
      return res
        .status(500)
        .json({ message: 'El middleware protect debe ejecutarse antes de restrictTo' })
    }

    // En tu esquema el campo es "rol"
    if (!roles.includes(req.user.rol)) {
      return res
        .status(403)
        .json({ message: 'Permisos insuficientes para acceder a este recurso' })
    }

    next()
  }
}
