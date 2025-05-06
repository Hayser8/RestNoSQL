"use client";

import { Edit, Trash2, Store, ShoppingBag, Star } from "lucide-react";
import { Card, CardContent } from "../menu/card";
import { Button } from "../menu/button";

export default function ResenaCard({ resena, onEdit, onDelete }) {
  /* helpers ----------------------------------------------------------- */
  const renderStars = (rating) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} mr-0.5`}
        />
      ))}
    </div>
  );

  const formatDate = (d) =>
    new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));

  /* datos poblados ---------------------------------------------------- */
  const usuario     = resena.usuarioId     || {};
  const restaurante = resena.restauranteId || {};
  const orden       = resena.ordenId       || {};
  const menuItem    = resena.menuItemId    || null;

  return (
    <Card className="h-full flex flex-col">
      {/* cabecera */}
      <div className="bg-blue-50 p-4 rounded-t-lg flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-blue-800 mb-1">
            {usuario.nombre || "Usuario"} {usuario.apellido || ""}
          </h3>
          <div className="flex items-center">
            {renderStars(resena.calificacion)}
            <span className="ml-2 text-sm font-medium">
              {resena.calificacion}/5
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-500">{formatDate(resena.fecha)}</div>
      </div>

      {/* cuerpo */}
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 mb-4 flex-1">
          <p className="text-gray-700">{resena.comentario}</p>

          <div className="pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Store size={16} className="text-gray-500 mr-2" />
                <p className="text-gray-700 truncate">
                  {restaurante.nombre || "Restaurante"}
                </p>
              </div>

              <div className="flex items-center">
                <ShoppingBag size={16} className="text-gray-500 mr-2" />
                <p className="text-gray-700 truncate">
                  Orden #
                  {orden.numero ||
                    (orden._id ? orden._id.toString().slice(-6) : "")}
                </p>
              </div>

              {menuItem && (
                <div className="flex items-center col-span-2">
                  <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full" />
                  <p className="text-gray-700 truncate">{menuItem.nombre}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* acciones */}
        <div className="flex justify-end space-x-2 mt-auto pt-3 border-t">
          <Button variant="outline" size="sm" onClick={() => onEdit(resena)}>
            <Edit size={16} className="mr-1" /> 
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(resena._id)}>
            <Trash2 size={16} className="mr-1" /> 
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
