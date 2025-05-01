import { Check } from "lucide-react"

export default function CheckoutSteps({ currentStep }) {
  return (
    <ol className="flex items-center w-full max-w-3xl">
      <li className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep > 1
              ? "bg-blue-600 text-white"
              : currentStep === 1
                ? "border-2 border-blue-600 text-blue-600"
                : "border-2 border-gray-300 text-gray-400"
          }`}
        >
          {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
        </span>
        <span className="ml-2 text-sm font-medium hidden sm:inline">Restaurante</span>
      </li>

      <div className="w-full sm:w-20 h-px bg-gray-200 mx-2"></div>

      <li className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep > 2
              ? "bg-blue-600 text-white"
              : currentStep === 2
                ? "border-2 border-blue-600 text-blue-600"
                : "border-2 border-gray-300 text-gray-400"
          }`}
        >
          {currentStep > 2 ? <Check className="w-5 h-5" /> : "2"}
        </span>
        <span className="ml-2 text-sm font-medium hidden sm:inline">Pago</span>
      </li>

      <div className="w-full sm:w-20 h-px bg-gray-200 mx-2"></div>

      <li className={`flex items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === 3 ? "bg-blue-600 text-white" : "border-2 border-gray-300 text-gray-400"
          }`}
        >
          {currentStep === 3 ? <Check className="w-5 h-5" /> : "3"}
        </span>
        <span className="ml-2 text-sm font-medium hidden sm:inline">Confirmación</span>
      </li>
    </ol>
  )
}
