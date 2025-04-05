const ArticuloMenu = require('../models/ArticuloMenu');

// Obtener todos los artículos del menú
exports.getArticulos = async (req, res, next) => {
  try {
    const articulos = await ArticuloMenu.find();
    res.json(articulos);
  } catch (error) {
    next(error);
  }
};

// Obtener un artículo por ID
exports.getArticuloById = async (req, res, next) => {
  try {
    const articulo = await ArticuloMenu.findById(req.params.id);
    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json(articulo);
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo artículo
exports.createArticulo = async (req, res, next) => {
  try {
    const nuevoArticulo = new ArticuloMenu(req.body);
    const savedArticulo = await nuevoArticulo.save();
    res.status(201).json(savedArticulo);
  } catch (error) {
    next(error);
  }
};

// Actualizar un artículo existente
exports.updateArticulo = async (req, res, next) => {
  try {
    const updatedArticulo = await ArticuloMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedArticulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json(updatedArticulo);
  } catch (error) {
    next(error);
  }
};

// Eliminar un artículo
exports.deleteArticulo = async (req, res, next) => {
  try {
    const deletedArticulo = await ArticuloMenu.findByIdAndDelete(req.params.id);
    if (!deletedArticulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json({ message: 'Artículo eliminado' });
  } catch (error) {
    next(error);
  }
};
