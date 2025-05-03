// src/app/checkout/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import RestaurantSelection from '../../components/checkout/RestaurantSelection'
import PaymentForm from '../../components/checkout/PaymentForm'
import OrderConfirmation from '../../components/checkout/OrderConfirmation'
import OrderSummary from '../../components/checkout/OrderSummary'
import CheckoutNavbar from '../../components/checkout/CheckoutNavbar'
import CheckoutFooter from '../../components/checkout/CheckoutFooter'
import { useCheckout } from '../../components/checkout/hooks/useCheckout'

export default function CheckoutPage() {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)

  // 1) Al montar, comprobamos token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      setIsAuth(true)
    }
  }, [router])

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

  // Mientras confirmamos auth, podemos mostrar null o un loader
  if (!isAuth) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
            {currentStep === 1 && (
              <RestaurantSelection
                formData={formData}
                errors={errors}
                restaurants={restaurants}
                handleChange={handleChange}
                nextStep={nextStep}
              />
            )}
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
            {currentStep === 3 && (
              <OrderConfirmation formData={formData} restaurants={restaurants} />
            )}
          </div>

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

      <CheckoutFooter />
    </div>
  )
}
