'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('userSession'))
  }, [])

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/logorest.png" className="w-10 h-10 rounded-full flex items-center justify-center"></img>
              <span className="ml-2 text-xl font-bold text-blue-900">Mami's Restaurant</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Menú
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Sobre Nosotros
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contacto
            </Link>
            <Link
              href={isAuthenticated ? "/usuario/menu" : "/registro"}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300"
            >
              {isAuthenticated ? "Mi Cuenta" : "Iniciar Sesión"}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Inicio
            </Link>
            <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Menú
            </Link>
            <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Sobre Nosotros
            </Link>
            <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Contacto
            </Link>
            <Link
              href={isAuthenticated ? "/usuario/menu" : "/registro"}
              className="block px-3 py-2 text-blue-600 font-medium"
            >
              {isAuthenticated ? "Mi Cuenta" : "Iniciar Sesión"}
            </Link>
          </div>
        </div>
      )}
    </nav>
)
}
