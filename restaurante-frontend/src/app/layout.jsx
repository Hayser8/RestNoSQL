import './globals.css'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'

export const metadata = {
  title: 'El Buen Sabor',
  description: 'Entrega de comida tradicional a domicilio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
