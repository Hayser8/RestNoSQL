'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import TestimonialsCarousel from './TestimonialsCarousel'

export default function HeroSection({
  isAuthenticated,
  testimonials,
  currentTestimonial,
  nextTestimonial,
  prevTestimonial,
  avgRating,
  totalUsers,
  totalDishes
}) {
  return (
    <section className="pt-24 pb-16 px-4 relative overflow-hidden bg-[#F8FAFC] dark:bg-[#F8FAFC]">
      {/* blobs decorativos */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-blue-50 rounded-full filter blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* bloque de texto */}
          <div className="relative z-10">
            <div className="inline-block px-4 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium mb-4">
              Experiencia gastronómica
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight text-blue-900">
              Descubre el auténtico{' '}
              <span className="font-semibold">sabor de la cocina casera</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Platos preparados con ingredientes frescos y recetas tradicionales,
              llevados directamente a la puerta de tu hogar con un solo clic.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href={isAuthenticated ? '/usuario/menu' : '/registro'}
                className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
              >
                Ver menú <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center bg-white text-gray-800 border border-gray-200 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition duration-300"
              >
                Nuestras especialidades
              </Link>
            </div>

            {/* Estadísticas dinámicas */}
            <div className="flex gap-8 text-center mb-8">
              <div>
                <div className="text-3xl font-light text-blue-900">
                  {avgRating != null ? avgRating : '–––'}
                </div>
                <div className="text-sm text-gray-500">Calificación</div>
              </div>
              <div>
                <div className="text-3xl font-light text-blue-900">
                  {totalUsers != null ? totalUsers : '–––'}
                </div>
                <div className="text-sm text-gray-500">Clientes</div>
              </div>
              <div>
                <div className="text-3xl font-light text-blue-900">
                  {totalDishes != null ? totalDishes : '–––'}
                </div>
                <div className="text-sm text-gray-500">Platos</div>
              </div>
            </div>
          </div>

          {/* imagen principal + testimonios */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-md mb-8">
              <Image
                src="/restaurant.png"
                width={500}
                height={600}
                alt="Deliciosa comida"
                className="w-full h-auto object-cover"
                unoptimized
              />
            </div>

            <TestimonialsCarousel
              testimonials={testimonials}
              current={currentTestimonial}
              onNext={nextTestimonial}
              onPrev={prevTestimonial}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
