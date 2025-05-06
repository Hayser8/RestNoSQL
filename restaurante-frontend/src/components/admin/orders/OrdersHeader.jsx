"use client"

import { Edit, Trash2 } from "lucide-react"

export default function OrdersHeader({ selectedCount, onBulkEdit, onBulkDelete }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Órdenes</h1>
        <p className="text-gray-500">Administra y actualiza el estado de los pedidos</p>
      </div>

      {selectedCount > 0 && (
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={onBulkEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar {selectedCount} {selectedCount === 1 ? "orden" : "órdenes"}
          </button>

          <button
            onClick={onBulkDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  )
}
