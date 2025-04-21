// controllers/articuloController.js

const ArticuloMenu = require('../models/ArticuloMenu');

/**
 * GET /api/articulos
 * Listar todos los artículos del menú
 */
exports.getArticulos = async (req, res, next) => {
  try {
    const articulos = await ArticuloMenu.find();
    res.json(articulos);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/articulos/:id
 * Obtener un artículo por su ID
 */
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

/**
 * POST /api/articulos
 * Crear un nuevo artículo (solo admin)
 */
exports.createArticulo = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen } = req.body;
    const nuevoArticulo = await ArticuloMenu.create({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio,
      categoria: categoria.trim(),
      imagen: imagen.trim()
    });
    res.status(201).json(nuevoArticulo);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/articulos/:id
 * Actualizar un artículo existente (solo admin)
 */
exports.updateArticulo = async (req, res, next) => {
  try {
    // Solo tomamos los campos que importan
    const updates = {};
    if (req.body.nombre !== undefined)      updates.nombre      = req.body.nombre.trim();
    if (req.body.descripcion !== undefined) updates.descripcion = req.body.descripcion.trim();
    if (req.body.precio !== undefined)      updates.precio      = req.body.precio;
    if (req.body.categoria !== undefined)   updates.categoria   = req.body.categoria.trim();
    if (req.body.imagen !== undefined)      updates.imagen      = req.body.imagen.trim();

    const updated = await ArticuloMenu.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/articulos/:id
 * Eliminar un artículo (solo admin)
 */
exports.deleteArticulo = async (req, res, next) => {
  try {
    const deleted = await ArticuloMenu.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json({ message: 'Artículo eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
