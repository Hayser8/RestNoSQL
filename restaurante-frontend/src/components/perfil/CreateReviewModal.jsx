"use client"

import { useState } from "react"
import { X } from "lucide-react"
import StarRating from "../common/StarRating"

export default function CreateReviewModal({ order, onClose }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewType, setReviewType] = useState("order") // "order" o "item"
  const [selectedItemId, setSelectedItemId] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

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
      // Aquí iría la lógica para enviar la reseña al servidor
      const reviewData = {
        ordenId: order.id,
        restauranteId: order.restaurante.id,
        calificacion: rating,
        comentario: comment,
        fecha: new Date(),
        tipo: reviewType,
      }

      // Si es una reseña de artículo específico, añadir el ID del artículo
      if (reviewType === "item") {
        const selectedItem = order.articulos.find((item) => item.id === selectedItemId)
        reviewData.articuloId = selectedItemId
        reviewData.articuloNombre = selectedItem ? selectedItem.nombre : ""
      }

      console.log("Reseña enviada:", reviewData)

      // Simulación de tiempo de carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Cerrar modal después de enviar
      onClose()
    } catch (error) {
      console.error("Error al enviar reseña:", error)
      setError("Error al enviar la reseña. Inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Dejar una reseña</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Pedido #{order.id} en {order.restaurante.nombre}
              </p>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué deseas reseñar?</label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="order-review"
                      name="review-type"
                      value="order"
                      checked={reviewType === "order"}
                      onChange={() => setReviewType("order")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="order-review" className="ml-2 block text-sm text-gray-700">
                      La orden completa
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="item-review"
                      name="review-type"
                      value="item"
                      checked={reviewType === "item"}
                      onChange={() => setReviewType("item")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="item-review" className="ml-2 block text-sm text-gray-700">
                      Un artículo específico
                    </label>
                  </div>
                </div>
              </div>

              {reviewType === "item" && (
                <div className="mb-6">
                  <label htmlFor="item-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona el artículo
                  </label>
                  <select
                    id="item-select"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cómo calificarías tu experiencia?
                </label>
                <div className="flex items-center">
                  <StarRating rating={rating} onChange={setRating} interactive size="large" />
                  <span className="ml-2 text-sm text-gray-500">
                    {rating > 0 ? `${rating} de 5 estrellas` : "Selecciona una calificación"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Tu comentario
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    reviewType === "order"
                      ? "Cuéntanos tu experiencia con este pedido..."
                      : "Cuéntanos tu experiencia con este artículo..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-70"
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
