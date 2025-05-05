"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RevenueChart({ dateRange }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos según el rango de fechas
    setLoading(true)

    // Generar datos de ejemplo según el rango seleccionado
    let mockData = []

    if (dateRange === "day") {
      // Datos por hora para un día
      mockData = Array.from({ length: 12 }, (_, i) => {
        const hour = i * 2
        return {
          time: `${hour}:00`,
          ingresos: Math.floor(Math.random() * 300) + 50,
        }
      })
    } else if (dateRange === "week") {
      // Datos por día para una semana
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
      mockData = days.map((day) => ({
        time: day,
        ingresos: Math.floor(Math.random() * 1500) + 500,
      }))
    } else if (dateRange === "month") {
      // Datos por semana para un mes
      mockData = Array.from({ length: 4 }, (_, i) => ({
        time: `Semana ${i + 1}`,
        ingresos: Math.floor(Math.random() * 8000) + 2000,
      }))
    } else if (dateRange === "year") {
      // Datos por mes para un año
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      mockData = months.map((month) => ({
        time: month,
        ingresos: Math.floor(Math.random() * 40000) + 10000,
      }))
    }

    setData(mockData)
    setLoading(false)
  }, [dateRange])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm text-gray-600">{`${payload[0].payload.time}`}</p>
          <p className="text-sm font-medium text-gray-900">{`Ingresos: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Ingresos</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `€${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ingresos" name="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
