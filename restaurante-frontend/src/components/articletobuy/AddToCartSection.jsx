// src/components/menu/AddToCartSection.jsx
'use client'

import { useState } from 'react'
import { Minus, Plus, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/common/CartContext'

export default function AddToCartSection({ dish }) {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  // Hook del contexto
  const { addItem } = useCart()

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty)
    }
  }

  const calculateTotal = () => (dish.precio * quantity).toFixed(2)

  const handleAddToCart = () => {
    setLoading(true)
    try {
      // Añadimos al contexto
      addItem({
        id: dish._id,
        name: dish.nombre,
        price: dish.precio,
        image: dish.imagen || '/placeholder.svg',
        quantity,
      })
      alert(`${quantity} × ${dish.nombre} añadido${quantity > 1 ? 's' : ''} al carrito`)
    } catch (err) {
      console.error(err)
      alert('Error al añadir al carrito')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex flex-col h-full">
      {/* Título */}
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">
        {dish.nombre}
      </h2>

      {/* Descripción */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Descripción</h3>
        <p className="text-gray-700 text-sm">{dish.descripcion}</p>
      </div>

      {/* Contenido central */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Selector de cantidad */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-medium text-gray-700">Cantidad</span>
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || loading}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="mx-3 w-8 text-center font-medium text-black">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Total y favoritos */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500">Precio total</div>
            <div className="text-xl font-medium text-blue-900">
              € {calculateTotal()}
            </div>
          </div>
          <button
            onClick={() => setIsFavorite((f) => !f)}
            disabled={loading}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
              isFavorite
                ? 'bg-red-50 text-red-500'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            aria-label={
              isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'
            }
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Botón añadir al carrito */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="mt-6 w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
      >
        {loading ? (
          'Añadiendo…'
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 mr-2" />
            Añadir al carrito
          </>
        )}
      </button>
    </div>
  )
}
