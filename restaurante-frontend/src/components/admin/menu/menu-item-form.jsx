"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "./card"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Select } from "./select"
import { Button } from "./button"

export function MenuItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: "",
  })

  const categorias = [
    { value: "Entrantes", label: "Entrantes" },
    { value: "Platos principales", label: "Platos principales" },
    { value: "Postres", label: "Postres" },
    { value: "Bebidas", label: "Bebidas" },
  ]

  useEffect(() => {
    if (item) {
      setFormData({
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio.toString(),
        categoria: item.categoria,
        imagen: item.imagen,
      })
    }
  }, [item])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validación básica
    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.precio ||
      !formData.categoria ||
      !formData.imagen
    ) {
      alert("Todos los campos son obligatorios")
      return
    }
    onSave({
      ...item, // si existe _id
      ...formData,
      precio: parseFloat(formData.precio),
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{item ? "Editar artículo" : "Nuevo artículo"}</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre del artículo"
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción del artículo"
                rows={3}
              />
            </div>
            <div>
              <Input
                label="Precio (€)"
                name="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <Select
                label="Categoría"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                options={categorias}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="URL de la imagen"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {item ? "Actualizar" : "Crear"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
