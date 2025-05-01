// src/components/checkout/hooks/useCheckout.js
'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/common/CartContext'

export function useCheckout() {
  const {
    items: cartItems,
    promoApplied,
    clearCart,
  } = useCart()

  const [restaurants, setRestaurants] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    selectedRestaurant: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
    saveCard: false,
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  // 1) Carga restaurantes desde tu API
  useEffect(() => {
    fetch('/api/restaurantes')
      .then((res) => res.json())
      .then((data) => {
        // mapear _id → id, nombre → name, etc.
        const mapped = data.map(r => ({
          id: r._id,
          name: r.nombre,
          address: r.direccion,
          estimatedTime: r.tiempoEstimado,
        }))
        setRestaurants(mapped)
      })
  }, [])

  // 2) Totales
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 30 ? 0 : 3.99
  const total = subtotal - discount + shipping

  // 3) Helpers de pasos
  const validateForm = () => {
    const newErrors = {}
    if (currentStep === 1 && !formData.selectedRestaurant) {
      newErrors.selectedRestaurant = 'Por favor, selecciona un restaurante'
    }
    if (currentStep === 2) {
      if (!formData.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Número de tarjeta requerido'
      }
      if (!formData.cardName) {
        newErrors.cardName = 'Nombre en la tarjeta requerido'
      }
      if (!formData.cardExpiry) {
        newErrors.cardExpiry = 'Fecha de expiración requerida'
      }
      if (!formData.cardCvc) {
        newErrors.cardCvc = 'CVC requerido'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const nextStep = () => validateForm() && setCurrentStep(s => s + 1)
  const prevStep = () => setCurrentStep(s => s - 1)

  // 4) Procesar "pago" → crea la orden en tu API
  const processPayment = async () => {
    if (!validateForm()) return
    setIsProcessing(true)
    try {
      const usuarioId     = localStorage.getItem('userId')
      const restauranteId = formData.selectedRestaurant
      const payload = {
        usuarioId,
        restauranteId,
        fecha: new Date(),
        estado: 'pendiente',
        total,
        articulos: cartItems.map(i => ({
          menuItemId:   i.id,
          nombre:       i.name,
          cantidad:     i.quantity,
          precio:       i.price,
        })),
      }

      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Error al crear la orden')

      clearCart()
      setCurrentStep(3)
    } catch (err) {
      console.error(err)
      alert('Error al procesar tu pedido')
    } finally {
      setIsProcessing(false)
    }
  }

  // 5) Formateadores
  const formatPrice = (v) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)

  const formatCardNumber = (v) =>
    v.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || v

  const formatExpiryDate = (v) => {
    const digits = v.replace(/\D/g, '')
    return digits.length > 2
      ? digits.slice(0,2) + '/' + digits.slice(2,4)
      : digits
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: null }))
  }

  return {
    currentStep,
    formData,
    errors,
    isProcessing,
    restaurants,
    cartItems,
    subtotal,
    discount,
    shipping,
    total,
    handleChange,
    nextStep,
    prevStep,
    processPayment,
    formatPrice,
    formatCardNumber,
    formatExpiryDate,
  }
}
