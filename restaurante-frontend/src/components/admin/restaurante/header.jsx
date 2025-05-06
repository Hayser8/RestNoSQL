export function Header({ title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="flex space-x-2">
        </div>
      </div>
    </div>
  )
}
