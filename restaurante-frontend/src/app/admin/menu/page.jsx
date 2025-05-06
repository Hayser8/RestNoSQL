"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Header } from "../../../components/admin/menu/header"
import { MenuItemCard } from "../../../components/admin/menu/menu-item-card"
import { MenuItemForm } from "../../../components/admin/menu/menu-item-form"
import { MenuFilter } from "../../../components/admin/menu/menu-filter"
import { Button } from "../../../components/admin/menu/button"
import AdminLayout from "../../../components/admin/AdminLayout"

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoria, setCategoria] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  // 1) Carga inicial de artículos
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/articulos-menu")
        const data = await response.json()
        setMenuItems(data)
      } catch (error) {
        console.error("Error al obtener los artículos del menú:", error)
      }
    }
    fetchMenuItems()
  }, [])

  // Extraemos las categorías únicas que hay en la BD
  const categoriasList = Array.from(
    new Set(menuItems.map((item) => item.categoria))
  )

  // Filtrado según búsqueda y categoría
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoria || item.categoria === categoria
    return matchesSearch && matchesCategory
  })

  const handleAddNew = () => {
    setCurrentItem(null)
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setCurrentItem(item)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este artículo?")) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/articulos-menu/${id}`,
        { method: "DELETE" }
      )
      const body = await response.json()
      if (!response.ok) {
        console.error("Error al eliminar artículo:", body)
        alert("Error al eliminar: " + (body.message || JSON.stringify(body)))
        return
      }
      setMenuItems((prev) => prev.filter((i) => i._id !== id))
    } catch (error) {
      console.error("Error de red al eliminar el artículo:", error)
      alert("Error de red al eliminar. Revisa la consola.")
    }
  }

  const handleSave = async (item) => {
    console.log("Payload a enviar:", item)
    try {
      const url = item._id
        ? `http://localhost:5000/api/articulos-menu/${item._id}`
        : "http://localhost:5000/api/articulos-menu"
      const response = await fetch(url, {
        method: item._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })

      const body = await response.json()
      if (!response.ok) {
        console.error("Error al guardar el artículo (detalle):", body)
        if (body.errors) {
          alert(
            "Errores de validación:\n" +
              Object.entries(body.errors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join("\n")
          )
        } else {
          alert("Error guardando artículo: " + (body.message || response.status))
        }
        return
      }

      setMenuItems((prev) => {
        if (item._id) {
          return prev.map((i) => (i._id === item._id ? body : i))
        } else {
          return [...prev, body]
        }
      })
      setShowForm(false)
    } catch (error) {
      console.error("Error de red al guardar el artículo:", error)
      alert("Error de red. Revisa la consola.")
    }
  }

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <Header title="Menú" subtitle="Gestiona los artículos de tu menú" />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-600 text-xl font-semibold">
              Artículos del menú
            </h2>
            <Button
              variant="primary"
              className="flex items-center"
              onClick={handleAddNew}
            >
              <Plus size={18} className="mr-2" />
              Nuevo artículo
            </Button>
          </div>

          <MenuFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoria={categoria}
            setCategoria={setCategoria}
            categoriasList={categoriasList}
          />

          {showForm ? (
            <MenuItemForm
              item={currentItem}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item._id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    No se encontraron artículos.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
