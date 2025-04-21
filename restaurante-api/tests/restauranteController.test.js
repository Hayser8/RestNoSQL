
// __tests__/restauranteController.test.js

const restauranteController = require('../controllers/restauranteController');
const Restaurante = require('../models/Restaurante');

jest.mock('../models/Restaurante');

describe('restauranteController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRestaurantes', () => {
    it('should return list of restaurantes', async () => {
      const fakeList = [{ nombre: 'A' }, { nombre: 'B' }];
      Restaurante.find.mockResolvedValue(fakeList);

      await restauranteController.getAllRestaurantes(req, res, next);

      expect(Restaurante.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeList);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Restaurante.find.mockRejectedValue(error);

      await restauranteController.getAllRestaurantes(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getRestauranteById', () => {
    it('should return restaurante when found', async () => {
      const fakeRes = { nombre: 'Test' };
      req.params.id = '507f191e810c19729de860ea';
      Restaurante.findById.mockResolvedValue(fakeRes);

      await restauranteController.getRestauranteById(req, res, next);

      expect(Restaurante.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith(fakeRes);
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f191e810c19729de860ea';
      Restaurante.findById.mockResolvedValue(null);

      await restauranteController.getRestauranteById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante no encontrado' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      req.params.id = '507f191e810c19729de860ea';
      Restaurante.findById.mockRejectedValue(error);

      await restauranteController.getRestauranteById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createRestaurante', () => {
    it('should create and return new restaurante', async () => {
      req.body = {
        nombre: '  New  ',
        direccion: ' Addr ',
        ubicacion: { lat: 1.23, lng: 4.56 },
        telefono: ' 123 ',
        email: ' a@b.com ',
        horario: [
          { dia: 'Mon', apertura: '08:00', cierre: '17:00' }
        ]
      };
      const created = { ...req.body };
      Restaurante.create.mockResolvedValue(created);

      await restauranteController.createRestaurante(req, res, next);

      expect(Restaurante.create).toHaveBeenCalledWith({
        nombre: 'New',
        direccion: 'Addr',
        ubicacion: { lat: 1.23, lng: 4.56 },
        telefono: '123',
        email: 'a@b.com',
        horario: [{ dia: 'Mon', apertura: '08:00', cierre: '17:00' }]
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      req.body = {};
      Restaurante.create.mockRejectedValue(error);

      await restauranteController.createRestaurante(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateRestaurante', () => {
    it('should update and return restaurante', async () => {
      req.params.id = '507f191e810c19729de860ea';
      req.body = { nombre: ' Updated ', ubicacion: { lat: 9.87, lng: 6.54 } };
      const updated = { nombre: 'Updated', ubicacion: { lat: 9.87, lng: 6.54 } };
      Restaurante.findByIdAndUpdate.mockResolvedValue(updated);

      await restauranteController.updateRestaurante(req, res, next);

      expect(Restaurante.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        { nombre: 'Updated', ubicacion: { lat: 9.87, lng: 6.54 } },
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f191e810c19729de860ea';
      req.body = {};
      Restaurante.findByIdAndUpdate.mockResolvedValue(null);

      await restauranteController.updateRestaurante(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante no encontrado' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      req.params.id = '507f191e810c19729de860ea';
      Restaurante.findByIdAndUpdate.mockRejectedValue(error);

      await restauranteController.updateRestaurante(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteRestaurante', () => {
    it('should delete and return success message', async () => {
      req.params.id = '507f191e810c19729de860ea';
      Restaurante.findByIdAndDelete.mockResolvedValue({});

      await restauranteController.deleteRestaurante(req, res, next);

      expect(Restaurante.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante eliminado correctamente' });
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f191e810c19729de860ea';
      Restaurante.findByIdAndDelete.mockResolvedValue(null);

      await restauranteController.deleteRestaurante(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante no encontrado' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      req.params.id = '507f191e810c19729de860ea';
      Restaurante.findByIdAndDelete.mockRejectedValue(error);

      await restauranteController.deleteRestaurante(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
