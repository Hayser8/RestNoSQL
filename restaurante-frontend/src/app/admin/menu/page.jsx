"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Upload } from "lucide-react"
import Papa from "papaparse"

import AdminLayout from "@/components/admin/AdminLayout"
import { Header } from "@/components/admin/menu/header"
import { MenuFilter } from "@/components/admin/menu/menu-filter"
import { MenuItemCard } from "@/components/admin/menu/menu-item-card"
import { MenuItemForm } from "@/components/admin/menu/menu-item-form"
import { Button } from "@/components/admin/menu/button"

export default function MenuPage() {
  const BACKEND = "http://localhost:5000"
  const [menuItems, setMenuItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoria, setCategoria] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const fileInputRef = useRef(null)

  const getToken = () => localStorage.getItem("token")

  // 1) Carga inicial de articulos-menu
  useEffect(() => {
    const token = getToken()
    fetch(`${BACKEND}/api/articulos-menu`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then(setMenuItems)
      .catch(err => console.error("Fetch inicial:", err))
  }, [])

  // 2) Filtrado
  const categoriasList = Array.from(new Set(menuItems.map(i => i.categoria)))
  const filtered = menuItems.filter(i => {
    const s = searchTerm.toLowerCase()
    return (
      (i.nombre.toLowerCase().includes(s) ||
       i.descripcion.toLowerCase().includes(s)) &&
      (!categoria || i.categoria === categoria)
    )
  })

  // 3) CRUD individual en articulos-menu
  const handleSave = async item => {
    const token = getToken()
    if (!token) throw new Error("No estás autenticado")

    const url = item._id
      ? `${BACKEND}/api/articulos-menu/${item._id}`
      : `${BACKEND}/api/articulos-menu`
    const method = item._id ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(item),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({message:res.statusText}))
      throw new Error(err.message)
    }
    return res.json()
  }

  const handleDelete = async id => {
    const token = getToken()
    if (!token) throw new Error("No estás autenticado")
    if (!confirm("Eliminar artículo?")) return

    const res = await fetch(`${BACKEND}/api/articulos-menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({message:res.statusText}))
      alert("Error al eliminar: " + err.message)
      return
    }
    setMenuItems(prev => prev.filter(x => x._id !== id))
  }

  // 4) Bulk import en articulos
  const handleFileSelect = e => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data, errors }) => {
        if (errors.length) {
          console.error("PapaParse errors:", errors)
          return alert("Error parseando CSV")
        }
        try {
          const token = getToken()
          if (!token) throw new Error("No estás autenticado")

          console.log("[DEBUG] Bulk import data:", data)
          const url = `${BACKEND}/api/articulos/bulk`
          console.log("[DEBUG] Fetching URL:", url)
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
          })
          console.log("[DEBUG] Response status:", res.status, res.statusText)
          if (!res.ok) {
            const text = await res.text()
            console.error("[DEBUG] Response body:", text)
            const err = await res.json().catch(() => ({message:res.statusText}))
            throw new Error(err.message)
          }
          const imported = await res.json()
          console.log("[DEBUG] Imported result:", imported)
          setMenuItems(prev => {
            const byId = Object.fromEntries(prev.map(i => [i._id, i]))
            imported.forEach(i => (byId[i._id] = i))
            return Object.values(byId)
          })
        } catch (err) {
          console.error("[DEBUG] Bulk import error thrown:", err)
          alert("Error importando: " + err.message)
        }
        e.target.value = ""
      },
      error: err => {
        console.error("[DEBUG] PapaParse fatal error:", err)
        alert("Error parseando CSV")
      }
    })
  }
  const triggerFile = () => fileInputRef.current?.click()

  return (
    <AdminLayout>
      <div className="p-6">
        <Header title="Menú" subtitle="Gestiona los artículos" />

        <div className="flex justify-between items-center mb-6 space-x-2">
          <h2 className="text-xl font-semibold text-gray-700">Artículos</h2>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={triggerFile}>
              <Upload size={16} className="mr-1" />
              Importar CSV
            </Button>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus size={16} className="mr-1" />
              Nuevo artículo
            </Button>
          </div>
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
            onSave={async itm => {
              try {
                const saved = await handleSave(itm)
                setMenuItems(prev =>
                  itm._id
                    ? prev.map(x => (x._id === saved._id ? saved : x))
                    : [...prev, saved]
                )
                setShowForm(false)
              } catch (err) {
                console.error("Save error:", err)
                alert("Error guardando: " + err.message)
              }
            }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.length > 0 ? (
              filtered.map(i => (
                <MenuItemCard
                  key={i._id}
                  item={i}
                  onEdit={() => {
                    setCurrentItem(i)
                    setShowForm(true)
                  }}
                  onDelete={() => handleDelete(i._id)}
                />
              ))
            ) : (
              <p className="col-span-full text-center py-12 text-gray-500">
                No hay artículos.
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
