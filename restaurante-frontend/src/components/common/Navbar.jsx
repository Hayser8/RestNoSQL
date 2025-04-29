// src/components/Navbar.jsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu as MenuIcon, ShoppingBag } from 'lucide-react'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('userSession'))

    // Suponiendo que guardas tu carrito en localStorage como un array JSON
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const arr = JSON.parse(stored)
        setCartCount(Array.isArray(arr) ? arr.length : 0)
      } catch {
        setCartCount(0)
      }
    }
  }, [])

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/logorest.png"
                alt="Logo"
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-2 text-xl font-bold text-blue-900">
                Mami's Restaurant
              </span>
            </Link>
          </div>

          {/* Links de escritorio */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Menú
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Contacto
            </Link>
            <Link
              href={isAuthenticated ? '/usuario/menu' : '/registro'}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300"
            >
              {isAuthenticated ? 'Mi Cuenta' : 'Iniciar Sesión'}
            </Link>
          </div>

          {/* Íconos y toggler móvil */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
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

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Menú
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Contacto
            </Link>
            <Link
              href={isAuthenticated ? '/usuario/menu' : '/registro'}
              className="block px-3 py-2 text-blue-600 font-medium"
            >
              {isAuthenticated ? 'Mi Cuenta' : 'Iniciar Sesión'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
