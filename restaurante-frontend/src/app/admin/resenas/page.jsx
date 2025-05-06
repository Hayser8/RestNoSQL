"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { ResenaCard } from "../../../components/admin/resena/resena-card"
import { ResenaForm } from "../../../components/admin/resena/resena-form"
import { ResenaFilter } from "../../../components/admin/resena/resena-filter"
import { ResenaStats } from "../../../components/admin/resena/resena-stats"
import AdminLayout from "../../../components/admin/AdminLayout"
import { Header } from "../../../components/admin/restaurante/header"

export default function ResenasPage() {
  const [resenas, setResenas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [restaurantes, setRestaurantes] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filtros, setFiltros] = useState({
    restauranteId: "",
    calificacion: "",
    periodo: "",
  })
  const [showForm, setShowForm] = useState(false)
  const [currentResena, setCurrentResena] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [resenasData, usuariosData, restaurantesData, ordenesData, menuItemsData] = await Promise.all([
          ResenaService.getResenas(),
          ResenaService.getUsuarios(),
          ResenaService.getRestaurantes(),
          ResenaService.getOrdenes(),
          ResenaService.getMenuItems(),
        ])

        setResenas(resenasData)
        setUsuarios(usuariosData)
        setRestaurantes(restaurantesData)
        setOrdenes(ordenesData)
        setMenuItems(menuItemsData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar reseñas según búsqueda y filtros
  const filteredResenas = resenas.filter((resena) => {
    // Filtro por texto en comentario
    const matchesSearch = resena.comentario.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por restaurante
    const matchesRestaurante = !filtros.restauranteId || resena.restauranteId === filtros.restauranteId

    // Filtro por calificación
    const matchesCalificacion = !filtros.calificacion || resena.calificacion === Number(filtros.calificacion)

    // Filtro por período
    let matchesPeriodo = true
    if (filtros.periodo) {
      const fechaResena = new Date(resena.fecha)
      const hoy = new Date()
      const inicioSemana = new Date(hoy)
      inicioSemana.setDate(hoy.getDate() - hoy.getDay())
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const inicioAno = new Date(hoy.getFullYear(), 0, 1)

      switch (filtros.periodo) {
        case "hoy":
          matchesPeriodo =
            fechaResena.getDate() === hoy.getDate() &&
            fechaResena.getMonth() === hoy.getMonth() &&
            fechaResena.getFullYear() === hoy.getFullYear()
          break
        case "semana":
          matchesPeriodo = fechaResena >= inicioSemana
          break
        case "mes":
          matchesPeriodo = fechaResena >= inicioMes
          break
        case "año":
          matchesPeriodo = fechaResena >= inicioAno
          break
      }
    }

    return matchesSearch && matchesRestaurante && matchesCalificacion && matchesPeriodo
  })

  const handleAddNew = () => {
    setCurrentResena(null)
    setShowForm(true)
  }

  const handleEdit = (resena) => {
    setCurrentResena(resena)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
      try {
        await ResenaService.deleteResena(id)
        setResenas((prev) => prev.filter((resena) => resena._id !== id))
      } catch (error) {
        console.error("Error al eliminar la reseña:", error)
      }
    }
  }

  const handleSave = async (resena) => {
    try {
      if (resena._id) {
        // Actualizar
        const updated = await ResenaService.updateResena(resena._id, resena)
        setResenas((prev) => prev.map((r) => (r._id === resena._id ? updated : r)))
      } else {
        // Crear nuevo
        const created = await ResenaService.createResena(resena)
        setResenas((prev) => [...prev, created])
      }
      setShowForm(false)
    } catch (error) {
      console.error("Error al guardar la reseña:", error)
    }
  }

  return (
    <AdminLayout>
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <Header title="Reseñas" subtitle="Gestiona las opiniones de tus clientes" />

        {!showForm && (
          <div className="mb-6">
            <ResenaStats resenas={resenas} />
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-800 text-xl font-semibold">Lista de reseñas</h2>
        </div>

        <ResenaFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filtros={filtros}
          setFiltros={setFiltros}
          restaurantes={restaurantes}
        />

        {showForm ? (
          <ResenaForm
            resena={currentResena}
            usuarios={usuarios}
            restaurantes={restaurantes}
            ordenes={ordenes}
            menuItems={menuItems}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        ) : loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando reseñas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResenas.length > 0 ? (
              filteredResenas.map((resena) => (
                <ResenaCard key={resena._id} resena={resena} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No se encontraron reseñas que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
        </AdminLayout>
  )
}
