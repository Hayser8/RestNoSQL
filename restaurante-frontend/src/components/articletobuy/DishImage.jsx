// src/components/articletobuy/DishImage.jsx
import Image from 'next/image'

// Loader que simplemente retorna la URL sin validaciones de dominio
const externalLoader = ({ src }) => src

export default function DishImage({ dish }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <Image
        loader={externalLoader}
        src={dish.imagen || '/placeholder.png'}
        width={400}
        height={240}
        alt={dish.nombre}
        className="w-full h-full object-cover"
        unoptimized
      />
    </div>
  )
}
