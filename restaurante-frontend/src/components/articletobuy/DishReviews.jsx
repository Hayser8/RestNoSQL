// src/components/menu/DishReviews.jsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

export default function DishReviews({ dish }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!dish?._id) return setLoading(false)
    setLoading(true)
    fetch(`/api/resenas/product/${dish._id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [dish._id])

  if (loading) return <p className="text-gray-900">Cargando reseñas…</p>
  if (reviews.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">
        No hay reseñas para este producto.
      </p>
    )

  return (
    <div className="mt-12 space-y-4">
      {reviews.map(r => (
        <div key={r._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-start mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 relative">
              <Image
                loader={({ src }) => src}
                src={r.usuarioId.avatar || '/placeholder.png'}
                alt={`${r.usuarioId.nombre} ${r.usuarioId.apellido}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">
                  {r.usuarioId.nombre} {r.usuarioId.apellido}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(r.fecha).toLocaleDateString()}
                </span>
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= r.calificacion ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{r.comentario}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
