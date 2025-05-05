// frontend/src/components/perfil/CreateReviewModal.jsx
"use client"

import { useState } from "react"
import { X } from "lucide-react"
import StarRating from "../common/StarRating"

export default function CreateReviewModal({
  order,
  onClose,
  onReviewCreated,
}) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewType, setReviewType] = useState("order") // "order" o "item"
  const [selectedItemId, setSelectedItemId] = useState("")

  const handleSubmit = async (e) => {
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
      setError("Por favor, selecciona un artículo para reseñar")
      return
    }

    setIsSubmitting(true)
    try {
      // Montamos el payload
      const payload = {
        ordenId: order.id,
        restauranteId: order.restaurante.id,
        calificacion: rating,
        comentario: comment.trim(),
      }
      if (reviewType === "item") {
        payload.menuItemId = selectedItemId
      }

      // Llamada a tu API de back (puerto 5000)
      const res = await fetch("http://localhost:5000/api/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      })

      // Manejo de errores de validación
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const msg =
          errorData.message ||
          (errorData.errors && errorData.errors[0]?.msg) ||
          "Error al enviar reseña"
        throw new Error(msg)
      }

      // Éxito: notificamos al padre y cerramos
      onReviewCreated(order.id)
      onClose()
    } catch (err) {
      console.error("Error al enviar reseña:", err)
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        {/* Fondo gris semi-transparente que no bloquea clicks */}
        <div
          className="fixed inset-0 bg-gray-500 opacity-75 pointer-events-none"
          aria-hidden="true"
        />

        {/* Hack para centrar en Safari */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Contenedor del modal */}
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Dejar una reseña
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={isSubmitting}
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-500">
              Pedido #{order.id} en {order.restaurante.nombre}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo: orden o item */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Qué deseas reseñar?
                </label>
                <div className="space-y-2">
                  {["order", "item"].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="review-type"
                        value={type}
                        checked={reviewType === type}
                        onChange={() => setReviewType(type)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {type === "order"
                          ? "La orden completa"
                          : "Un artículo específico"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selector de ítem */}
              {reviewType === "item" && (
                <div>
                  <label
                    htmlFor="item-select"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Selecciona el artículo
                  </label>
                  <select
                    id="item-select"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona un artículo</option>
                    {order.articulos.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombre} (x{item.cantidad})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Calificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cómo calificarías tu experiencia?
                </label>
                <div className="flex items-center">
                  <StarRating
                    rating={rating}
                    onChange={setRating}
                    interactive
                    size="large"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    {rating > 0
                      ? `${rating} de 5 estrellas`
                      : "Selecciona una calificación"}
                  </span>
                </div>
              </div>

              {/* Comentario */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tu comentario
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    reviewType === "order"
                      ? "Cuéntanos tu experiencia con este pedido..."
                      : "Cuéntanos tu experiencia con este artículo..."
                  }
                  className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar reseña"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
