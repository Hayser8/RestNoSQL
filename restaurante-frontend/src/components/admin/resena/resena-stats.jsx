"use client"
import { Star } from "lucide-react"
import { Card, CardContent } from "../menu/card"

export default function ResenaStats({ resenas }) {
  // Calcular estadísticas
  const calcularEstadisticas = () => {
    if (!resenas.length) return { promedio: 0, total: 0, porEstrellas: [0, 0, 0, 0, 0] }

    const total = resenas.length
    const suma = resenas.reduce((acc, resena) => acc + resena.calificacion, 0)
    const promedio = suma / total

    // Contar reseñas por número de estrellas (índice 0 = 1 estrella, índice 4 = 5 estrellas)
    const porEstrellas = [0, 0, 0, 0, 0]
    resenas.forEach((resena) => {
      porEstrellas[resena.calificacion - 1]++
    })

    return { promedio, total, porEstrellas }
  }

  const { promedio, total, porEstrellas } = calcularEstadisticas()

  // Renderizar barra de progreso para cada nivel de estrellas
  const renderBarraProgreso = (cantidad, total) => {
    const porcentaje = total > 0 ? (cantidad / total) * 100 : 0
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${porcentaje}%` }}></div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Calificación promedio</h3>
            <div className="flex items-center mb-2">
              <span className="text-gray-500 text-4xl font-bold mr-2">{promedio.toFixed(1)}</span>
              <Star size={28} className="text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-sm text-gray-500">Basado en {total} reseñas</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Distribución</h3>
            <div className="text-gray-600 space-y-3">
              {[5, 4, 3, 2, 1].map((estrellas) => (
                <div key={estrellas} className="flex items-center">
                  <div className="flex items-center w-24">
                    <span className="text-sm font-medium mr-2">{estrellas}</span>
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 mx-2">{renderBarraProgreso(porEstrellas[estrellas - 1], total)}</div>
                  <div className="w-12 text-right text-sm text-gray-500">
                    {total > 0 ? Math.round((porEstrellas[estrellas - 1] / total) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
