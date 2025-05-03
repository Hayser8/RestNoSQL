// frontend/src/components/perfil/OrderHistory.jsx
"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react"
import CreateReviewModal from "./CreateReviewModal"

export default function OrderHistory() {
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/ordenes/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Error al obtener pedidos")
        const data = await res.json()
        setOrders(
          data.map((orden) => ({
            id: orden._id,
            fecha: new Date(orden.fecha),
            restaurante: {
              id: orden.restauranteId._id,
              nombre: orden.restauranteId.nombre,
              direccion: orden.restauranteId.direccion,
            },
            estado: orden.estado,
            total: orden.total,
            articulos: orden.articulos.map((a, i) => ({
              id: a._id || `art-${i}`,
              nombre: a.menuItemId?.nombre || "Item eliminado",
              cantidad: a.cantidad,
              precio: a.precio,
            })),
            hasReview: false, // luego ajustamos esto al crearla
          }))
        )
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId))
  }

  const openReviewModal = (order) => {
    setSelectedOrder(order)
    setIsReviewModalOpen(true)
  }

  const closeReviewModal = () => {
    setIsReviewModalOpen(false)
    setSelectedOrder(null)
  }

  // Cuando el modal confirme la creación, marcamos el pedido como reseñado:
  const handleReviewCreated = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              hasReview: true,
            }
          : o
      )
    )
  }

  const formatDate = (date) =>
    date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const formatTime = (date) =>
    date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusColor = (status) => {
    switch (status) {
      case "entregado":
        return "bg-green-100 text-green-800"
      case "en preparación":
        return "bg-blue-100 text-blue-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-light text-blue-900 mb-6">
        Historial de Pedidos
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando pedidos...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No has realizado ningún pedido aún.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="bg-white p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="mr-3">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.estado
                        )}`}
                      >
                        {order.estado}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Pedido #{order.id}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(order.fecha)}</span>
                        <Clock className="w-4 h-4 ml-3 mr-1" />
                        <span>{formatTime(order.fecha)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 md:mt-0">
                    <div className="text-right mr-4">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-lg font-medium text-blue-900">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  {/* Detalles de ubicación */}
                  <div className="mb-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.restaurante.nombre}
                        </div>
                        <div className="text-gray-500">
                          {order.restaurante.direccion}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Artículos */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Artículos</h4>
                    <ul className="divide-y divide-gray-200">
                      {order.articulos.map((item) => (
                        <li key={item.id} className="py-2">
                          <div className="text-gray-800 flex justify-between">
                            <div>
                              <span className="text-gray-800 font-medium">
                                {item.cantidad}x
                              </span>{" "}
                              {item.nombre}
                            </div>
                            <div className="text-gray-800 font-medium">
                              ${(item.precio * item.cantidad).toFixed(2)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total final */}
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between font-medium text-gray-800">
                      <div>Total</div>
                      <div>${order.total.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Botón de dejar reseña */}
                  {order.estado === "entregado" && !order.hasReview && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => openReviewModal(order)}
                        className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Dejar reseña
                      </button>
                    </div>
                  )}

                  {order.hasReview && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500 italic">
                        Ya has dejado una reseña para este pedido.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isReviewModalOpen && selectedOrder && (
        <CreateReviewModal
          order={selectedOrder}
          onClose={closeReviewModal}
          onReviewCreated={handleReviewCreated}
        />
      )}
    </div>
  )
}
