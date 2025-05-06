// routes/rests.js
const express = require('express')
const router = express.Router()
const Restaurante = require('../models/Restaurante')

// GET  /api/restaurantes
router.get('/', async (req, res) => {
  try {
    const restaurantes = await Restaurante.find()
    res.json(restaurantes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET  /api/restaurantes/:id
router.get('/:id', async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id)
    if (!restaurante) 
      return res.status(404).json({ message: 'Restaurante no encontrado' })
    res.json(restaurante)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/restaurantes
router.post('/', async (req, res) => {
  const { nombre, direccion, ubicacion, telefono, email, horario } = req.body
  const nuevo = new Restaurante({ nombre, direccion, ubicacion, telefono, email, horario })

  try {
    const guardado = await nuevo.save()
    res.status(201).json(guardado)
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.entries(err.errors).reduce((acc, [key, { message }]) => {
        acc[key] = message
        return acc
      }, {})
      return res.status(400).json({ message: 'ValidationError', errors })
    }
    res.status(500).json({ message: err.message })
  }
})

// PUT  /api/restaurantes/:id
router.put('/:id', async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id)
    if (!restaurante) 
      return res.status(404).json({ message: 'Restaurante no encontrado' })

    Object.assign(restaurante, req.body)
    const actualizado = await restaurante.save()
    res.json(actualizado)
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.entries(err.errors).reduce((acc, [key, { message }]) => {
        acc[key] = message
        return acc
      }, {})
      return res.status(400).json({ message: 'ValidationError', errors })
    }
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/restaurantes/:id
router.delete('/:id', async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id)
    if (!restaurante) 
      return res.status(404).json({ message: 'Restaurante no encontrado' })

    await Restaurante.deleteOne({ _id: req.params.id })
    res.json({ message: 'Restaurante eliminado' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
