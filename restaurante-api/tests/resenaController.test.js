const resenaController = require('../controllers/resenaController');
const Resena = require('../models/Resena');

jest.mock('../models/Resena');

describe('resenaController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {}, user: { id: 'user1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createResena', () => {
    it('should create a reseña and return 201', async () => {
      req.body = {
        restauranteId: 'rest1',
        ordenId: 'ord1',
        calificacion: 4,
        comentario: '  Buen servicio  '
      };
      const created = { 
        usuarioId: 'user1',
        restauranteId: 'rest1',
        ordenId: 'ord1',
        calificacion: 4,
        comentario: 'Buen servicio'
      };
      Resena.create.mockResolvedValue(created);

      await resenaController.createResena(req, res, next);

      expect(Resena.create).toHaveBeenCalledWith({
        usuarioId: 'user1',
        restauranteId: 'rest1',
        ordenId: 'ord1',
        calificacion: 4,
        comentario: 'Buen servicio'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Resena.create.mockRejectedValue(error);

      await resenaController.createResena(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getResenas', () => {
    it('should list all reseñas', async () => {
      const fakeResenas = [{ _id: 'r1' }, { _id: 'r2' }];
      // make a thenable chainable query stub
      const fakeQuery = {};
      fakeQuery.populate = jest.fn().mockReturnValue(fakeQuery);
      fakeQuery.then = (resolve) => resolve(fakeResenas);
      Resena.find.mockReturnValue(fakeQuery);

      await resenaController.getResenas(req, res, next);

      expect(Resena.find).toHaveBeenCalled();
      // populate called for usuarioId, restauranteId, ordenId
      expect(fakeQuery.populate).toHaveBeenCalledTimes(3);
      expect(res.json).toHaveBeenCalledWith(fakeResenas);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Resena.find.mockImplementation(() => { throw error; });

      await resenaController.getResenas(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getResenaById', () => {
    it('should return a reseña when found', async () => {
      req.params.id = '507f191e810c19729de860ea';
      const fakeRes = { _id: req.params.id };
      const fakeQuery = {};
      fakeQuery.populate = jest.fn().mockReturnValue(fakeQuery);
      fakeQuery.then = (resolve) => resolve(fakeRes);
      Resena.findById.mockReturnValue(fakeQuery);

      await resenaController.getResenaById(req, res, next);

      expect(Resena.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith(fakeRes);
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f191e810c19729de860ea';
      const fakeQuery = {};
      fakeQuery.populate = jest.fn().mockReturnValue(fakeQuery);
      fakeQuery.then = (resolve) => resolve(null);
      Resena.findById.mockReturnValue(fakeQuery);

      await resenaController.getResenaById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reseña no encontrada' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Resena.findById.mockImplementation(() => { throw error; });

      await resenaController.getResenaById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateResena', () => {
    it('should update and return reseña', async () => {
      req.params.id = '507f191e810c19729de860ea';
      req.body = { calificacion: 5, comentario: '  Excelente  ' };
      const updated = { calificacion: 5, comentario: 'Excelente' };
      Resena.findByIdAndUpdate.mockResolvedValue(updated);

      await resenaController.updateResena(req, res, next);

      expect(Resena.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        { calificacion: 5, comentario: 'Excelente' },
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f191e810c19729de860ea';
      req.body = {};
      Resena.findByIdAndUpdate.mockResolvedValue(null);

      await resenaController.updateResena(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reseña no encontrada' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Resena.findByIdAndUpdate.mockRejectedValue(error);

      await resenaController.updateResena(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteResena', () => {
    it('should delete and return success message', async () => {
      req.params.id = '507f191e810c19729de860ea';
      Resena.findByIdAndDelete.mockResolvedValue({});

      await resenaController.deleteResena(req, res, next);

      expect(Resena.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reseña eliminada correctamente' });
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f191e810c19729de860ea';
      Resena.findByIdAndDelete.mockResolvedValue(null);

      await resenaController.deleteResena(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reseña no encontrada' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      Resena.findByIdAndDelete.mockRejectedValue(error);

      await resenaController.deleteResena(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
