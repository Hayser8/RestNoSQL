import './globals.css'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { CartProvider } from '@/components/common/CartContext'

export const metadata = {
  title: 'Mamis Restaurant',
  description: 'Entrega de comida tradicional a domicilio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
