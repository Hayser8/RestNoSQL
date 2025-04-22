'use client'

import { useState, useEffect } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import PopularDishesSection from '@/components/landing/PopularDishesSection'
import CTASection from '@/components/landing/CTASection'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    { id:1, name:'María García', image:'/placeholder.svg?height=80&width=80', rating:5, comment:'…' },
    { id:2, name:'Juan Rodríguez', image:'/placeholder.svg?height=80&width=80', rating:5, comment:'…' },
    { id:3, name:'Ana Martínez',   image:'/placeholder.svg?height=80&width=80', rating:4, comment:'…' },
  ]

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('userSession'))
  }, [])

  const nextTestimonial = () =>
    setCurrentTestimonial(i => (i === testimonials.length - 1 ? 0 : i + 1))
  const prevTestimonial = () =>
    setCurrentTestimonial(i => (i === 0 ? testimonials.length - 1 : i - 1))

  // auto-rotate
  useEffect(() => {
    const iv = setInterval(nextTestimonial, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <>
      <HeroSection
        isAuthenticated={isAuthenticated}
        testimonials={testimonials}
        currentTestimonial={currentTestimonial}
        nextTestimonial={nextTestimonial}
        prevTestimonial={prevTestimonial}
      />
      <FeaturesSection />
      <PopularDishesSection />
      <CTASection />
    </>
  )
}
