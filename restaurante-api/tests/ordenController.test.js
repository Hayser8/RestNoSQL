const ordenController = require('../controllers/ordenController');
const Orden = require('../models/Orden');

jest.mock('../models/Orden');

describe('ordenController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {}, user: { id: 'user1', rol: 'user' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createOrden', () => {
    it('should calculate total, save and return 201', async () => {
      req.user.id = 'u1';
      req.body = {
        restauranteId: 'r1',
        articulos: [
          { menuItemId: 'm1', cantidad: 2, precio: 5 },
          { menuItemId: 'm2', cantidad: 1, precio: 3 }
        ]
      };
      // mock constructor to capture save
      const saved = { _id: 'o1', ...req.body, usuarioId: 'u1', total: 13, estado: 'confirmado' };
      Orden.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(saved)
      }));

      await ordenController.createOrden(req, res, next);

      expect(Orden).toHaveBeenCalledWith({
        usuarioId: 'u1',
        restauranteId: 'r1',
        articulos: req.body.articulos,
        total: 13,
        estado: 'confirmado'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(saved);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Orden.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      await ordenController.createOrden(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMyOrders', () => {
    it('should list user orders', async () => {
      req.user.id = 'u1';
      const fakeOrders = [{ _id: 'o1' }];
      // build a thenable query stub
      const q = {
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        then: (cb) => cb(fakeOrders)
      };
      Orden.find.mockReturnValue(q);

      await ordenController.getMyOrders(req, res, next);

      expect(Orden.find).toHaveBeenCalledWith({ usuarioId: 'u1' });
      expect(q.sort).toHaveBeenCalledWith({ fecha: -1 });
      // two populates: restauranteId and articulos.menuItemId
      expect(q.populate).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(fakeOrders);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Orden.find.mockImplementation(() => { throw error });

      await ordenController.getMyOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllOrders', () => {
    it('should list all orders', async () => {
      const fakeOrders = [{ _id: 'o1' }];
      const q = {
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        then: (cb) => cb(fakeOrders)
      };
      Orden.find.mockReturnValue(q);

      await ordenController.getAllOrders(req, res, next);

      expect(Orden.find).toHaveBeenCalled();
      expect(q.sort).toHaveBeenCalledWith({ fecha: -1 });
      // two populates: usuarioId and restauranteId
      expect(q.populate).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(fakeOrders);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Orden.find.mockImplementation(() => { throw error });

      await ordenController.getAllOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getOrdenById', () => {
    beforeEach(() => {
      req.user = { id: 'u1', rol: 'user' };
      req.params.id = 'o1';
    });

    it('should return order if owner', async () => {
      const fake = {
        usuarioId: { _id: 'u1' },
        populate: jest.fn(),
      };
      // stub chainable query
      const q = {
        populate: jest.fn().mockReturnThis(),
        then: (cb) => cb(fake)
      };
      Orden.findById.mockReturnValue(q);

      await ordenController.getOrdenById(req, res, next);

      expect(Orden.findById).toHaveBeenCalledWith('o1');
      expect(res.json).toHaveBeenCalledWith(fake);
    });

    it('should return 404 when not found', async () => {
      const q = {
        populate: jest.fn().mockReturnThis(),
        then: (cb) => cb(null)
      };
      Orden.findById.mockReturnValue(q);

      await ordenController.getOrdenById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Orden no encontrada' });
    });

    it('should return 403 if not owner nor admin', async () => {
      req.user = { id: 'u2', rol: 'user' };
      const fake = { usuarioId: { _id: 'u1' } };
      const q = {
        populate: jest.fn().mockReturnThis(),
        then: (cb) => cb(fake)
      };
      Orden.findById.mockReturnValue(q);

      await ordenController.getOrdenById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'No autorizado para ver esta orden' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Orden.findById.mockImplementation(() => { throw error });

      await ordenController.getOrdenById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateOrdenStatus', () => {
    beforeEach(() => {
      req.params.id = 'o1';
      req.body.estado = 'entregado';
    });

    it('should update estado and return order', async () => {
      const fake = { estado: 'confirmado', save: jest.fn().mockResolvedValue(true) };
      Orden.findById.mockResolvedValue(fake);

      await ordenController.updateOrdenStatus(req, res, next);

      expect(Orden.findById).toHaveBeenCalledWith('o1');
      expect(fake.estado).toBe('entregado');
      expect(fake.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fake);
    });

    it('should return 404 when not found', async () => {
      Orden.findById.mockResolvedValue(null);

      await ordenController.updateOrdenStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Orden no encontrada' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Orden.findById.mockRejectedValue(error);

      await ordenController.updateOrdenStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteOrden', () => {
    it('should delete and return success', async () => {
      req.params.id = 'o1';
      Orden.findByIdAndDelete.mockResolvedValue({});

      await ordenController.deleteOrden(req, res, next);

      expect(Orden.findByIdAndDelete).toHaveBeenCalledWith('o1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Orden eliminada correctamente' });
    });

    it('should return 404 when not found', async () => {
      req.params.id = 'o1';
      Orden.findByIdAndDelete.mockResolvedValue(null);

      await ordenController.deleteOrden(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Orden no encontrada' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Orden.findByIdAndDelete.mockRejectedValue(error);

      await ordenController.deleteOrden(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
