"use client"

import { useState, useEffect } from "react"
import { X, Star } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "../menu/card"
import { Textarea } from "../menu/textarea"
import { Select } from "../menu/select"
import { Button } from "../menu/button"

export function ResenaForm({ resena, usuarios, restaurantes, ordenes, menuItems, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    usuarioId: "",
    restauranteId: "",
    ordenId: "",
    menuItemId: "",
    calificacion: 5,
    comentario: "",
  })

  const [filteredOrdenes, setFilteredOrdenes] = useState([])
  const [filteredMenuItems, setFilteredMenuItems] = useState([])

  useEffect(() => {
    if (resena) {
      setFormData({
        usuarioId: resena.usuarioId || "",
        restauranteId: resena.restauranteId || "",
        ordenId: resena.ordenId || "",
        menuItemId: resena.menuItemId || "",
        calificacion: resena.calificacion || 5,
        comentario: resena.comentario || "",
      })
    }
  }, [resena])

  // Filtrar órdenes por usuario y restaurante seleccionados
  useEffect(() => {
    if (formData.usuarioId && formData.restauranteId) {
      const filtered = ordenes.filter(
        (orden) => orden.usuarioId === formData.usuarioId && orden.restauranteId === formData.restauranteId,
      )
      setFilteredOrdenes(filtered)
    } else {
      setFilteredOrdenes([])
    }
  }, [formData.usuarioId, formData.restauranteId, ordenes])

  // Filtrar menú items por restaurante seleccionado
  useEffect(() => {
    if (formData.restauranteId) {
      const filtered = menuItems.filter((item) => item.restauranteId === formData.restauranteId)
      setFilteredMenuItems(filtered)
    } else {
      setFilteredMenuItems([])
    }
  }, [formData.restauranteId, menuItems])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Resetear valores dependientes
    if (name === "usuarioId" || name === "restauranteId") {
      setFormData((prev) => ({
        ...prev,
        ordenId: "",
      }))
    }

    if (name === "restauranteId") {
      setFormData((prev) => ({
        ...prev,
        menuItemId: "",
      }))
    }
  }

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      calificacion: rating,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación básica
    if (
      !formData.usuarioId ||
      !formData.restauranteId ||
      !formData.ordenId ||
      !formData.calificacion ||
      !formData.comentario
    ) {
      alert("Por favor, completa todos los campos obligatorios")
      return
    }

    onSave({
      ...resena, // Mantener el _id si existe
      ...formData,
      calificacion: Number(formData.calificacion),
    })
  }

  // Componente para seleccionar calificación con estrellas
  const RatingSelector = ({ value, onChange }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button key={rating} type="button" className="focus:outline-none" onClick={() => onChange(rating)}>
            <Star
              size={24}
              className={`${
                rating <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 cursor-pointer mr-1`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{resena ? "Editar reseña" : "Nueva reseña"}</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Usuario"
                id="usuarioId"
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                options={[
                  { value: "", label: "Seleccionar usuario" },
                  ...usuarios.map((usuario) => ({
                    value: usuario._id,
                    label: `${usuario.nombre} ${usuario.apellido}`,
                  })),
                ]}
              />
            </div>
            <div>
              <Select
                label="Restaurante"
                id="restauranteId"
                name="restauranteId"
                value={formData.restauranteId}
                onChange={handleChange}
                options={[
                  { value: "", label: "Seleccionar restaurante" },
                  ...restaurantes.map((restaurante) => ({
                    value: restaurante._id,
                    label: restaurante.nombre,
                  })),
                ]}
              />
            </div>
            <div>
              <Select
                label="Orden"
                id="ordenId"
                name="ordenId"
                value={formData.ordenId}
                onChange={handleChange}
                options={[
                  { value: "", label: "Seleccionar orden" },
                  ...filteredOrdenes.map((orden) => ({
                    value: orden._id,
                    label: `Orden #${orden.numero} - ${new Date(orden.fecha).toLocaleDateString()}`,
                  })),
                ]}
                disabled={!formData.usuarioId || !formData.restauranteId || filteredOrdenes.length === 0}
              />
            </div>
            <div>
              <Select
                label="Artículo del menú (opcional)"
                id="menuItemId"
                name="menuItemId"
                value={formData.menuItemId}
                onChange={handleChange}
                options={[
                  { value: "", label: "Seleccionar artículo (opcional)" },
                  ...filteredMenuItems.map((item) => ({
                    value: item._id,
                    label: item.nombre,
                  })),
                ]}
                disabled={!formData.restauranteId || filteredMenuItems.length === 0}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
              <RatingSelector value={formData.calificacion} onChange={handleRatingChange} />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Comentario"
                id="comentario"
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
                placeholder="Escribe tu comentario aquí..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {resena ? "Actualizar" : "Crear"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
