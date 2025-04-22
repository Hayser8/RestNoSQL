// components/landing/PopularDishes.jsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function PopularDishes() {
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
            Descubre los platos que nuestros clientes más aman y que han hecho de El Buen Sabor el restaurante favorito de la ciudad.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dish 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-60 overflow-hidden">
              <Image
                src="/placeholder.svg?height=240&width=400"
                width={400}
                height={240}
                alt="Paella Valenciana"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-blue-600 rounded-md px-3 py-1 text-xs font-medium text-white">
                Bestseller
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-medium text-blue-900">Paella Valenciana</h3>
                <div className="text-blue-600 font-medium">$18.99</div>
              </div>
              <p className="text-gray-600 mb-4">
                Auténtica paella con arroz, mariscos frescos, pollo y verduras de temporada.
              </p>
              <button className="w-full py-3 bg-blue-50 text-blue-600 font-medium rounded-md hover:bg-blue-100 transition-colors">
                Añadir al carrito
              </button>
            </div>
          </div>

          {/* Dish 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-60 overflow-hidden">
              <Image
                src="/placeholder.svg?height=240&width=400"
                width={400}
                height={240}
                alt="Risotto de Setas"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-blue-600 rounded-md px-3 py-1 text-xs font-medium text-white">
                Nuevo
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-medium text-blue-900">Risotto de Setas</h3>
                <div className="text-blue-600 font-medium">$15.99</div>
              </div>
              <p className="text-gray-600 mb-4">
                Cremoso risotto con variedad de setas silvestres, queso parmesano y hierbas frescas.
              </p>
              <button className="w-full py-3 bg-blue-50 text-blue-600 font-medium rounded-md hover:bg-blue-100 transition-colors">
                Añadir al carrito
              </button>
            </div>
          </div>

          {/* Dish 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-60 overflow-hidden">
              <Image
                src="/placeholder.svg?height=240&width=400"
                width={400}
                height={240}
                alt="Tacos de Carnitas"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-blue-600 rounded-md px-3 py-1 text-xs font-medium text-white">
                Popular
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-medium text-blue-900">Tacos de Carnitas</h3>
                <div className="text-blue-600 font-medium">$12.99</div>
              </div>
              <p className="text-gray-600 mb-4">
                Auténticos tacos mexicanos con carnitas, cebolla, cilantro y salsa casera picante.
              </p>
              <button className="w-full py-3 bg-blue-50 text-blue-600 font-medium rounded-md hover:bg-blue-100 transition-colors">
                Añadir al carrito
              </button>
            </div>
          </div>
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
