"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function OrdersChart({ dateRange }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos según el rango de fechas
    setLoading(true)

    // Generar datos de ejemplo según el rango seleccionado
    let mockData = []

    if (dateRange === "day") {
      // Datos por hora para un día
      mockData = Array.from({ length: 24 }, (_, i) => {
        const hour = i
        return {
          time: `${hour}:00`,
          completados: Math.floor(Math.random() * 8) + 1,
          pendientes: Math.floor(Math.random() * 5),
          cancelados: Math.floor(Math.random() * 2),
        }
      })
    } else if (dateRange === "week") {
      // Datos por día para una semana
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
      mockData = days.map((day) => ({
        time: day,
        completados: Math.floor(Math.random() * 45) + 15,
        pendientes: Math.floor(Math.random() * 20) + 5,
        cancelados: Math.floor(Math.random() * 10),
      }))
    } else if (dateRange === "month") {
      // Datos por semana para un mes
      mockData = Array.from({ length: 4 }, (_, i) => ({
        time: `Semana ${i + 1}`,
        completados: Math.floor(Math.random() * 180) + 70,
        pendientes: Math.floor(Math.random() * 80) + 20,
        cancelados: Math.floor(Math.random() * 40) + 5,
      }))
    } else if (dateRange === "year") {
      // Datos por mes para un año
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      mockData = months.map((month) => ({
        time: month,
        completados: Math.floor(Math.random() * 500) + 200,
        pendientes: Math.floor(Math.random() * 200) + 50,
        cancelados: Math.floor(Math.random() * 100) + 10,
      }))
    }

    setData(mockData)
    setLoading(false)
  }, [dateRange])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Pedidos</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
      )}
    </div>
  )
}
