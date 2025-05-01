"use client"

import { MapPin, AlertCircle, ChevronRight, Clock } from "lucide-react"

export default function RestaurantSelection({ formData, errors, restaurants, handleChange, nextStep }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-medium text-blue-900 mb-6">Selecciona el restaurante</h2>

      <div className="mb-4">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <p className="text-gray-700">
            El pedido se enviará a tu dirección: <span className="font-medium">Calle del Usuario 42, Madrid</span>
          </p>
        </div>

        <p className="text-gray-600 mb-4">Selecciona el restaurante desde el que quieres recibir tu pedido:</p>
      </div>

      <div className="space-y-4">
        {restaurants.map((restaurant) => (
          <label
            key={restaurant.id}
            className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.selectedRestaurant === restaurant.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="selectedRestaurant"
                value={restaurant.id}
                checked={formData.selectedRestaurant === restaurant.id}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-blue-900">{restaurant.name}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{restaurant.estimatedTime} min</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{restaurant.address}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {errors.selectedRestaurant && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors.selectedRestaurant}
        </p>
      )}

      <div className="mt-8">
        <button
          onClick={nextStep}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          Continuar al pago
          <ChevronRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
