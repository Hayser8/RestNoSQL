// controllers/usuarioController.js

const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * POST /api/usuarios/register
 * Crea un nuevo usuario con rol 'user'
 */
exports.register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, telefono, direccion, nit, password } = req.body;
    const userData = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      telefono: telefono?.trim(),
      direccion: direccion?.trim(),
      nit: nit.trim(),
      password: await bcrypt.hash(password, 10),
      rol: 'user',
      fechaRegistro: Date.now()
    };
    const nuevoUsuario = await Usuario.create(userData);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/usuarios/login
 * Autentica usuario y devuelve JWT
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const usuario = await Usuario.findOne({ email: email.trim() })
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })

    let isMatch = false
    if (usuario.password.startsWith('$2')) {
      // es un hash bcrypt
      isMatch = await bcrypt.compare(password, usuario.password)
    } else {
      // contraseña en texto plano (sólo para seed/dev)
      isMatch = password === usuario.password
    }

    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' })

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/usuarios/forgot-password
 * Envía un JWT de recuperación con TTL corto
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email: email.trim() });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const resetToken = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Aquí deberías enviar `resetToken` por email en un link de tu frontend
    res.json({ message: 'Token de recuperación enviado al email' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/usuarios/reset-password/:token
 * Restablece la contraseña verificando el JWT
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const usuario = await Usuario.findById(payload.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    usuario.password = await bcrypt.hash(password, 10);
    await usuario.save();

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/usuarios/me
 * Devuelve datos del usuario autenticado
 */
exports.getMe = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-password');
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/usuarios/me
 * Actualiza perfil del usuario autenticado
 */
exports.updateMe = async (req, res, next) => {
  try {
    const updates = {};
    const { nombre, apellido, email, telefono, direccion } = req.body;
    if (nombre     !== undefined) updates.nombre    = nombre.trim();
    if (apellido   !== undefined) updates.apellido  = apellido.trim();
    if (email      !== undefined) updates.email     = email.trim();
    if (telefono   !== undefined) updates.telefono  = telefono.trim();
    if (direccion  !== undefined) updates.direccion = direccion.trim();

    const updated = await Usuario.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updated);
  } catch (error) {
    next(error);
  }
};


/**
 * GET /api/usuarios
 * Devuelve todos los usuarios (sólo admin)
 */
exports.getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find()
      .select('_id nombre apellido email rol fechaRegistro');   // ajusta los campos
    res.json(usuarios);
  } catch (err) { next(err); }
};