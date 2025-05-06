"use client"
import { Search, Filter } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button"

export function RestauranteFilter({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar restaurantes por nombre, dirección o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button variant="outline" className="flex items-center md:w-auto">
        <Filter size={18} className="mr-2" />
        Más filtros
      </Button>
    </div>
  )
}
