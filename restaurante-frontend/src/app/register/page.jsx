"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import AuthLayout from "@/components/auth/AuthLayout"
import InputField from "@/components/common/InputField"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    nit: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es obligatorio"
    }

    if (!formData.apellido) {
      newErrors.apellido = "El apellido es obligatorio"
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/^.+@.+$/.test(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido"
    }

    if (!formData.nit) {
      newErrors.nit = "El NIT es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirme su contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (step === 1) {
      handleNextStep()
      return
    }

    if (!validateStep2()) return

    setIsLoading(true)

    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log("Datos de registro:", formData)

      // Simulación de tiempo de carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirección después de registro exitoso
      // window.location.href = "/login"
    } catch (error) {
      console.error("Error al registrar:", error)
      setErrors({ form: "Error al registrar. Inténtelo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Crear cuenta" subtitle="Completa el formulario para registrarte en El Buen Sabor.">
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Nombre"
                type="text"
                name="nombre"
                placeholder="Juan"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
                disabled={isLoading}
                required
              />

              <InputField
                label="Apellido"
                type="text"
                name="apellido"
                placeholder="Pérez"
                value={formData.apellido}
                onChange={handleChange}
                error={errors.apellido}
                disabled={isLoading}
                required
              />
            </div>

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

            <InputField
              label="Teléfono (opcional)"
              type="tel"
              name="telefono"
              placeholder="+34 123 456 789"
              value={formData.telefono}
              onChange={handleChange}
              error={errors.telefono}
              disabled={isLoading}
            />

            <InputField
              label="Dirección (opcional)"
              type="text"
              name="direccion"
              placeholder="Calle Principal 123, Ciudad"
              value={formData.direccion}
              onChange={handleChange}
              error={errors.direccion}
              disabled={isLoading}
            />

            <InputField
              label="NIT (Número de Identificación Tributaria)"
              type="text"
              name="nit"
              placeholder="12345678"
              value={formData.nit}
              onChange={handleChange}
              error={errors.nit}
              disabled={isLoading}
              required
            />

            <button
              type="button"
              onClick={handleNextStep}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </>
        ) : (
          <>
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
              <p className="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border ${
                    errors.confirmPassword ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Acepto los{" "}
                <Link href="/terminos" className="text-blue-600 hover:text-blue-800">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacidad" className="text-blue-600 hover:text-blue-800">
                  política de privacidad
                </Link>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Atrás
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center items-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Registrarse
                  </span>
                )}
              </button>
            </div>
          </>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
