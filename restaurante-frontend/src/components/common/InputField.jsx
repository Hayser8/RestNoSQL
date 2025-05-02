"use client"

export default function InputField({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
