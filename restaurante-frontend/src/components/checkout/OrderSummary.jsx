import Image from "next/image"
import { MapPin } from "lucide-react"

const externalLoader = ({ src }) => src

export default function OrderSummary({ cartItems, subtotal, discount, shipping, total, formatPrice, currentStep }) {
  return (
    <div className="bg-white rounded-lg shadow-sm sticky top-4">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-blue-900">Resumen del pedido</h2>
      </div>

      <div className="p-6">
        <ul className="divide-y divide-gray-100 mb-4">
          {cartItems.map((item) => (
            <li key={item.id} className="py-3 flex items-center">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image
                  loader={externalLoader}
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gastos de envío</span>
            <span className="text-gray-900">{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
          </div>

          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-blue-900">Total</span>
              <span className="text-lg font-medium text-blue-900">{formatPrice(total)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Impuestos incluidos</div>
          </div>
        </div>

        {currentStep < 3 && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex">
              <MapPin className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                El pedido se enviará a tu dirección registrada. Tiempo estimado de entrega: 30-45 minutos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
