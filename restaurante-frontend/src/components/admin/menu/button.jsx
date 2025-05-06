export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
    const baseClasses = "font-medium rounded focus:outline-none transition-colors"
  
    const variantClasses = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
      outline: "border border-gray-300 hover:bg-gray-100",
      ghost: "hover:bg-gray-100",
    }
  
    const sizeClasses = {
      sm: "py-1 px-2 text-sm",
      md: "py-2 px-4",
      lg: "py-2 px-6 text-lg",
    }
  
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
    return (
      <button className={classes} {...props}>
        {children}
      </button>
    )
  }
  