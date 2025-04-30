// src/components/articletobuy/RelatedDishes.jsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const externalLoader = ({ src }) => src

export default function RelatedDishes({ dishes }) {
  if (!dishes?.length) return null

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-medium text-blue-900 mb-6">
        También te podría gustar
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <Link key={dish._id} href={`/menu/${dish._id}`} className="block group">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <Image
                  loader={externalLoader}
                  src={dish.imagen || '/placeholder.png'}
                  width={300}
                  height={200}
                  alt={dish.nombre}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-blue-900 group-hover:text-blue-600 transition-colors">
                    {dish.nombre}
                  </h3>
                  <span className="font-medium text-blue-600">
                    ${dish.precio.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {dish.descripcion}
                </p>
                <div className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded inline-block">
                  {dish.categoria}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
