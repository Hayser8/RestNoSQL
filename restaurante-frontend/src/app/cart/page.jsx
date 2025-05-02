'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  Info,
} from 'lucide-react'
import { useCart } from '@/components/common/CartContext'

// Loader que simplemente retorna la URL tal cual
const externalLoader = ({ src }) => src

export default function CartPage() {
  const router = useRouter()
  const {
    items: cartItems,
    promoCode,
    promoApplied,
    removeItem,
    updateQuantity,
    applyPromo,
    setPromoCode,
  } = useCart()

  const [isLoading, setIsLoading] = useState(false)

  // Cálculos
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 30 ? 0 : 3.99
  const total = subtotal - discount + shipping

  // Aplicar código promocional
  const handleApplyPromo = () => {
    setIsLoading(true)
    setTimeout(() => {
      if (promoCode.toLowerCase() === 'descuento10') {
        applyPromo()
      }
      setIsLoading(false)
    }, 800)
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-8">
        <Link href="/menu" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al menú
        </Link>
        <h1 className="text-2xl md:text-3xl font-light text-blue-900 ml-auto">Tu carrito</h1>
        <div className="ml-auto flex items-center">
          <ShoppingBag className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-blue-900 font-medium">{cartItems.length} productos</span>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium text-blue-900">Productos en tu carrito</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-6">
                    <div className="flex items-center">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          loader={externalLoader}
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          width={80}
                          height={80}
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-blue-900">{item.name}</h3>
                          <p className="text-base font-medium text-blue-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatPrice(item.price)} por unidad
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="p-2 text-gray-600 hover:text-blue-600"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, +1)}
                              className="p-2 text-gray-600 hover:text-blue-600"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-4">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium text-blue-900">Resumen del pedido</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento (10%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Gastos de envío</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>

                {!promoApplied && (
                  <div>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Código promocional"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-l-md focus:outline-none"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={isLoading || !promoCode}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-r-md ${
                          isLoading || !promoCode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                        }`}
                      >
                        {isLoading ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Prueba con "DESCUENTO10"</p>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-blue-900">Total</span>
                    <span className="text-xl font-medium text-blue-900">{formatPrice(total)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Impuestos incluidos</div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex items-center justify-center mt-6"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceder al pago
                </button>

                <Link
                  href="/menu"
                  className="w-full block text-center bg-white text-blue-600 border border-blue-600 py-3 rounded-md hover:bg-blue-50 mt-2"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  Envío gratuito en pedidos superiores a 30€. Entrega estimada: 30–45 minutos.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-medium text-blue-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">Parece que aún no has añadido productos a tu carrito.</p>
          <Link
            href="/menu"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver nuestro menú
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
