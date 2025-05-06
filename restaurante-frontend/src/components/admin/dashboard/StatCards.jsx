"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Star,
} from "lucide-react"

export default function StatCards({ dateRange }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError("")
      try {
        // Nota: llamamos al endpoint /range
        const res = await fetch(
          `http://localhost:5000/api/stats/range?range=${dateRange}`
        )
        if (!res.ok) throw new Error("No se pudieron cargar las estadísticas")
        setStats(await res.json())
      } catch (err) {
        console.error("Error al cargar estadísticas:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [dateRange])

  if (loading) return <p className="text-center text-gray-500">Cargando…</p>
  if (error)   return <p className="text-center text-red-500">{error}</p>
  if (!stats)  return null

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "USD",
    }).format(v)

  const formatChange = (v) => {
    const isPositive = v >= 0
    return (
      <span
        className={`flex items-center ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-4 h-4 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 mr-1" />
        )}
        <span>{Math.abs(v)}%</span>
      </span>
    )
  }

  const cards = [
    {
      title: "Ingresos",
      value: formatCurrency(stats.revenue.value),
      change: formatChange(stats.revenue.change),
      icon: <DollarSign className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Pedidos",
      value: stats.orders.value,
      change: formatChange(stats.orders.change),
      icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Clientes",
      value: stats.customers.value,
      change: formatChange(stats.customers.change),
      icon: <Users className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-50",
    },
    {
      title: "Calificación",
      value: stats.rating.value,
      change: formatChange(stats.rating.change),
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      bgColor: "bg-yellow-50",
    },
  ]

  return (
    <>
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>{card.icon}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {card.value}
                </p>
                {/* Usamos <div> para evitar <div> dentro de <p> */}
                <div className="ml-2 text-sm">{card.change}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
