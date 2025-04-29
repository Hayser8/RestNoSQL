// src/components/menu/MenuSearch.jsx
'use client'

import { Search, X } from 'lucide-react'

export default function MenuSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      {/* Icono de búsqueda con gris más oscuro */}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />

      <input
        type="text"
        placeholder="Buscar en el menú..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="
          w-full pl-10 pr-10 py-2
          border border-gray-300  /* Gris más intenso */
          placeholder-gray-500    /* Placeholder más oscuro */
          rounded-lg
          focus:outline-none
          focus:ring-2 focus:ring-gray-400
          focus:border-gray-400
        "
      />

      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
