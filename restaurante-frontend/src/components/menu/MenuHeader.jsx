import Link from "next/link"
import { Menu, ShoppingBag } from "lucide-react"

export default function MenuHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <span className="ml-2 text-xl font-medium text-blue-900">Mamis Restaurant</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <Link href="/menu" className="text-blue-600 font-medium">
              Menú
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              Nosotros
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contacto
            </Link>
          </div>

          <div className="flex items-center">
            <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button className="ml-4 p-2 text-gray-700 hover:text-blue-600 transition-colors md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
