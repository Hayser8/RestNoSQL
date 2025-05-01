"use client"

import { Store, MapPin, CreditCard, User, Lock } from "lucide-react"

export default function PaymentForm({
  formData,
  errors,
  restaurants,
  isProcessing,
  total,
  formatPrice,
  handleChange,
  formatCardNumber,
  formatExpiryDate,
  prevStep,
  processPayment,
}) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-medium text-blue-900 mb-6">Información de pago</h2>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Store className="w-5 h-5 text-blue-600 mr-2" />
          <p className="text-gray-700">
            Restaurante seleccionado:{" "}
            <span className="font-medium">{restaurants.find((r) => r.id === formData.selectedRestaurant)?.name}</span>
          </p>
        </div>

        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <p className="text-gray-700">
            Envío a: <span className="font-medium">Calle del Usuario 42, Madrid</span>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Método de pago</h3>

        <div className="space-y-4">
          <label className="block p-4 border rounded-lg border-blue-600 bg-blue-50">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={formData.paymentMethod === "credit-card"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3">
                <span className="text-base font-medium text-blue-900">Tarjeta de crédito/débito</span>
              </div>
              <div className="ml-auto flex space-x-2">
                <div className="w-10 h-6 bg-blue-900 rounded"></div>
                <div className="w-10 h-6 bg-red-500 rounded"></div>
                <div className="w-10 h-6 bg-yellow-400 rounded"></div>
              </div>
            </div>
          </label>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número de tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value)
                  handleChange({ target: { name: "cardNumber", value: formatted } })
                }}
                maxLength={19}
                className={`text-gray-500 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardNumber ? "border-red-300" : "border-gray-200"
                }`}
              />
              <CreditCard className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
          </div>

          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre en la tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardName"
                name="cardName"
                placeholder="NOMBRE APELLIDO"
                value={formData.cardName}
                onChange={handleChange}
                className={`text-gray-500 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardName ? "border-red-300" : "border-gray-200"
                }`}
              />
              <User className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración
              </label>
              <input
                type="text"
                id="cardExpiry"
                name="cardExpiry"
                placeholder="MM/YY"
                value={formData.cardExpiry}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, "")
                  if (value.length <= 4) {
                    const formatted = formatExpiryDate(value)
                    handleChange({ target: { name: "cardExpiry", value: formatted } })
                  }
                }}
                maxLength={5}
                className={`text-gray-500 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardExpiry ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.cardExpiry && <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>}
            </div>

            <div>
              <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                Código de seguridad (CVC)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardCvc"
                  name="cardCvc"
                  placeholder="123"
                  value={formData.cardCvc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, "")
                    if (value.length <= 4) {
                      handleChange({ target: { name: "cardCvc", value } })
                    }
                  }}
                  maxLength={4}
                  className={`text-gray-500 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cardCvc ? "border-red-300" : "border-gray-200"
                  }`}
                />
                <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              {errors.cardCvc && <p className="mt-1 text-sm text-red-600">{errors.cardCvc}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Volver
        </button>

        <button
          onClick={processPayment}
          disabled={isProcessing}
          className={`bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center ${
            isProcessing ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
              Procesando...
            </>
          ) : (
            <>
              Pagar {formatPrice(total)}
              <Lock className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
