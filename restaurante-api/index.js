// app.js  (o index.js)
require('dotenv').config()                   // Cargar variables de entorno
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')     // tu función para conectar MongoDB
const apiRoutes = require('./routes/api')    // tu router /api

const app = express()

// 1) Conectar a la base de datos
connectDB()

// 2) Configurar CORS
//    Permitimos el origin definido en .env (CLIENT_URL) y el localhost:3000
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000'
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))

// 3) Middleware para parsear JSON
app.use(express.json())

// 4) Montar las rutas de la API
app.use('/api', apiRoutes)

// 5) Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || 'Algo salió mal!' })
})

// 6) Levantar servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
)
