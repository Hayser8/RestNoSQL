"use client"

import { useState } from "react"
import ProfileLayout from "@/components/perfil/ProfileLayout"
import UserInfo from "@/components/perfil/UserInfo"
import OrderHistory from "@/components/perfil/OrderHistory"
import ReviewsSection from "@/components/perfil/ReviewsSection"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info")

  // Datos de ejemplo - en una aplicación real, estos vendrían de una API
  const userData = {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    telefono: "+34 123 456 789",
    direccion: "Calle Principal 123, Madrid",
    nit: "12345678",
    fechaRegistro: new Date("2023-01-15"),
  }

  // Renderizar el contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return <UserInfo userData={userData} />
      case "orders":
        return <OrderHistory />
      case "reviews":
        return <ReviewsSection />
      default:
        return <UserInfo userData={userData} />
    }
  }

  return (
    <ProfileLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userName={`${userData.nombre} ${userData.apellido}`}
    >
      {renderContent()}
    </ProfileLayout>
  )
}
