const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/usuarios/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email: email.trim() });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Genera un JWT con expiración de 15 minutos
    const resetToken = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Aquí enviarías resetToken por email en un link de tu frontend:
    // https://tu-frontend/reset-password?token=<resetToken>

    res.json({ message: 'Token de recuperación enviado al email' });
  } catch (error) {
    next(error);
  }
};

// POST /api/usuarios/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verifica y decodifica el JWT
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Busca al usuario por el id decodificado
    const usuario = await Usuario.findById(payload.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Hashea y actualiza la contraseña
    usuario.password = await bcrypt.hash(password, 10);
    await usuario.save();

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    next(error);
  }
};
