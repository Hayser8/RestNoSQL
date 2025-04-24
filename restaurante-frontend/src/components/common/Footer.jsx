// components/landing/Footer.jsx
'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Branding & Social */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                BS
              </div>
              <span className="ml-2 text-xl font-medium text-white">El Buen Sabor</span>
            </div>
            <p className="text-gray-400 mb-6">
              Llevando los mejores sabores a tu hogar desde 2010. Nuestra misión es deleitar tu paladar con platos auténticos y de calidad.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-6">Enlaces rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-white transition-colors">Menú completo</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">Sobre nosotros</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-medium mb-6">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-3 text-blue-500" />
                <span>+34 123 456 789</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                <span>info@elbuensabor.com</span>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin className="w-5 h-5 mr-3 text-blue-500 mt-1" />
                <span>Calle Principal 123, Madrid, España</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-medium mb-6">Horario</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex justify-between">
                <span>Lunes - Viernes:</span>
                <span>10:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado:</span>
                <span>11:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo:</span>
                <span>12:00 - 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} El Buen Sabor. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">Términos y condiciones</Link>
              <Link href="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">Política de privacidad</Link>
              <Link href="/cookies" className="text-gray-500 text-sm hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
