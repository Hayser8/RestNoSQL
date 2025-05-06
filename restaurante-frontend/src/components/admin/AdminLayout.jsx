"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Menu, Users, ShoppingBag, Star, Settings, LogOut, Store, BarChart2, X } from "lucide-react"

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <Home className="w-5 h-5" /> },
    { name: "Menú", href: "/admin/menu", icon: <Menu className="w-5 h-5" /> },
    { name: "Órdenes", href: "/admin/ordenes", icon: <ShoppingBag className="w-5 h-5" /> },
    { name: "Reseñas", href: "/admin/resenas", icon: <Star className="w-5 h-5" /> },
    { name: "Restaurantes", href: "/admin/restaurantes", icon: <Store className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              MR
            </div>
            <span className="ml-2 text-xl font-bold text-blue-900">Admin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  item.href === "/admin" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <div className="flex items-center">
                <Link href="/logout" className="text-xs text-gray-500 hover:text-blue-600 flex items-center">
                  <LogOut className="w-3 h-3 mr-1" />
                  Cerrar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/admin" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              MR
            </div>
            <span className="ml-2 text-xl font-bold text-blue-900">Admin</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="bg-white border-b border-gray-200 py-2">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    item.href === "/admin" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}

              <div className="pt-2 mt-2 border-t border-gray-200">
                <Link
                  href="/logout"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Cerrar sesión
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  )
}
