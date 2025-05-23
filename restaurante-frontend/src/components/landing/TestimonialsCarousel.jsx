'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function TestimonialsCarousel({
  testimonials = [],
  current = 0,
  onNext,
  onPrev
}) {
  // Si no hay testimonios, no renderizar nada
  if (!testimonials.length) return null

  const t = testimonials[current] || {}

  // Fallback a placeholder si no hay imagen
  const plainSrc = t.image
    ? t.image.split('?')[0]
    : '/placeholder.png?height=80&width=80'

  return (
    <div className="absolute -bottom-10 -left-10 md:-left-20 w-full max-w-sm bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-100">
          <Image
            src={plainSrc}
            alt={t.name || 'Testimonio'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            {Array.from({ length: t.rating || 0 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-blue-500 fill-current" />
            ))}
          </div>
          <p className="text-gray-700 text-sm mb-2 italic">
            "{t.comment || ''}"
          </p>
          <p className="font-medium text-gray-900">{t.name || ''}</p>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={onPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-1">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-label={`Testimonio ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
