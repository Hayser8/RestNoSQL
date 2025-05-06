// frontend/src/components/admin/dashboard/ReviewsOverview.jsx
"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ReviewsOverview({ dateRange }) {
  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [error, setError] = useState("")

  // colores fijos por calificación
  const COLORS = {
    5: "#4ade80",
    4: "#a3e635",
    3: "#facc15",
    2: "#fb923c",
    1: "#f87171"
  }

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError("")

      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No autorizado")
        const res = await fetch(
          `http://localhost:5000/api/resenas/stats?range=${dateRange}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (!res.ok) throw new Error("Error al cargar estadísticas de reseñas")

        const { total, average, distribution } = await res.json()

        setTotalReviews(total)
        setAverageRating(average)
        // construye array para el gráfico
        const chartData = [5,4,3,2,1].map(r => ({
          name: `${r} estrella${r>1?'s':''}`,
          value: distribution[r] || 0,
          color: COLORS[r]
        }))
        setData(chartData)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [dateRange, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pct = totalReviews > 0
        ? ((payload[0].value / totalReviews)*100).toFixed(1)
        : 0
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm font-medium text-gray-900">
            {payload[0].name}: {payload[0].value}
          </p>
          <p className="text-xs text-gray-600">{pct}% del total</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Reseñas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* resumen numérico */}
        <div className="md:col-span-1 flex flex-col justify-center items-center">
          <div className="text-4xl font-bold text-gray-900 flex items-center">
            {averageRating.toFixed(1)}
            <Star className="w-8 h-8 ml-1 text-yellow-500 fill-current" />
          </div>
          <p className="text-sm text-gray-500 mt-1">de 5.0</p>
          <p className="text-sm text-gray-700 mt-4">
            {totalReviews} reseñas en total
          </p>
          <div className="w-full mt-6 space-y-2">
            {data.map((item, i) => (
              <div key={i} className="flex items-center">
                <div className="text-xs font-medium text-gray-700 w-16">
                  {item.name}
                </div>
                <div className="flex-1 mx-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${totalReviews>0?(item.value/totalReviews)*100:0}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 w-8 text-right">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* gráfico circular */}
        <div className="md:col-span-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent*100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
