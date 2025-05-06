// src/components/admin/menu/menu-item-card.jsx
"use client"

import { Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"

export function MenuItemCard({ item, onEdit, onDelete }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={item.imagen || "/placeholder.svg"}
          alt={item.nombre}
          className="w-full h-full object-cover"
        />
        <Badge variant="primary" className="absolute top-2 right-2">
          {item.categoria}
        </Badge>
      </div>

      <CardContent className="flex-1 flex flex-col">
        {/* Nombre y precio */}
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-semibold text-lg text-gray-800">
            {item.nombre}
          </h3>
          <div className="flex items-baseline text-gray-800">
            {/* Símbolo “Q” en tamaño base */}
            <span className="text-base font-medium mr-1">Q</span>
            {/* Precio en tamaño mayor */}
            <span className="text-xl font-bold">
              {item.precio.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-gray-700 text-sm mb-4 flex-1">
          {item.descripcion}
        </p>

        {/* Botones */}
        <div className="flex justify-end space-x-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center text-gray-800"
            onClick={() => onEdit(item)}
          >
            <Edit size={16} className="mr-1" />
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex items-center"
            onClick={() => onDelete(item._id)}
          >
            <Trash2 size={16} className="mr-1" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
