// src/components/Navbar.jsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu as MenuIcon, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/common/CartContext'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items: cartItems } = useCart()
  const cartCount = cartItems.length

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'))
  }, [])

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/logorest.png" alt="Logo" className="w-10 h-10 rounded-full" />
              <span className="ml-2 text-xl font-bold text-blue-900">Mamis Restaurant</span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Menú
            </Link>

            {isAuthenticated ? (
              <Link
                href="/perfil"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                Perfil
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Icons & mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(open => !open)}
              className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Inicio
            </Link>
            <Link href="/menu" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Menú
            </Link>

            {isAuthenticated ? (
              <Link
                href="/usuario/menu"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center"
              >
                <UserIcon className="w-5 h-5 mr-2" /> Mi Perfil
              </Link>
            ) : (
              <Link
                href="/registro"
                className="block px-3 py-2 text-blue-600 font-medium"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
