'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function PopularDishesSection() {
  const [dishes, setDishes] = useState([])

  useEffect(() => {
    fetch('/api/popular-dishes')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => {
        console.log('🛠 Debug – popular dishes fetched:', data)
        setDishes(data)
      })
      .catch(err => console.error('Error fetching popular dishes:', err))
  }, [])

  return (
    <section className="py-20 px-4 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium mb-4">
            Nuestros favoritos
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-blue-900">
            Platos más <span className="font-semibold">populares</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre los platos que nuestros clientes más aman y que han hecho de Mamis Restaurant el restaurante favorito de la ciudad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish, idx) => (
            <div
              key={dish.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={dish.imagen || '/placeholder.png'}
                  width={400}
                  height={240}
                  alt={dish.nombre}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                <div className="absolute top-4 right-4 bg-blue-600 rounded-md px-3 py-1 text-xs font-medium text-white">
                  Bestseller
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-medium text-blue-900">
                    {dish.nombre}
                  </h3>
                  <div className="text-blue-600 font-medium">
                    ${dish.precio.toFixed(2)}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {dish.descripcion}
                </p>
                <button className="w-full py-3 bg-blue-50 text-blue-600 font-medium rounded-md hover:bg-blue-100 transition-colors">
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-flex items-center bg-white text-gray-800 border border-gray-200 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition duration-300"
          >
            Ver menú completo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
