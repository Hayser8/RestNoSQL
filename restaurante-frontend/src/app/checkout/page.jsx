"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CheckoutSteps from "../../components/checkout/CheckoutSteps"
import RestaurantSelection from "../../components/checkout/RestaurantSelection"
import PaymentForm from "../../components/checkout/PaymentForm"
import OrderConfirmation from "../../components/checkout/OrderConfirmation"
import OrderSummary from "../../components/checkout/OrderSummary"
import CheckoutNavbar from "../../components/checkout/CheckoutNavbar"
import CheckoutFooter from "../../components/checkout/CheckoutFooter"
import { useCheckout } from "../../components/checkout/hooks/useCheckout"

export default function CheckoutPage() {
  const {
    currentStep,
    formData,
    errors,
    isProcessing,
    restaurants,
    cartItems,
    subtotal,
    discount,
    shipping,
    total,
    handleChange,
    validateForm,
    nextStep,
    prevStep,
    processPayment,
    formatPrice,
    formatCardNumber,
    formatExpiryDate,
  } = useCheckout()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar simplificado */}
      <CheckoutNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pasos del checkout */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <Link
              href="/cart"
              className="text-blue-600 hover:text-blue-800 flex items-center absolute left-4 sm:left-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al carrito
            </Link>

            <CheckoutSteps currentStep={currentStep} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contenido principal del checkout */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Paso 1: Selección de restaurante */}
              {currentStep === 1 && (
                <RestaurantSelection
                  formData={formData}
                  errors={errors}
                  restaurants={restaurants}
                  handleChange={handleChange}
                  nextStep={nextStep}
                />
              )}

              {/* Paso 2: Información de pago */}
              {currentStep === 2 && (
                <PaymentForm
                  formData={formData}
                  errors={errors}
                  restaurants={restaurants}
                  isProcessing={isProcessing}
                  total={total}
                  formatPrice={formatPrice}
                  handleChange={handleChange}
                  formatCardNumber={formatCardNumber}
                  formatExpiryDate={formatExpiryDate}
                  prevStep={prevStep}
                  processPayment={processPayment}
                />
              )}

              {/* Paso 3: Confirmación */}
              {currentStep === 3 && <OrderConfirmation formData={formData} restaurants={restaurants} />}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="md:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              formatPrice={formatPrice}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>

      {/* Footer simplificado */}
      <CheckoutFooter />
    </div>
  )
}
