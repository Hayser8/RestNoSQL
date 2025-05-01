import Link from "next/link"

export default function CheckoutNavbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              BS
            </div>
            <span className="ml-2 text-xl font-bold text-blue-900">El Buen Sabor</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
