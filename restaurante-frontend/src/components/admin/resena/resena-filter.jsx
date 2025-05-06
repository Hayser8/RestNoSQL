"use client"
import { Search, Filter } from "lucide-react"
import { Input } from "../restaurante/input"
import { Select } from "../menu/select"
import { Button } from "../menu/button"

export function ResenaFilter({ searchTerm, setSearchTerm, filtros, setFiltros, restaurantes }) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input
          icon={<Search size={18} className="text-gray-500" />}
          placeholder="Buscar reseña..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-800 placeholder-gray-500"
        />
      </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          options={[
            { value: "", label: "Todos los restaurantes" },
            ...restaurantes.map((restaurante) => ({
              value: restaurante._id,
              label: restaurante.nombre,
            })),
          ]}
          value={filtros.restauranteId}
          onChange={handleFilterChange}
          name="restauranteId"
          className="w-full"
        />

        <Select
          options={[
            { value: "", label: "Todas las calificaciones" },
            { value: "5", label: "5 estrellas" },
            { value: "4", label: "4 estrellas" },
            { value: "3", label: "3 estrellas" },
            { value: "2", label: "2 estrellas" },
            { value: "1", label: "1 estrella" },
          ]}
          value={filtros.calificacion}
          onChange={handleFilterChange}
          name="calificacion"
          className="w-full"
        />

        <Select
          options={[
            { value: "", label: "Cualquier fecha" },
            { value: "hoy", label: "Hoy" },
            { value: "semana", label: "Esta semana" },
            { value: "mes", label: "Este mes" },
            { value: "año", label: "Este año" },
          ]}
          value={filtros.periodo}
          onChange={handleFilterChange}
          name="periodo"
          className="w-full"
        />
      </div>
    </div>
  )
}
