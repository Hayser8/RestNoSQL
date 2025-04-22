// components/landing/FeaturesSection.jsx
'use client'

import { Clock, Award, Tag } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium mb-4">
            Nuestros beneficios
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-blue-900">
            ¿Por qué <span className="font-semibold">elegirnos</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nos esforzamos por ofrecer la mejor experiencia gastronómica a domicilio, combinando sabor, calidad y
            servicio excepcional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-blue-900">Pedidos rápidos</h3>
            <p className="text-gray-600 mb-4">
              Tu comida favorita en menos de 30 minutos directo a tu puerta, garantizando frescura y calidad.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-blue-900">Reseñas reales</h3>
            <p className="text-gray-600 mb-4">
              Opiniones verificadas de clientes que han disfrutado nuestros platos, transparencia total.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-blue-900">Promociones exclusivas</h3>
            <p className="text-gray-600 mb-4">
              Descuentos y ofertas especiales para nuestros clientes frecuentes, premiando tu fidelidad.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
