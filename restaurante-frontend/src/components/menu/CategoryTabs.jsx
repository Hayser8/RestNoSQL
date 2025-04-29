"use client"

export default function CategoryTabs({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto hide-scrollbar">
        <button
          className={`py-3 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeCategory === "popular"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveCategory("popular")}
        >
          Todos los platos
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={`py-3 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeCategory === category.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
