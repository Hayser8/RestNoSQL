'use client'

import { useState, useEffect } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import PopularDishesSection from '@/components/landing/PopularDishesSection'
import CTASection from '@/components/landing/CTASection'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [stats, setStats] = useState({
    avgRating: null,
    totalUsers: null,
    totalDishes: null
  })

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('userSession'))
  }, [])

  useEffect(() => {
    // 1) fetch testimonios
    fetch('/api/testimonials')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => {
        setTestimonials(data)
        setCurrentTestimonial(0)
      })
      .catch(err => console.error(err))

    // 2) fetch stats (rating, usuarios, platos)
    fetch('/api/stats')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => {
        setStats(data)
      })
      .catch(err => console.error(err))
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial(i =>
      testimonials.length ? (i + 1) % testimonials.length : 0
    )
  }
  const prevTestimonial = () => {
    setCurrentTestimonial(i =>
      testimonials.length ? (i - 1 + testimonials.length) % testimonials.length : 0
    )
  }

  return (
    <>
      <HeroSection
        isAuthenticated={isAuthenticated}
        testimonials={testimonials}
        currentTestimonial={currentTestimonial}
        nextTestimonial={nextTestimonial}
        prevTestimonial={prevTestimonial}
        avgRating={stats.avgRating}
        totalUsers={stats.totalUsers}
        totalDishes={stats.totalDishes}
      />
      <FeaturesSection />
      <PopularDishesSection />
      <CTASection />
    </>
  )
}
