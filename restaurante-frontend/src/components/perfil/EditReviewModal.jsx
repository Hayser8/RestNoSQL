// frontend/src/components/perfil/EditReviewModal.jsx
"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import StarRating from "../common/StarRating"

export default function EditReviewModal({
  review,    // { id, ordenId, restaurante, tipo, articuloId, articuloNombre, calificacion, comentario }
  order,     // { id, restaurante, articulos: [] }
  onClose,
  onUpdate,
}) {
  const [rating, setRating] = useState(review.calificacion)
  const [comment, setComment] = useState(review.comentario)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewType, setReviewType] = useState(review.tipo) // "order" o "item"
  const [selectedItemId, setSelectedItemId] = useState(review.articuloId || "")

  // Aquí guardaremos la orden completa con sus artículos
  const [fullOrder, setFullOrder] = useState({
    ...order,
    articulos: order.articulos || []
  })

  // Si no tenemos artículos, los cargamos desde el backend en el puerto 5000
  useEffect(() => {
    if (!fullOrder.articulos.length) {
      const token = localStorage.getItem("token")
      fetch(`http://localhost:5000/api/ordenes/${review.ordenId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error("No se pudo cargar la orden")
          return res.json()
        })
        .then(data => {
          const articulos = (data.articulos || []).map(a => ({
            id: a.menuItemId._id,
            nombre: a.menuItemId.nombre,
            cantidad: a.cantidad,
          }))
          setFullOrder({
            id: data._id,
            restaurante: {
              id: data.restauranteId._id,
              nombre: data.restauranteId.nombre,
            },
            articulos,
          })
        })
        .catch(err => {
          console.error(err)
          setError(err.message)
        })
    }
  }, [review.ordenId, fullOrder.articulos.length])

  // Sincronizar cuando cambie la reseña
  useEffect(() => {
    setRating(review.calificacion)
    setComment(review.comentario)
    setReviewType(review.tipo)
    setSelectedItemId(review.articuloId || "")
  }, [review])

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    // Validaciones
    if (rating === 0) {
      setError("Por favor, selecciona una calificación")
      return
    }
    if (!comment.trim()) {
      setError("Por favor, escribe un comentario")
      return
    }
    if (reviewType === "item" && !selectedItemId) {
      setError("Por favor, selecciona un artículo")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = { calificacion: rating, comentario: comment.trim() }
      if (reviewType === "item") payload.menuItemId = selectedItemId

      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/resenas/${review.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || "Error al actualizar reseña")
      }
      const updated = await res.json()

      const updatedReview = {
        ...review,
        calificacion: updated.calificacion,
        comentario: updated.comentario,
        tipo: updated.menuItemId ? "item" : "order",
        articuloId: updated.menuItemId || null,
        articuloNombre:
          fullOrder.articulos.find(a => a.id === updated.menuItemId)?.nombre || "",
      }

      onUpdate(updatedReview)
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const items = reviewType === "item" ? fullOrder.articulos : []

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-gray-500 opacity-75 pointer-events-none" />

      {/* CENTRADO */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* PANEL */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg pointer-events-auto">
          <div className="px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Editar reseña</h3>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* SUBHEADER */}
            <p className="mb-4 text-sm text-gray-500">
              Pedido #{order.id} en {order.restaurante.nombre}
            </p>
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* TIPO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Qué deseas reseñar?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="order"
                      checked={reviewType === "order"}
                      onChange={() => setReviewType("order")}
                      disabled={isSubmitting}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-600 ml-2">Orden completa</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="item"
                      checked={reviewType === "item"}
                      onChange={() => setReviewType("item")}
                      disabled={isSubmitting}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-600 ml-2">Artículo específico</span>
                  </label>
                </div>
              </div>

              {/* SELECTOR DE ÍTEM */}
              {reviewType === "item" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona el artículo
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={e => setSelectedItemId(e.target.value)}
                    disabled={isSubmitting}
                    className="text-gray-600 w-full px-3 py-2 border rounded"
                  >
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.nombre} (x{item.cantidad})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* CALIFICACIÓN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                <div className="flex items-center">
                  <StarRating rating={rating} onChange={setRating} interactive size="large" />
                  <span className="ml-2 text-sm text-gray-500">{rating} / 5</span>
                </div>
              </div>

              {/* COMENTARIO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  disabled={isSubmitting}
                  className="text-gray-600 w-full px-3 py-2 border rounded"
                />
              </div>

              {/* BOTONES */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
