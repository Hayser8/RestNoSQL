"use client"

import { X } from "lucide-react"

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "confirmado":
        return "bg-blue-100 text-blue-800"
      case "en preparación":
        return "bg-purple-100 text-purple-800"
      case "entregado":
        return "bg-green-100 text-green-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 overflow-auto"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Detalles de la Orden #{order.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6">
          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
              <p className="text-sm text-gray-900">{order.usuario}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Restaurante</h4>
              <p className="text-sm text-gray-900">{order.restaurante}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Fecha</h4>
              <p className="text-sm text-gray-900">{formatDate(order.fecha)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Estado</h4>
              <span
                className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(
                  order.estado
                )}`}
              >
                {order.estado}
              </span>
            </div>
          </div>

          {/* Items table */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Artículos</h4>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Artículo", "Cantidad", "Precio unitario", "Subtotal"].map((th) => (
                      <th
                        key={th}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.articulos.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.nombre}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{item.cantidad}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {formatCurrency(item.precio)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {formatCurrency(item.precio * item.cantidad)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-sm font-medium text-gray-500">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
