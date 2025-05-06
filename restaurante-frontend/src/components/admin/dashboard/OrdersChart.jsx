"use client"

import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

export default function OrdersChart({ dateRange }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(
          `http://localhost:5000/api/stats/orders?range=${dateRange}`
        )
        if (!res.ok) throw new Error("No se pudo cargar el gráfico de pedidos")
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Pedidos</h2>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="completados"
              name="Completados"
              stackId="1"
              stroke="#4ade80"
              fill="#4ade80"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="pendientes"
              name="Pendientes"
              stackId="1"
              stroke="#60a5fa"
              fill="#60a5fa"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="cancelados"
              name="Cancelados"
              stackId="1"
              stroke="#f87171"
              fill="#f87171"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
