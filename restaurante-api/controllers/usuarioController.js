const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, telefono, direccion, nit, password, rol } = req.body;
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      nit,
      password: hashedPassword,
      rol,
      fechaRegistro: new Date()
    });
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
