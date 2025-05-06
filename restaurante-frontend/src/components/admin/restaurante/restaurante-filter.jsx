// src/components/admin/restaurante/restaurante-filter.jsx
"use client"

import { Search } from "lucide-react"
import { Input } from "./input"

export function RestauranteFilter({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          icon={<Search size={18} className="text-gray-500" />}
          placeholder="Buscar restaurantes por nombre, dirección o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-800 placeholder-gray-500"
        />
      </div>
    </div>
  )
}
