// src/components/menu/DishReviews.jsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

export default function DishReviews({ dish }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    // Comprobar sesión
    setIsAuth(!!localStorage.getItem('userSession'))
  }, [])

  useEffect(() => {
    if (!dish?._id) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/resenas/product/${dish._id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then(data => setReviews(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [dish._id])

  const sendReview = async () => {
    if (!isAuth) {
      alert('Debes iniciar sesión para dejar una reseña.')
      return
    }
    if (!comment.trim()) {
      alert('El comentario no puede estar vacío.')
      return
    }
    setSubmitting(true)
    try {
      const restauranteId = localStorage.getItem('restauranteId')
      if (!restauranteId) {
        alert('No hay restaurante seleccionado.')
        return
      }
      const payload = {
        restauranteId,
        ordenId: null,
        calificacion: rating,
        comentario: comment.trim(),
      }
      const res = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // si usas sesiones
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const nueva = await res.json()
      setReviews([nueva, ...reviews])
      setComment('')
      setRating(5)
    } catch (err) {
      console.error('Error enviando reseña:', err)
      alert('No se pudo enviar la reseña.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-gray-900">Cargando reseñas…</p>

  return (
    <div className="mt-12">
      {/* Formulario de nueva reseña */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h4 className="font-medium mb-2 text-gray-900">Deja tu reseña</h4>
        {!isAuth && (
          <p className="mb-4 text-red-600">Debes iniciar sesión para enviar una reseña.</p>
        )}
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onClick={() => setRating(s)}
              disabled={!isAuth || submitting}
            >
              <Star
                className={`w-6 h-6 ${
                  s <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          className="w-full border p-2 rounded mb-2 text-gray-900"
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={!isAuth || submitting}
        />
        <button
          onClick={sendReview}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!isAuth || submitting}
        >
          {submitting ? 'Enviando…' : 'Enviar reseña'}
        </button>
      </div>

      {/* Lista de reseñas */}
      {reviews.length > 0 ? (
        reviews.map(r => (
          <div key={r._id} className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-start mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 relative">
                <Image
                  loader={({ src }) => src}
                  src={r.usuarioAvatar || '/placeholder.png'}
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
        ))
      ) : (
        <p className="text-center text-gray-500">
          No hay reseñas para este producto.
        </p>
      )}
    </div>
  )
}
