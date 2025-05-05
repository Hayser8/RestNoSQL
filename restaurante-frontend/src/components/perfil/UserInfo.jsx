// frontend/src/components/perfil/UserInfo.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"

export default function UserInfo({ onUserUpdate = () => {} }) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    nit: "",
    fechaRegistro: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")

  // 1) Carga inicial: sólo al montarse
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetch("/api/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/login")
          return Promise.reject("Unauthorized")
        }
        if (!res.ok) {
          setLoadError(`Error al cargar perfil (${res.status})`)
          return Promise.reject("FetchError")
        }
        return res.json()
      })
      .then((data) => {
        setFormData({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          email: data.email || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          nit: data.nit || "",
          fechaRegistro: new Date(data.fechaRegistro).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        })
        onUserUpdate(data)
      })
      .catch((err) => {
        if (typeof err !== "string") console.error("Error inesperado al cargar perfil", err)
      })
  }, [])  // ← aquí

  // 2) Manejo de cambios
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: "" }))
  }

  // 3) Validación
  const validateForm = () => {
    const errs = {}
    if (!formData.nombre) errs.nombre = "El nombre es obligatorio"
    if (!formData.apellido) errs.apellido = "El apellido es obligatorio"
    if (!formData.email) errs.email = "El correo es obligatorio"
    else if (!/^.+@.+$/.test(formData.email)) errs.email = "Correo inválido"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // 4) Envío
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/usuarios/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
        }),
      })
      if (res.status === 401) {
        router.push("/login")
        return
      }
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const updated = await res.json()
      onUserUpdate(updated)
      setIsEditing(false)
    } catch (err) {
      console.error("Error actualizando perfil", err)
      setErrors({ form: "No se pudo actualizar. Inténtalo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  if (loadError) {
    return <p className="p-4 text-red-600">{loadError}</p>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-blue-900">Mi Información Personal</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            Editar información
          </button>
        )}
      </div>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {errors.form}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm text-gray-800 mb-1">Nombre</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded text-gray-600 focus:outline-none focus:ring"
                required
              />
              {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm text-gray-800 mb-1">Apellido</label>
              <input
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded text-gray-600 focus:outline-none focus:ring"
                required
              />
              {errors.apellido && <p className="mt-1 text-xs text-red-600">{errors.apellido}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-800 mb-1">Correo electrónico</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded text-gray-600 focus:outline-none focus:ring"
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm text-gray-800 mb-1">Teléfono</label>
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded text-gray-600 focus:outline-none focus:ring"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm text-gray-800 mb-1">Dirección</label>
            <input
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded text-gray-600 focus:outline-none focus:ring"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
              className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {isLoading ? (
                <span className="animate-spin mr-2">⌛</span>
              ) : (
                <Save className="mr-2" />
              )}
              Guardar
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Vista de sólo lectura */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-800">Nombre</h3>
              <p className="text-gray-600 mt-1 text-lg">{formData.nombre}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-800">Apellido</h3>
              <p className="text-gray-600 mt-1 text-lg">{formData.apellido}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-gray-800">Correo electrónico</h3>
            <p className="text-gray-600 mt-1 text-lg">{formData.email}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-800">Teléfono</h3>
            <p className="text-gray-600 mt-1 text-lg">
              {formData.telefono || "No especificado"}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-800">Dirección</h3>
            <p className="text-gray-600 mt-1 text-lg">
              {formData.direccion || "No especificada"}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-800">NIT</h3>
            <p className="text-gray-600 mt-1 text-lg">{formData.nit}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-800">Fecha de registro</h3>
            <p className="text-gray-600 mt-1 text-lg">{formData.fechaRegistro}</p>
          </div>
        </div>
      )}
    </div>
  )
}
