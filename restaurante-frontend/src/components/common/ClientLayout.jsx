// components/common/ClientLayout.jsx
"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
