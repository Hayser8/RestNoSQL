// components/landing/CallToAction.jsx
'use client'

import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'

export default function CallToAction() {
  return (
    <section className="py-20 px-4 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: App Download */}
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              ¿Listo para probar nuestros deliciosos platos?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-lg">
              Descarga nuestra app y disfruta de beneficios exclusivos, seguimiento de pedidos en tiempo real y mucho más.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="flex items-center bg-white text-blue-900 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
              >
                {/* App Store SVG */}
                <img src='/appstore.png' className="w-8 h-8 mr-3" alt="App Store" />
                <div>
                  <div className="text-xs">Descargar en</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center bg-white text-blue-900 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
              >
                {/* Google Play SVG */}
                <img src='/googleplay.png' className="w-7 h-7 mr-3" alt="Google Play" />
                <div>
                  <div className="text-xs">Disponible en</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right: Phone Subscription */}
          <div className="relative">
            <div className="bg-blue-800 rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-700 rounded-md flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium text-white">Pide por teléfono</h3>
                  <p className="text-blue-200">+502 0101 0101</p>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="w-full px-4 py-3 rounded-md bg-blue-700/50 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-blue-900 font-medium py-3 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  Suscríbete a nuestras ofertas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
