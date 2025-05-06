// routes/menu.js
const express = require('express');
const router = express.Router();
const ArticuloMenu = require('../models/ArticuloMenu');

// GET  /api/articulos-menu
// Listar todos los artículos del menú
router.get('/', async (req, res) => {
  try {
    const articulos = await ArticuloMenu.find();
    res.json(articulos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET  /api/articulos-menu/:id
// Obtener un artículo por su ID
router.get('/:id', async (req, res) => {
  try {
    const articulo = await ArticuloMenu.findById(req.params.id);
    if (!articulo) return res.status(404).json({ message: 'Artículo no encontrado' });
    res.json(articulo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/articulos-menu
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio, categoria, imagen } = req.body;
    if (!nombre || !descripcion || precio == null || !categoria || !imagen) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    const nuevoArticulo = new ArticuloMenu({ nombre, descripcion, precio, categoria, imagen });
    try {
      const guardado = await nuevoArticulo.save();
      return res.status(201).json(guardado);
  
    } catch (err) {
      // Si es un error de validación de Mongoose
      if (err.name === 'ValidationError') {
        // arma un objeto con cada mensaje de error
        const errores = Object.keys(err.errors).reduce((obj, key) => {
          obj[key] = err.errors[key].message;
          return obj;
        }, {});
        return res.status(400).json({
          message: 'ValidationError',
          errors: errores
        });
      }
      // cualquier otro
      return res.status(500).json({ message: err.message });
    }
  });

// PUT  /api/articulos-menu/:id
// Actualizar un artículo existente
router.put('/:id', async (req, res) => {
  try {
    const articulo = await ArticuloMenu.findById(req.params.id);
    if (!articulo) return res.status(404).json({ message: 'Artículo no encontrado' });

    const { nombre, descripcion, precio, categoria, imagen } = req.body;
    if (nombre !== undefined)     articulo.nombre      = nombre;
    if (descripcion !== undefined) articulo.descripcion = descripcion;
    if (precio !== undefined)      articulo.precio      = precio;
    if (categoria !== undefined)   articulo.categoria   = categoria;
    if (imagen !== undefined)      articulo.imagen      = imagen;

    const actualizado = await articulo.save();
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/articulos-menu/:id
router.delete('/:id', async (req, res) => {
  try {
    const articulo = await ArticuloMenu.findById(req.params.id);
    if (!articulo) 
      return res.status(404).json({ message: 'Artículo no encontrado' });

    // Usamos deleteOne en lugar de remove()
    await ArticuloMenu.deleteOne({ _id: req.params.id });
    return res.json({ message: 'Artículo eliminado' });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
