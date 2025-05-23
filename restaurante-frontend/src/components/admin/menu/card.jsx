export function Card({ children, className = "" }) {
    return <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>{children}</div>
  }
  
  export function CardHeader({ children, className = "" }) {
    return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`px-6 py-4 ${className}`}>{children}</div>
  }
  
  export function CardFooter({ children, className = "" }) {
    return <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>{children}</div>
  }
  