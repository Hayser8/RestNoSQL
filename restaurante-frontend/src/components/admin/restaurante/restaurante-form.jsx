"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "./card";
import { Input } from "./input";
import { Button } from "./button";

export function RestauranteForm({ restaurante, onSave, onCancel }) {
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ubicacion: {
      lat: "",
      lng: "",
    },
    telefono: "",
    email: "",
    horario: [
      {
        dia: "Lunes",
        apertura: "09:00",
        cierre: "18:00",
      },
    ],
  });

  useEffect(() => {
    if (restaurante) {
      const lat =
        restaurante.ubicacion.lat ??
        restaurante.ubicacion.coordinates?.[1] ??
        "";
      const lng =
        restaurante.ubicacion.lng ??
        restaurante.ubicacion.coordinates?.[0] ??
        "";
      setFormData({
        nombre: restaurante.nombre,
        direccion: restaurante.direccion,
        ubicacion: {
          lat: lat.toString(),
          lng: lng.toString(),
        },
        telefono: restaurante.telefono,
        email: restaurante.email,
        horario: restaurante.horario.length
          ? restaurante.horario
          : [
              {
                dia: "Lunes",
                apertura: "09:00",
                cierre: "18:00",
              },
            ],
      });
    }
  }, [restaurante]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("ubicacion.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleHorarioChange = (index, field, value) => {
    setFormData((prev) => {
      const newHorario = [...prev.horario];
      newHorario[index] = {
        ...newHorario[index],
        [field]: value,
      };
      return {
        ...prev,
        horario: newHorario,
      };
    });
  };

  const addHorario = () => {
    // Encontrar el primer día que no está en el horario
    const diasUsados = formData.horario.map((h) => h.dia);
    const diaDisponible =
      diasSemana.find((dia) => !diasUsados.includes(dia)) || diasSemana[0];

    setFormData((prev) => ({
      ...prev,
      horario: [
        ...prev.horario,
        {
          dia: diaDisponible,
          apertura: "09:00",
          cierre: "18:00",
        },
      ],
    }));
  };

  const removeHorario = (index) => {
    setFormData((prev) => ({
      ...prev,
      horario: prev.horario.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.nombre ||
      !formData.direccion ||
      !formData.ubicacion.lat ||
      !formData.ubicacion.lng ||
      !formData.telefono ||
      !formData.email ||
      !formData.horario.length
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    // Validar email con regex
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, ingrese un email válido");
      return;
    }

    onSave({
      ...restaurante, // Mantener el _id si existe
      ...formData,
      ubicacion: {
        lat: Number(formData.ubicacion.lat),
        lng: Number(formData.ubicacion.lng),
      },
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {restaurante ? "Editar restaurante" : "Nuevo restaurante"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Nombre"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre del restaurante"
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Dirección"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección completa"
              />
            </div>
            <div>
              <Input
                label="Latitud"
                id="ubicacion.lat"
                name="ubicacion.lat"
                type="number"
                step="any"
                value={formData.ubicacion.lat}
                onChange={handleChange}
                placeholder="Ej: 40.416775"
              />
            </div>
            <div>
              <Input
                label="Longitud"
                id="ubicacion.lng"
                name="ubicacion.lng"
                type="number"
                step="any"
                value={formData.ubicacion.lng}
                onChange={handleChange}
                placeholder="Ej: -3.703790"
              />
            </div>
            <div>
              <Input
                label="Teléfono"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: +34 912 345 678"
              />
            </div>
            <div>
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@restaurante.com"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Horario</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={addHorario}
                  disabled={formData.horario.length >= 7}
                >
                  <Plus size={16} className="mr-1" />
                  Añadir día
                </Button>
              </div>

              {formData.horario.map((horario, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-3"
                >
                  <div>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={horario.dia}
                      onChange={(e) =>
                        handleHorarioChange(index, "dia", e.target.value)
                      }
                    >
                      {diasSemana.map((dia) => (
                        <option key={dia} value={dia}>
                          {dia}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={horario.apertura}
                      onChange={(e) =>
                        handleHorarioChange(index, "apertura", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={horario.cierre}
                      onChange={(e) =>
                        handleHorarioChange(index, "cierre", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeHorario(index)}
                      disabled={formData.horario.length <= 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {restaurante ? "Actualizar" : "Crear"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
