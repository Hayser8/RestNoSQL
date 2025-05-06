"use client"

import { Search } from "lucide-react"
import { Input } from "./input"
import { Select } from "./select"

export function MenuFilter({
  searchTerm,
  setSearchTerm,
  categoria,
  setCategoria,
  categoriasList = []
}) {
  const opciones = [
    { value: "", label: "Todas las categorías" },
    ...categoriasList.map((cat) => ({ value: cat, label: cat }))
  ]

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Input con icono ya integrado */}
      <div className="flex-1">
        <Input
          icon={<Search size={18} className="text-gray-500" />}
          placeholder="Buscar artículos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-800 placeholder-gray-500"
        />
      </div>

      {/* Select de categorías */}
      <div className="w-full md:w-64">
        <Select
          options={opciones}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full text-gray-800"
        />
      </div>
    </div>
  )
}
