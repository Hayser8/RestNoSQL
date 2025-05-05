"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function TopSellingItems({ dateRange }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    setLoading(true)

    // En una aplicación real, estos datos vendrían de una API
    const mockItems = [
      {
        id: 1,
        name: "Paella Valenciana",
        image: "/placeholder.svg?height=40&width=40",
        category: "Platos principales",
        sales: dateRange === "day" ? 12 : dateRange === "week" ? 68 : dateRange === "month" ? 245 : 2870,
        revenue:
          dateRange === "day" ? 227.88 : dateRange === "week" ? 1291.32 : dateRange === "month" ? 4652.55 : 54501.3,
      },
      {
        id: 2,
        name: "Tacos de Carnitas",
        image: "/placeholder.svg?height=40&width=40",
        category: "Platos principales",
        sales: dateRange === "day" ? 10 : dateRange === "week" ? 54 : dateRange === "month" ? 198 : 2340,
        revenue:
          dateRange === "day" ? 129.9 : dateRange === "week" ? 701.46 : dateRange === "month" ? 2572.02 : 30387.6,
      },
      {
        id: 3,
        name: "Risotto de Setas",
        image: "/placeholder.svg?height=40&width=40",
        category: "Platos principales",
        sales: dateRange === "day" ? 8 : dateRange === "week" ? 42 : dateRange === "month" ? 156 : 1872,
        revenue:
          dateRange === "day" ? 127.92 : dateRange === "week" ? 671.58 : dateRange === "month" ? 2494.44 : 29932.28,
      },
      {
        id: 4,
        name: "Tiramisú",
        image: "/placeholder.svg?height=40&width=40",
        category: "Postres",
        sales: dateRange === "day" ? 7 : dateRange === "week" ? 38 : dateRange === "month" ? 142 : 1680,
        revenue: dateRange === "day" ? 41.93 : dateRange === "week" ? 227.62 : dateRange === "month" ? 850.58 : 10063.2,
      },
      {
        id: 5,
        name: "Agua Mineral",
        image: "/placeholder.svg?height=40&width=40",
        category: "Bebidas",
        sales: dateRange === "day" ? 15 : dateRange === "week" ? 82 : dateRange === "month" ? 310 : 3720,
        revenue: dateRange === "day" ? 22.5 : dateRange === "week" ? 123.0 : dateRange === "month" ? 465.0 : 5580.0,
      },
    ]

    setTimeout(() => {
      setItems(mockItems)
      setLoading(false)
    }, 500)
  }, [dateRange])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Artículos más vendidos</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</p>
                <p className="text-xs text-gray-500">{item.sales} vendidos</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
