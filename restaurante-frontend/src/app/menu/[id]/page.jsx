// src/app/menu/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DishImage from '../../../components/articletobuy/DishImage'
import AddToCartSection from '../../../components/articletobuy/AddToCartSection'
import DishReviews from '../../../components/articletobuy/DishReviews'
import RelatedDishes from '../../../components/articletobuy/RelatedDishes'
import { ArrowLeft } from 'lucide-react'

export default function DishPage() {
  const router = useRouter()
  const { id } = useParams()
  const [dish, setDish] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/articulos/${id}`)
        if (!res.ok) throw new Error('No encontrado')
        const data = await res.json()
        setDish(data)

        const cat = encodeURIComponent(data.categoria)
        const resRel = await fetch(`/api/articulos?categoria=${cat}`)
        if (resRel.ok) {
          const arr = await resRel.json()
          setRelated(arr.filter(i => i._id !== data._id).slice(0, 3))
        }
      } catch {
        router.push('/menu')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/menu')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Volver al menú
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <DishImage dish={dish} />
          <AddToCartSection dish={dish} />
        </div>

        {/* Reseñas justo debajo */}
        <div className="mt-12">
          <DishReviews dish={dish} />
        </div>

        <RelatedDishes dishes={related} />
      </div>
    </div>
  )
}
