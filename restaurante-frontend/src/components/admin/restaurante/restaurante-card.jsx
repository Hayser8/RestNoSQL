"use client"
import { Edit, Trash2, MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card, CardContent } from "./card"
import { Button } from "./button"

export function RestauranteCard({ restaurante, onEdit, onDelete }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="bg-blue-50 p-4 rounded-t-lg">
        <h3 className="font-semibold text-lg text-blue-800">{restaurante.nombre}</h3>
      </div>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 mb-4 flex-1">
          <div className="flex items-start">
            <MapPin size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">{restaurante.direccion}</p>
          </div>
          <div className="flex items-center">
            <Phone size={18} className="text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">{restaurante.telefono}</p>
          </div>
          <div className="flex items-center">
            <Mail size={18} className="text-gray-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">{restaurante.email}</p>
          </div>
          <div className="flex items-start">
            <Clock size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              {restaurante.horario && restaurante.horario.length > 0 ? (
                <div className="text-sm">
                  <p className="font-medium">Horario:</p>
                  <ul className="space-y-1 mt-1">
                    {restaurante.horario.slice(0, 2).map((h, index) => (
                      <li key={index} className="text-gray-700">
                        {h.dia}: {h.apertura} - {h.cierre}
                      </li>
                    ))}
                    {restaurante.horario.length > 2 && <li className="text-blue-600 cursor-pointer">Ver más...</li>}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">Horario no disponible</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-auto pt-3 border-t">
          <Button variant="outline" size="sm" className="flex items-center" onClick={() => onEdit(restaurante)}>
            <Edit size={16} className="mr-1" />
            Editar
          </Button>
          <Button variant="danger" size="sm" className="flex items-center" onClick={() => onDelete(restaurante._id)}>
            <Trash2 size={16} className="mr-1" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
