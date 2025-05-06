"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"

export default function OrdersFilters({ filters, setFilters, restaurants }) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }))
  }

  const handleStatusChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }))
  }

  const handleRestaurantChange = (e) => {
    setFilters((prev) => ({ ...prev, restaurant: e.target.value }))
  }

  const handleStartDateChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, start: e.target.value },
    }))
  }

  const handleEndDateChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, end: e.target.value },
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      dateRange: {
        start: null,
        end: null,
      },
      restaurant: "",
    })
  }

  const hasActiveFilters = filters.status || filters.restaurant || filters.dateRange.start || filters.dateRange.end

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Buscar por ID o cliente..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botón de filtros */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center px-4 py-2 border rounded-md ${
            hasActiveFilters
              ? "bg-blue-50 text-blue-600 border-blue-200"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Activos</span>
          )}
        </button>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <X className="w-5 h-5 mr-2" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Panel de filtros expandible */}
      {isFiltersOpen && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por estado */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="en preparación">En preparación</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* Filtro por restaurante */}
            <div>
              <label htmlFor="restaurant-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Restaurante
              </label>
              <select
                id="restaurant-filter"
                value={filters.restaurant}
                onChange={handleRestaurantChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los restaurantes</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por rango de fechas */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="date-start" className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  id="date-start"
                  value={filters.dateRange.start || ""}
                  onChange={handleStartDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="date-end" className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  id="date-end"
                  value={filters.dateRange.end || ""}
                  onChange={handleEndDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
