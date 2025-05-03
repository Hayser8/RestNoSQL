"use client"

import { Star } from "lucide-react"

export default function StarRating({ rating = 0, onChange, interactive = false, size = "medium" }) {
  const maxRating = 5

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "w-4 h-4"
      case "large":
        return "w-8 h-8"
      default:
        return "w-6 h-6"
    }
  }

  const sizeClass = getSizeClass()

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  const handleMouseEnter = (value) => {
    // Implementar hover state si es necesario
  }

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= rating

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} p-0.5 focus:outline-none`}
            disabled={!interactive}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
          >
            <Star className={`${sizeClass} ${isFilled ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
          </button>
        )
      })}
    </div>
  )
}
