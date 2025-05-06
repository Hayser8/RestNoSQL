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

/**
 * GET /api/articulos?categoria=...
 * Listar artículos filtrados por categoría
 */
exports.getArticulosByCategory = async (req, res, next) => {
  try {
    const { categoria } = req.query
    const articulos = await ArticuloMenu.find({ categoria })
    res.json(articulos)
  } catch (error) {
    next(error)
  }
}

/** POST /api/articulos-menu/bulk */
exports.bulkImport = async (req, res, next) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Envía un array de artículos' });
    }

    const ops = items.map(item => {
      const precio = parseFloat(item.precio);
      if (
        !item.nombre || typeof item.nombre !== 'string' ||
        !item.descripcion || typeof item.descripcion !== 'string' ||
        isNaN(precio) ||
        !item.categoria || typeof item.categoria !== 'string' ||
        !item.imagen || typeof item.imagen !== 'string'
      ) {
        throw new Error(`Validación fallida para el artículo: ${item.nombre || 'sin nombre'}`);
      }

      return {
        updateOne: {
          filter: { nombre: item.nombre.trim() },
          update: {
            $set: {
              nombre: item.nombre.trim(),
              descripcion: item.descripcion.trim(),
              precio: precio,  // Ahora correctamente parseado como número
              categoria: item.categoria.trim(),
              imagen: item.imagen.trim()
            }
          },
          upsert: true
        }
      };
    });

    await ArticuloMenu.bulkWrite(ops);

    const nombres = items.map(i => i.nombre.trim());
    const imported = await ArticuloMenu.find({ nombre: { $in: nombres } });

    res.json(imported);
  } catch (err) {
    console.error('Bulk import error:', err);
    res.status(500).json({ error: err.message });
  }
};