"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Star } from "lucide-react"

export default function ReviewsOverview() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    // Simular carga de datos
    setLoading(true)

    // En una aplicación real, estos datos vendrían de una API
    const mockData = [
      { name: "5 estrellas", value: 124, color: "#4ade80" },
      { name: "4 estrellas", value: 85, color: "#a3e635" },
      { name: "3 estrellas", value: 42, color: "#facc15" },
      { name: "2 estrellas", value: 18, color: "#fb923c" },
      { name: "1 estrella", value: 7, color: "#f87171" },
    ]

    // Calcular promedio y total
    const total = mockData.reduce((sum, item) => sum + item.value, 0)
    const weightedSum = mockData.reduce((sum, item, index) => {
      const rating = 5 - index
      return sum + item.value * rating
    }, 0)
    const average = total > 0 ? weightedSum / total : 0

    setTimeout(() => {
      setData(mockData)
      setAverageRating(average)
      setTotalReviews(total)
      setLoading(false)
    }, 500)
  }, [])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm font-medium text-gray-900">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-xs text-gray-600">{`${((payload[0].value / totalReviews) * 100).toFixed(1)}% del total`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Reseñas</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col justify-center items-center">
            <div className="text-4xl font-bold text-gray-900 flex items-center">
              {averageRating.toFixed(1)}
              <Star className="w-8 h-8 ml-1 text-yellow-500 fill-current" />
            </div>
            <p className="text-sm text-gray-500 mt-1">de 5.0</p>
            <p className="text-sm text-gray-700 mt-4">{totalReviews} reseñas en total</p>

            <div className="w-full mt-6 space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="text-xs font-medium text-gray-700 w-16">{item.name}</div>
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(item.value / totalReviews) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 w-8 text-right">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

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
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
