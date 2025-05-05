"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function RestaurantPerformance() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    setLoading(true)

    // En una aplicación real, estos datos vendrían de una API
    const mockData = [
      {
        name: "Centro",
        ventas: 32450,
        pedidos: 1248,
        calificacion: 4.7,
      },
      {
        name: "Norte",
        ventas: 28750,
        pedidos: 1105,
        calificacion: 4.5,
      },
      {
        name: "Sur",
        ventas: 24300,
        pedidos: 985,
        calificacion: 4.3,
      },
      {
        name: "Este",
        ventas: 18500,
        pedidos: 742,
        calificacion: 4.6,
      },
    ]

    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 500)
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm font-medium text-gray-900">{`${payload[0].payload.name}`}</p>
          <p className="text-xs text-gray-600">{`Ventas: ${formatCurrency(payload[0].payload.ventas)}`}</p>
          <p className="text-xs text-gray-600">{`Pedidos: ${payload[0].payload.pedidos}`}</p>
          <p className="text-xs text-gray-600">{`Calificación: ${payload[0].payload.calificacion}/5`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Rendimiento por Restaurante</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `€${value / 1000}k`}
              />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="ventas" name="Ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="pedidos" name="Pedidos" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
