const articuloController = require('../controllers/articuloController');
const ArticuloMenu = require('../models/ArticuloMenu');

jest.mock('../models/ArticuloMenu');

describe('articuloController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getArticulos', () => {
    it('should return list of articulos', async () => {
      const fakeList = [{ nombre: 'A' }, { nombre: 'B' }];
      ArticuloMenu.find.mockResolvedValue(fakeList);

      await articuloController.getArticulos(req, res, next);

      expect(ArticuloMenu.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeList);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      ArticuloMenu.find.mockRejectedValue(error);

      await articuloController.getArticulos(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getArticuloById', () => {
    it('should return articulo when found', async () => {
      const fakeArt = { _id: '507f1f77bcf86cd799439011', nombre: 'Test' };
      req.params.id = '507f1f77bcf86cd799439011';
      ArticuloMenu.findById.mockResolvedValue(fakeArt);

      await articuloController.getArticuloById(req, res, next);

      expect(ArticuloMenu.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith(fakeArt);
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      ArticuloMenu.findById.mockResolvedValue(null);

      await articuloController.getArticuloById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artículo no encontrado' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      req.params.id = '507f1f77bcf86cd799439011';
      ArticuloMenu.findById.mockRejectedValue(error);

      await articuloController.getArticuloById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createArticulo', () => {
    it('should create and return new articulo', async () => {
      req.body = {
        nombre: '  Nuevo  ',
        descripcion: ' Desc ',
        precio: 9.99,
        categoria: ' Cat ',
        imagen: ' http://img.com/1.png '
      };
      const created = {
        nombre: 'Nuevo',
        descripcion: 'Desc',
        precio: 9.99,
        categoria: 'Cat',
        imagen: 'http://img.com/1.png'
      };
      ArticuloMenu.create.mockResolvedValue(created);

      await articuloController.createArticulo(req, res, next);

      expect(ArticuloMenu.create).toHaveBeenCalledWith({
        nombre: 'Nuevo',
        descripcion: 'Desc',
        precio: 9.99,
        categoria: 'Cat',
        imagen: 'http://img.com/1.png'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      req.body = {
        nombre: 'X',
        descripcion: 'Y',
        precio: 1,
        categoria: 'Z',
        imagen: 'http://img'
      };
      ArticuloMenu.create.mockRejectedValue(error);

      await articuloController.createArticulo(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateArticulo', () => {
    it('should update and return articulo', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { nombre: ' Updated ', precio: 5.5 };
      const updated = { nombre: 'Updated', precio: 5.5 };
      ArticuloMenu.findByIdAndUpdate.mockResolvedValue(updated);

      await articuloController.updateArticulo(req, res, next);

      expect(ArticuloMenu.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        { nombre: 'Updated', precio: 5.5 },
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = {};
      ArticuloMenu.findByIdAndUpdate.mockResolvedValue(null);

      await articuloController.updateArticulo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artículo no encontrado' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      req.params.id = '507f1f77bcf86cd799439011';
      ArticuloMenu.findByIdAndUpdate.mockRejectedValue(error);

      await articuloController.updateArticulo(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteArticulo', () => {
    it('should delete and return success message', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      ArticuloMenu.findByIdAndDelete.mockResolvedValue({});

      await articuloController.deleteArticulo(req, res, next);

      expect(ArticuloMenu.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artículo eliminado correctamente' });
    });

    it('should return 404 when not found', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      ArticuloMenu.findByIdAndDelete.mockResolvedValue(null);

      await articuloController.deleteArticulo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artículo no encontrado' });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      req.params.id = '507f1f77bcf86cd799439011';
      ArticuloMenu.findByIdAndDelete.mockRejectedValue(error);

      await articuloController.deleteArticulo(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
