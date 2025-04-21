const express = require('express');
const router = express.Router();

// Monta cada router de recurso
router.use('/usuarios',      require('./usuarios'));
router.use('/restaurantes',  require('./restaurantes'));
router.use('/articulos',     require('./articulos'));
router.use('/ordenes',       require('./ordenes'));
router.use('/resenas',       require('./resenas'));

module.exports = router;
