"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function RecentOrders({ startDate, endDate }) {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError("")

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        // Definir rango por defecto: últimos 7 días
        const now = new Date()
        const then = new Date(now)
        then.setDate(now.getDate() - 7)

        const start = (startDate ?? then).toISOString().slice(0, 10)
        const end   = (endDate   ?? now).toISOString().slice(0, 10)
        const limit = 5

        const res = await fetch(
          `http://localhost:5000/api/ordenes/by-date?start=${start}&end=${end}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (!res.ok) {
          throw new Error("Error al cargar pedidos")
        }
        const data = await res.json();
        console.log("Datos recibidos:", data); // Verifica lo que está llegando
        console.log(data.data); 
        
        // Verifica si 'data.data' es un arreglo antes de usar .map()
        if (Array.isArray(data.data)) {
          setOrders(
            data.data.map((o) => ({
              id:         o._id,
              customer:   `${o.usuarioId.nombre} ${o.usuarioId.apellido}`,
              date:       new Date(o.fecha),
              status:     o.estado.charAt(0).toUpperCase() + o.estado.slice(1),
              total:      o.total,
              items:      o.articulos.reduce((sum, it) => sum + it.cantidad, 0),
              restaurant: o.restauranteId.nombre,
            }))
          );
        } else {
          console.error("Error: Datos no son un arreglo", data);
          throw new Error("Datos inválidos recibidos desde el servidor");
        }
        setOrders(
          data.data.map((o) => ({
            id:         o._id,
            customer:   `${o.usuarioId.nombre} ${o.usuarioId.apellido}`,
            date:       new Date(o.fecha),
            status:     o.estado.charAt(0).toUpperCase() + o.estado.slice(1),
            total:      o.total,
            items:      o.articulos.reduce((sum, it) => sum + it.cantidad, 0),
            restaurant: o.restauranteId.nombre,
          }))
        )
      } catch (err) {
        console.error("Error al cargar pedidos:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router, startDate, endDate])

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-EN", { style: "currency", currency: "USD" }).format(v)

  const formatTime = (date) =>
    date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "entregado":       return "bg-green-100 text-green-800"
      case "en preparación":
      case "en proceso":      return "bg-blue-100 text-blue-800"
      case "pendiente":       return "bg-yellow-100 text-yellow-800"
      case "cancelado":       return "bg-red-100 text-red-800"
      default:                return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Pedidos recientes</h2>
        <Link
          href={`/admin/ordenes?start=${startDate ?? ""}&end=${endDate ?? ""}`}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          Ver todos
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No hay pedidos en este rango de fechas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {["ID", "Cliente", "Hora", "Estado", "Total", "Restaurante"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatTime(order.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                        getStatusColor(order.status)
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {order.restaurant}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
