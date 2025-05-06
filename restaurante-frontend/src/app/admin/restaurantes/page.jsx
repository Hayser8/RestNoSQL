"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AdminLayout    from "../../../components/admin/AdminLayout";
import { Header }     from "../../../components/admin/restaurante/header";
import { RestauranteCard }   from "../../../components/admin/restaurante/restaurante-card";
import { RestauranteForm }   from "../../../components/admin/restaurante/restaurante-form";
import { RestauranteFilter } from "../../../components/admin/restaurante/restaurante-filter";
import { Button }     from "../../../components/admin/restaurante/button";

export default function RestaurantesPage() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [showForm,     setShowForm]     = useState(false);
  const [current,      setCurrent]      = useState(null);

  /* -------- auth header igual que antes -------- */
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };

  /* -------- carga inicial -------- */
  useEffect(() => {
    (async () => {
      const res  = await fetch("http://localhost:5000/api/restaurantes");
      const data = await res.json();
      setRestaurantes(data);
    })();
  }, []);

  /* -------- helpers CRUD que ya tenías -------- */
  const filtered = restaurantes.filter(r => {
    const t = searchTerm.toLowerCase();
    return (
      r.nombre.toLowerCase().includes(t) ||
      r.direccion.toLowerCase().includes(t) ||
      r.email.toLowerCase().includes(t)
    );
  });

  const handleAddNew = () => { setCurrent(null); setShowForm(true); };
  const handleEdit   = r  => { setCurrent(r);   setShowForm(true); };

  const handleDelete = async id => {
    if (!confirm("¿Seguro?")) return;
    await fetch(`http://localhost:5000/api/restaurantes/${id}`, { method:"DELETE", headers:authHeaders });
    setRestaurantes(prev => prev.filter(x => x._id !== id));
  };

  const handleSave = async form => {
    const url    = form._id
      ? `http://localhost:5000/api/restaurantes/${form._id}`
      : "http://localhost:5000/api/restaurantes";
    const method = form._id ? "PUT" : "POST";
    const res    = await fetch(url, { method, headers:authHeaders, body:JSON.stringify(form) });
    const body   = await res.json();
    setRestaurantes(prev =>
      form._id ? prev.map(x => (x._id === body._id ? body : x)) : [...prev, body]
    );
    setShowForm(false);
  };

  /* -------- NUEVO: $push / $pull -------- */
  const addHorario = async (id, nuevo) => {
    const res = await fetch(
      `http://localhost:5000/api/restaurantes/${id}/horario`,
      { method:"POST", headers:authHeaders, body:JSON.stringify(nuevo) }
    );
    if (!res.ok) return alert("No se pudo añadir horario");
    setRestaurantes(prev =>
      prev.map(r => r._id === id ? { ...r, horario:[...r.horario, nuevo]} : r)
    );
  };

  const removeHorario = async (id, dia) => {
    const res = await fetch(
      `http://localhost:5000/api/restaurantes/${id}/horario/${encodeURIComponent(dia)}`,
      { method:"DELETE", headers:authHeaders }
    );
    if (!res.ok) return alert("No se pudo eliminar horario");
    setRestaurantes(prev =>
      prev.map(r => r._id === id ? { ...r, horario:r.horario.filter(h=>h.dia!==dia)} : r)
    );
  };

  /* -------- UI -------- */
  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <Header title="Restaurantes" subtitle="Gestiona tus locales" />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-800 text-xl font-semibold">Lista de restaurantes</h2>
            <Button variant="primary" onClick={handleAddNew}>
              <Plus size={18} className="mr-2" /> Nuevo restaurante
            </Button>
          </div>

          <RestauranteFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {showForm ? (
            <RestauranteForm
              restaurante={current}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length ? (
                filtered.map(r => (
                  <RestauranteCard
                    key={r._id}
                    restaurante={r}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddHorario={addHorario}       
                    onRemoveHorario={removeHorario} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No se encontraron restaurantes.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
