"use client"

import Link from "next/link"
import { useState } from "react"
import { User, ShoppingBag, Star, LogOut, Menu, X } from "lucide-react"

export default function ProfileLayout({ children, activeTab, setActiveTab, userName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs = [
    { id: "info", label: "Mi Información", icon: <User className="w-5 h-5" /> },
    { id: "orders", label: "Mis Pedidos", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "reviews", label: "Mis Reseñas", icon: <Star className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  BS
                </div>
                <span className="ml-2 text-xl font-bold text-blue-900">El Buen Sabor</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-700">Bienvenido, {userName}</span>
              <Link
                href="/logout"
                className="inline-flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-1" />
                <span>Cerrar sesión</span>
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2">
            <div className="px-4 py-2 text-gray-700">Bienvenido, {userName}</div>
            <Link
              href="/logout"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 mr-2" />
                <span>Cerrar sesión</span>
              </div>
            </Link>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <nav className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="mt-6 md:mt-0 md:flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
