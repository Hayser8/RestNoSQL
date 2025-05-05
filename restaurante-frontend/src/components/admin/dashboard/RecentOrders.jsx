"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function RecentOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    setLoading(true)

    // En una aplicación real, estos datos vendrían de una API
    const mockOrders = [
      {
        id: "ORD-001",
        customer: "Juan Pérez",
        date: new Date("2023-05-15T18:30:00"),
        status: "Entregado",
        total: 42.5,
        items: 4,
        restaurant: "El Buen Sabor - Centro",
      },
      {
        id: "ORD-002",
        customer: "María García",
        date: new Date("2023-05-15T19:15:00"),
        status: "En proceso",
        total: 27.98,
        items: 2,
        restaurant: "El Buen Sabor - Norte",
      },
      {
        id: "ORD-003",
        customer: "Carlos Rodríguez",
        date: new Date("2023-05-15T17:45:00"),
        status: "Entregado",
        total: 35.75,
        items: 3,
        restaurant: "El Buen Sabor - Centro",
      },
      {
        id: "ORD-004",
        customer: "Ana Martínez",
        date: new Date("2023-05-15T20:10:00"),
        status: "Pendiente",
        total: 18.99,
        items: 1,
        restaurant: "El Buen Sabor - Sur",
      },
      {
        id: "ORD-005",
        customer: "Luis Sánchez",
        date: new Date("2023-05-15T16:30:00"),
        status: "Cancelado",
        total: 52.25,
        items: 5,
        restaurant: "El Buen Sabor - Este",
      },
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 500)
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Entregado":
        return "bg-green-100 text-green-800"
      case "En proceso":
        return "bg-blue-100 text-blue-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Pedidos recientes</h2>
        <Link href="/admin/ordenes" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          Ver todos
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurante
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatTime(order.date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.restaurant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
