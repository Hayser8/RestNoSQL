// frontend/src/components/perfil/ReviewsSection.jsx
"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  Edit,
  Trash2,
  ShoppingBag,
  Coffee,
} from "lucide-react"
import StarRating from "../common/StarRating"
import ConfirmDialog from "../common/ConfirmDialog"
import EditReviewModal from "./EditReviewModal"

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)

  const [editDialog, setEditDialog] = useState({ open: false, review: null })

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No se encontró el token de sesión.")
        setLoading(false)
        return
      }
      try {
        const res = await fetch("http://localhost:5000/api/resenas/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || "Error al cargar tus reseñas")
        }
        const data = await res.json()
        const formatted = data.map(r => ({
          id: r._id,
          restauranteNombre: r.restauranteId?.nombre || "Restaurante eliminado",
          ordenId: r.ordenId?._id || "N/A",
          tipo: r.menuItemId ? "item" : "order",
          articuloId: r.menuItemId || null,
          articuloNombre: r.menuItemId?.nombre || "",
          calificacion: r.calificacion,
          comentario: r.comentario,
          fecha: new Date(r.ordenId?.fecha || Date.now()),
          // Pasamos también datos mínimos de "order" para el modal
          restaurante: {
            id: r.restauranteId?._id,
            nombre: r.restauranteId?.nombre,
          },
          articulos: (r.ordenId?.articulos || []).map(a => ({
            id: a.menuItemId,
            nombre: a.menuItemId?.nombre,
            cantidad: a.cantidad,
          })),
        }))
        // Más nuevo primero
        formatted.sort((a, b) => b.fecha - a.fecha)
        setReviews(formatted)
      } catch (err) {
        console.error("Error al obtener reseñas:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const formatDate = date =>
    date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  // Eliminar
  const handleDeleteClick = review => {
    setReviewToDelete(review)
    setIsDeleteDialogOpen(true)
  }
  const confirmDelete = async () => {
    if (!reviewToDelete) return
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token para eliminar")
      const res = await fetch(
        `http://localhost:5000/api/resenas/${reviewToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) throw new Error("Error al eliminar reseña")
      setReviews(rs => rs.filter(r => r.id !== reviewToDelete.id))
    } catch (err) {
      alert(err.message)
    } finally {
      setIsDeleteDialogOpen(false)
      setReviewToDelete(null)
    }
  }
  const cancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setReviewToDelete(null)
  }

  // Editar
  const openEdit = review => {
    setEditDialog({ open: true, review })
  }
  const closeEdit = () => {
    setEditDialog({ open: false, review: null })
  }
  const handleUpdate = updatedReview => {
    setReviews(rs =>
      rs.map(r => (r.id === updatedReview.id ? updatedReview : r))
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-light text-blue-900 mb-6">Mis Reseñas</h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando reseñas...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No has dejado ninguna reseña aún.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {review.restauranteNombre}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(review.fecha)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEdit(review)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Editar reseña"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(review)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    title="Eliminar reseña"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center">
                <StarRating rating={review.calificacion} size="small" />
                <div className="ml-3 flex items-center text-sm text-gray-600">
                  {review.tipo === "order" ? (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      <span>Reseña de orden completa</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-4 h-4 mr-1" />
                      <span>Reseña de artículo: {review.articuloNombre}</span>
                    </>
                  )}
                </div>
              </div>

              <p className="mt-3 text-gray-700">{review.comentario}</p>
              <div className="mt-3 text-sm text-gray-500">
                Pedido #{review.ordenId}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        title="Eliminar reseña"
        message="¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {editDialog.open && (
        <EditReviewModal
          review={editDialog.review}
          order={editDialog.review}
          onClose={closeEdit}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
