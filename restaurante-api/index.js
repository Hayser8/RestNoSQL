require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Monta las rutas de la API
app.use('/api', apiRoutes);

// Middleware para manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
