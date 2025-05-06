"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

export default function RestaurantPerformance({ dateRange }) {
  const router = useRouter()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState("")

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No autorizado")
        const qs = dateRange ? `?range=${dateRange}` : ""
        const res = await fetch(
          `http://localhost:5000/api/stats/restaurants${qs}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (!res.ok) throw new Error("Error al cargar rendimiento")
        setData(await res.json())
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPerformance()
  }, [dateRange, router])

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR"
    }).format(value)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
        <p className="text-sm font-medium text-gray-900">{d.name}</p>
        <p className="text-xs text-gray-600">
          Ventas: {formatCurrency(d.ventas)}
        </p>
        <p className="text-xs text-gray-600">Pedidos: {d.pedidos}</p>
        <p className="text-xs text-gray-600">
          Calificación: {d.calificacion}/5
        </p>
      </div>
    )
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Rendimiento por Restaurante
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              orientation="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
            />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="ventas"
              name="Ventas"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="pedidos"
              name="Pedidos"
              fill="#60a5fa"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
