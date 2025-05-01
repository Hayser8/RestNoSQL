import Link from "next/link"
import { CheckCircle2, Store, MapPin, Clock, CreditCard } from "lucide-react"

export default function OrderConfirmation({ formData, restaurants }) {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-2xl font-medium text-blue-900 mb-2">¡Pedido confirmado!</h2>
      <p className="text-gray-600 mb-6">Tu pedido ha sido recibido y está siendo preparado.</p>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Detalles del pedido</h3>

        <div className="space-y-2">
          <div className="flex items-center">
            <Store className="w-5 h-5 text-blue-600 mr-2" />
            <p className="text-gray-700">
              Restaurante:{" "}
              <span className="font-medium">{restaurants.find((r) => r.id === formData.selectedRestaurant)?.name}</span>
            </p>
          </div>

          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <p className="text-gray-700">
              Dirección de entrega: <span className="font-medium">Calle del Usuario 42, Madrid</span>
            </p>
          </div>

          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <p className="text-gray-700">
              Tiempo estimado:{" "}
              <span className="font-medium">
                {restaurants.find((r) => r.id === formData.selectedRestaurant)?.estimatedTime} minutos
              </span>
            </p>
          </div>

          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
            <p className="text-gray-700">
              Método de pago: <span className="font-medium">Tarjeta terminada en {formData.cardNumber.slice(-4)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/landing"
          className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
        >
          Volver a la página principal
        </Link>

        <Link
          href="#"
          className="bg-white text-blue-600 border border-blue-600 py-3 px-6 rounded-md hover:bg-blue-50 transition-colors"
        >
          Ver estado del pedido
        </Link>
      </div>
    </div>
  )
}
