"use client"

export function Input({ label, id, error, className = "", icon, ...props }) {
  return (
    <div className="mb-4 relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-800 mb-1"
        >
          {label}
        </label>
      )}

      {icon && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}

      <input
        id={id}
        className={`w-full ${
          icon ? "pl-10" : ""
        } px-3 py-2 border text-gray-800 ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
