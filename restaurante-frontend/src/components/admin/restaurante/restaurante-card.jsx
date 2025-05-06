"use client";

import { Edit, Trash2, MapPin, Phone, Mail, Clock, Plus, X } from "lucide-react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { useState } from "react";

export function RestauranteCard({
  restaurante,
  onEdit,
  onDelete,
  onAddHorario,     // nuevo
  onRemoveHorario   // nuevo
}) {
  const [adding, setAdding] = useState(false);
  const [nuevo,  setNuevo]  = useState({ dia:"", apertura:"09:00", cierre:"18:00" });
  const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

  const handleSaveDia = () => {
    if (!nuevo.dia) return;
    onAddHorario(restaurante._id, nuevo);
    setAdding(false);
    setNuevo({ dia:"", apertura:"09:00", cierre:"18:00" });
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="bg-blue-50 p-4 rounded-t-lg">
        <h3 className="font-semibold text-lg text-blue-800">{restaurante.nombre}</h3>
      </div>

      <CardContent className="flex-1 flex flex-col space-y-3">
        {/* datos de contacto - sin cambios */}
        <div className="flex items-start"><MapPin size={18} className="mr-2 text-gray-500"/><p className="text-gray-600">{restaurante.direccion}</p></div>
        <div className="flex items-center"><Phone  size={18} className="mr-2 text-gray-500"/><p className="text-gray-600">{restaurante.telefono}</p></div>
        <div className="flex items-center"><Mail   size={18} className="mr-2 text-gray-500"/><p className="text-gray-600">{restaurante.email}</p></div>

        {/* -------- Horario -------- */}
        <div className="flex items-start">
          <Clock size={18} className="mr-2 mt-0.5 text-gray-500"/>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm text-gray-600">Horario</p>
              <button onClick={()=>setAdding(!adding)} className="text-blue-600 text-xs flex items-center">
                {adding ? <X size={14}/> : <Plus size={14}/> }
              </button>
            </div>

            {/* listado días */}
            {restaurante.horario?.map(h=>(
              <div key={h.dia} className="text-sm flex justify-between text-gray-600">
                <span>{h.dia}: {h.apertura} - {h.cierre}</span>
                <button onClick={()=>onRemoveHorario(restaurante._id, h.dia)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}

            {/* formulario rápido */}
            {adding && (
              <div className="mt-2 space-y-1 text-sm">
                <select
                  className="text-gray-600 border rounded w-full"
                  value={nuevo.dia}
                  onChange={e=>setNuevo(prev=>({...prev,dia:e.target.value}))}
                >
                  <option value="" cl>Día…</option>
                  {dias.filter(d=>!restaurante.horario.some(h=>h.dia===d))
                       .map(d=> <option key={d}>{d}</option>)}
                </select>
                <div className="flex gap-1">
                  <input type="time" className="text-gray-600 border rounded flex-1"
                    value={nuevo.apertura}
                    onChange={e=>setNuevo(prev=>({...prev,apertura:e.target.value}))}/>
                  <input type="time" className="text-gray-600 border rounded flex-1"
                    value={nuevo.cierre}
                    onChange={e=>setNuevo(prev=>({...prev,cierre:e.target.value}))}/>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={handleSaveDia}>
                  Guardar día
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* -------- acciones -------- */}
        <div className="mt-auto pt-3 border-t flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={()=>onEdit(restaurante)}>
            <Edit size={16} className="text-gray-600 mr-1"/> 
          </Button>
          <Button size="sm" variant="danger" onClick={()=>onDelete(restaurante._id)}>
            <Trash2 size={16} className="mr-1"/> 
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
