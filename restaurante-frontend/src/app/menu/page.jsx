// src/app/menu/page.jsx
'use client'

import { useState, useEffect } from 'react'
import MenuHeader from '@/components/menu/MenuHeader'
import CategoryTabs from '@/components/menu/CategoryTabs'
import MenuSection from '@/components/menu/MenuSection'
import MenuFilters from '@/components/menu/MenuFilters'
import MenuSearch from '@/components/menu/MenuSearch'

export default function MenuPage() {
  const [menuData, setMenuData] = useState([])
  const [activeCategory, setActiveCategory] = useState('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ priceRange: [0, 50] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMenu() {
      try {
        const [resAll, resPop] = await Promise.all([
          fetch('/api/articulos'),
          fetch('/api/popular-dishes'),
        ])

        if (!resAll.ok) throw new Error('Error al cargar artículos')
        const allItems = await resAll.json()
        const popularItems = resPop.ok ? await resPop.json() : []

        // Agrupar por categoría
        const byCat = allItems.reduce((acc, itm) => {
          acc[itm.categoria] = acc[itm.categoria] || []
          acc[itm.categoria].push(itm)
          return acc
        }, {})

        const categories = Object.entries(byCat).map(([name, items]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          items,
        }))

        if (popularItems.length) {
          categories.unshift({
            id: 'popular',
            name: 'Popular',
            items: popularItems,
          })
        }

        setMenuData(categories)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMenu()
  }, [])

  // categorías según pestaña
  const rawCats =
    activeCategory === 'popular'
      ? menuData
      : menuData.filter((cat) => cat.id === activeCategory)

  // items sobre los que aplicar búsqueda + precio
  const itemsToSearch = rawCats.flatMap((cat) => cat.items)

  const filteredItems = itemsToSearch.filter((item) => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      q === '' ||
      item.nombre.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q)

    const matchesPrice =
      item.precio >= filters.priceRange[0] &&
      item.precio <= filters.priceRange[1]

    return matchesSearch && matchesPrice
  })

  // construir categorías filtradas por precio (para vista sin búsqueda)
  const categoriesToShow = rawCats.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.precio >= filters.priceRange[0] &&
        item.precio <= filters.priceRange[1]
    ),
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <p>Cargando menú…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MenuHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            <MenuSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <MenuFilters filters={filters} setFilters={setFilters} />
          </aside>

          <div className="flex-1">
            <CategoryTabs
              categories={menuData}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            {searchQuery.trim() ? (
              <div className="mt-8">
                <h2 className="text-2xl font-light text-blue-900 mb-6">
                  Resultados para "
                  <span className="font-medium">{searchQuery}</span>"
                </h2>

                {filteredItems.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <MenuSection.Item key={item._id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">
                      No se encontraron resultados.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                      Limpiar búsqueda
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-12 mt-8">
                {categoriesToShow.map((category) => (
                  <MenuSection key={category.id} category={category} />
                ))}
                {categoriesToShow.every((cat) => cat.items.length === 0) && (
                  <p className="text-center text-gray-500">
                    No hay platos que coincidan con los filtros.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
