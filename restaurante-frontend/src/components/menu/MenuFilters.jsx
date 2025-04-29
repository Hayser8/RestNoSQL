'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function MenuFilters({ filters, setFilters }) {
  const [isPriceOpen, setIsPriceOpen] = useState(true)

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max],
    }))
  }

  const resetFilters = () => {
    setFilters(prev => ({
      ...prev,
      priceRange: [0, 50],
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
      <h3 className="font-medium text-lg text-blue-900 mb-4">Filtros</h3>

      {/* Filtro de precio */}
      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-left font-medium text-blue-900 mb-2"
          onClick={() => setIsPriceOpen(open => !open)}
        >
          Rango de precio
          {isPriceOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {isPriceOpen && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>

            <input
              type="range"
              min="0"
              max="50"
              value={filters.priceRange[1]}
              onChange={e =>
                handlePriceChange(filters.priceRange[0], parseInt(e.target.value, 10))
              }
              className="w-full accent-blue-600"
            />

            <div className="grid grid-cols-3 gap-2 mt-3">
              {[0, 15, 30].map((start, i) => {
                const end = i === 0 ? 15 : i === 1 ? 30 : 50
                return (
                  <button
                    key={end}
                    onClick={() => handlePriceChange(start, end)}
                    className={`text-xs py-1 px-2 rounded-md border ${
                      filters.priceRange[0] === start &&
                      filters.priceRange[1] === end
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-blue-200'
                    }`}
                  >
                    ${start} - ${end}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={resetFilters}
        className="w-full mt-6 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
