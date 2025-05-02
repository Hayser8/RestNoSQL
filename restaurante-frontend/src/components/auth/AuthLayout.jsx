import Link from "next/link"

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              MR
            </div>
            <span className="ml-2 text-xl font-bold text-blue-900">Mamis Restaurant</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-light text-gray-900">{title}</h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-md mx-auto">{subtitle}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-100">{children}</div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Mamis Restaurant. Todos los derechos reservados.
      </div>
    </div>
  )
}
