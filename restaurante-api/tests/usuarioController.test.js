
// __tests__/usuarioController.test.js

const usuarioController = require('../controllers/usuarioController');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/Usuario');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('usuarioController.register', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
        telefono: '12345678',
        direccion: 'Some Street',
        nit: '1234',
        password: 'password'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should hash password, create a user, and return 201', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword');
    const createdUser = { _id: 'id1', ...req.body, password: 'hashedPassword', rol: 'user', fechaRegistro: expect.any(Date) };
    Usuario.create.mockResolvedValue(createdUser);

    await usuarioController.register(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(Usuario.create).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      telefono: '12345678',
      direccion: 'Some Street',
      nit: '1234',
      password: 'hashedPassword',
      rol: 'user',
      fechaRegistro: expect.any(Number)
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdUser);
  });

  it('should call next(error) on exception', async () => {
    const error = new Error('failure');
    bcrypt.hash.mockRejectedValue(error);

    await usuarioController.register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('usuarioController.login', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 404 if user not found', async () => {
    Usuario.findOne.mockResolvedValue(null);

    await usuarioController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  it('should return 401 if password does not match', async () => {
    const fakeUser = { password: 'hashed', rol: 'user', _id: 'id1' };
    Usuario.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(false);

    await usuarioController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales inválidas' });
  });

  it('should return a token on successful login', async () => {
    const fakeUser = { password: 'hashed', rol: 'user', _id: 'id1' };
    Usuario.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('jwt_token');

    await usuarioController.login(req, res, next);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 'id1', rol: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    expect(res.json).toHaveBeenCalledWith({ token: 'jwt_token' });
  });

  it('should call next(error) on exception', async () => {
    const error = new Error('db error');
    Usuario.findOne.mockRejectedValue(error);

    await usuarioController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
