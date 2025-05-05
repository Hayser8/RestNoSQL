// app/layout.jsx
import "./globals.css"
import { CartProvider } from "@/components/common/CartContext"
import ClientLayout from "@/components/common/ClientLayout"

export const metadata = {
  title: "Mamis Restaurant",
  description: "Entrega de comida tradicional a domicilio",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <CartProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </CartProvider>
      </body>
    </html>
  )
}
