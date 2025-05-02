"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"
import AuthLayout from "@/components/auth/AuthLayout"
import InputField from "@/components/common/InputField"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/^.+@.+$/.test(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log("Datos de inicio de sesión:", formData)

      // Simulación de tiempo de carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirección después de inicio de sesión exitoso
      // window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setErrors({ form: "Error al iniciar sesión. Inténtelo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Bienvenido de nuevo. Ingresa tus credenciales para acceder a tu cuenta."
    >
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="text-gray-500 space-y-5">
        <InputField
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          required
        />

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <Link href="/recuperar-password" className="text-blue-600 hover:text-blue-800 font-medium">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Iniciando sesión...
            </span>
          ) : (
            <span className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar sesión
            </span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" className="text-blue-600 hover:text-blue-800 font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
