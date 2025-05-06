// frontend/src/components/admin/dashboard/TopSellingItems.jsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const externalLoader = ({ src }) => src

export default function TopSellingItems({ dateRange }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No autorizado")

        const res = await fetch(
          `http://localhost:5000/api/popular-dishes/range?range=${dateRange}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.status === 401) throw new Error("Token inválido o expirado")
        if (!res.ok) throw new Error("No se pudieron cargar los artículos")

        const data = await res.json()
        setItems(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [dateRange])

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Artículos más vendidos
      </h2>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 relative">
              <Image
                loader={externalLoader}
                src={item.imagen || "/placeholder.svg"}
                alt={item.nombre}
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
              <p className="text-xs text-gray-500">{item.categoria}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(item.revenue)}
              </p>
              <p className="text-xs text-gray-500">
                {item.sales} vendidos
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
