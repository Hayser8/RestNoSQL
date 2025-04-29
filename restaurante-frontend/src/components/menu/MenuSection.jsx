// src/components/menu/MenuSection.jsx

import Image from 'next/image'
import { Star, Plus } from 'lucide-react'

function MenuSection({ category }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-blue-900">
          <span className="font-medium">{category.name}</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.map(item => (
          <MenuItem key={item._id} item={item} />
        ))}
      </div>
    </section>
  )
}

function MenuItem({ item }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.imagen || '/placeholder.svg?height=200&width=300'}
          alt={item.nombre}
          width={300}
          height={200}
          unoptimized
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.badge && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
            {item.badge}
          </div>
        )}
        {item.discount && (
          <div className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-md">
            {item.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-blue-900">{item.nombre}</h3>
          <span className="font-medium text-blue-600">
            ${item.precio.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.descripcion}
        </p>

        {item.rating != null && item.reviews != null && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({item.reviews})
              </span>
            </div>
            <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}

        {item.dietary && Object.entries(item.dietary).some(([_, v]) => v) && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.dietary.vegetarian && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                Vegetariano
              </span>
            )}
            {item.dietary.vegan && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                Vegano
              </span>
            )}
            {item.dietary.glutenFree && (
              <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
                Sin gluten
              </span>
            )}
            {item.dietary.dairyFree && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                Sin lácteos
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

MenuSection.Item = MenuItem

export default MenuSection
