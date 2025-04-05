const express = require('express');
const router = express.Router();

// Importa controladores
const restauranteController = require('../controllers/restauranteController');
const usuarioController = require('../controllers/usuarioController');
const ordenController = require('../controllers/ordenController');
const resenaController = require('../controllers/resenaController');
const articuloController = require('../controllers/articuloController');

// Rutas para Restaurantes
router.get('/restaurantes', restauranteController.getAllRestaurantes);

// Rutas para Usuarios
router.post('/usuarios/register', usuarioController.register);
router.post('/usuarios/login', usuarioController.login);

// Rutas para Órdenes
router.post('/ordenes', ordenController.createOrden);

// Rutas para Reseñas
router.post('/resenas', resenaController.createResena);
router.get('/resenas', resenaController.getResenas);
router.get('/resenas/:id', resenaController.getResenaById);
router.put('/resenas/:id', resenaController.updateResena);
router.delete('/resenas/:id', resenaController.deleteResena);

// Rutas para Artículos del Menú
router.get('/articulos', articuloController.getArticulos);
router.get('/articulos/:id', articuloController.getArticuloById);
router.post('/articulos', articuloController.createArticulo);
router.put('/articulos/:id', articuloController.updateArticulo);
router.delete('/articulos/:id', articuloController.deleteArticulo);

module.exports = router;
