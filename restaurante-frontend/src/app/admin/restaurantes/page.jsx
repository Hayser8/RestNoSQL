"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import AdminLayout from "../../../components/admin/AdminLayout"
import { Header } from "../../../components/admin/restaurante/header"
import { RestauranteCard } from "../../../components/admin/restaurante/restaurante-card"
import { RestauranteForm } from "../../../components/admin/restaurante/restaurante-form"
import { RestauranteFilter } from "../../../components/admin/restaurante/restaurante-filter"
import { Button } from "../../../components/admin/restaurante/button"

export default function RestaurantesPage() {
  const [restaurantes, setRestaurantes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [currentRestaurante, setCurrentRestaurante] = useState(null)

  // 1) Sacamos el token del localStorage (asegúrate de guardarlo al hacer login)
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  // 2) Carga inicial de restaurantes (GET público, no requiere token)
  useEffect(() => {
    console.log('Token en localStorage:', token)
console.log('Authorization header:', authHeaders.Authorization)
    const fetchRestaurantes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurantes")
        const data = await res.json()
        setRestaurantes(data)
      } catch (err) {
        console.error("Error al obtener restaurantes:", err)
      }
    }
    fetchRestaurantes()
  }, [])

  // Filtrado
  const filtered = restaurantes.filter(r => {
    const term = searchTerm.toLowerCase()
    return (
      r.nombre.toLowerCase().includes(term) ||
      r.direccion.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term)
    )
  })

  const handleAddNew = () => {
    setCurrentRestaurante(null)
    setShowForm(true)
  }

  const handleEdit = r => {
    setCurrentRestaurante(r)
    setShowForm(true)
  }

  const handleDelete = async id => {
    if (!confirm("¿Seguro que deseas eliminar este restaurante?")) return
    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurantes/${id}`,
        {
          method: "DELETE",
          headers: authHeaders
        }
      )
      const body = await res.json()
      if (!res.ok) {
        console.error("Error al eliminar:", body)
        alert("Error al eliminar: " + (body.message || JSON.stringify(body)))
        return
      }
      setRestaurantes(prev => prev.filter(x => x._id !== id))
    } catch (err) {
      console.error("Error de red al eliminar:", err)
      alert("Error de red al eliminar. Revisa la consola.")
    }
  }

  const handleSave = async r => {
    try {
      const url = r._id
        ? `http://localhost:5000/api/restaurantes/${r._id}`
        : "http://localhost:5000/api/restaurantes"
      const res = await fetch(url, {
        method: r._id ? "PUT" : "POST",
        headers: authHeaders,
        body: JSON.stringify(r)
      })
      const body = await res.json()
console.error('💥 Respuesta de error completa:', body)
if (!res.ok) {
  if (body.errors) {
    alert(
      "Errores de validación:\n" +
      Object.entries(body.errors)
        .map(([f, m]) => `${f}: ${m}`)
        .join("\n")
    )
  } else {
    alert("Error guardando restaurante: " + (body.message || res.status))
  }
  return
}
      setRestaurantes(prev =>
        r._id
          ? prev.map(x => (x._id === r._id ? body : x))
          : [...prev, body]
      )
      setShowForm(false)
    } catch (err) {
      console.error("Error de red al guardar:", err)
      alert("Error de red al guardar. Revisa la consola.")
    }
  }

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <Header title="Restaurantes" subtitle="Gestiona tus locales" />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Lista de restaurantes</h2>
            <Button variant="primary" className="flex items-center" onClick={handleAddNew}>
              <Plus size={18} className="mr-2" />
              Nuevo restaurante
            </Button>
          </div>

          <RestauranteFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {showForm ? (
            <RestauranteForm
              restaurante={currentRestaurante}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length > 0 ? (
                filtered.map(r => (
                  <RestauranteCard
                    key={r._id}
                    restaurante={r}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No se encontraron restaurantes.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
