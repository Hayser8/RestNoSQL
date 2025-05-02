// src/app/cart/layout.jsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: "Carrito de Compra | Mamis Restaurant",
  description: "Revisa y finaliza tu pedido en Mamis Restaurant",
}

export default function CartLayout({ children }) {
  return (
    // Aquí forzamos fondo blanco en todo el carrito
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header personalizado solo para /cart */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link
            href="/menu"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al menú
          </Link>
          <h1 className="ml-auto text-xl font-medium text-blue-900">
            Carrito de Compra
          </h1>
        </div>
      </header>

      {/* Aquí renderizamos tu CartPage */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}
