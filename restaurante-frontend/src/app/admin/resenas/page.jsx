"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import { Header }  from "@/components/admin/restaurante/header";
import ResenaStats from "@/components/admin/resena/resena-stats";
import ResenaFilter from "@/components/admin/resena/resena-filter";
import ResenaCard   from "@/components/admin/resena/resena-card";
import ResenaForm   from "@/components/admin/resena/resena-form";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";

/* helper general ------------------------------------------------------- */
const fetchJSON = async (path, opts = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${BACKEND}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers
    },
    ...opts
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Error de servidor");
  }
  return res.json();
};
/* --------------------------------------------------------------------- */

export default function ResenasPage() {
  /* catálogos */
  const [usuarios,     setUsuarios]     = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [ordenes,      setOrdenes]      = useState([]);
  const [menuItems,    setMenuItems]    = useState([]);

  /* reseñas */
  const [resenas,      setResenas]      = useState([]);
  const [loading,      setLoading]      = useState(true);

  /* filtros */
  const [searchTerm,   setSearchTerm]   = useState("");
  const [filtros,      setFiltros]      = useState({ restauranteId:"", calificacion:"", periodo:"" });

  /* CRUD modal */
  const [showForm,     setShowForm]     = useState(false);
  const [current,      setCurrent]      = useState(null);

  /* ---------- carga catálogos una sola vez ---------- */
  useEffect(() => {
    (async () => {
      try {
        const [u, r, o, m] = await Promise.all([
          fetchJSON("/api/usuarios"),          // ajusta si tu endpoint es distinto
          fetchJSON("/api/restaurantes"),
          fetchJSON("/api/ordenes"),
          fetchJSON("/api/articulos-menu")
        ]);
        setUsuarios(u); setRestaurantes(r); setOrdenes(o); setMenuItems(m);
      } catch (err) {
        console.error("Catálogos:", err.message);
        alert(err.message);
      }
    })();
  }, []);

  /* ---------- función para leer reseñas con filtros ---------- */
  const loadResenas = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm)            params.append("q", searchTerm);
      if (filtros.restauranteId) params.append("restauranteId", filtros.restauranteId);
      if (filtros.calificacion)  params.append("calificacion", filtros.calificacion);
      if (filtros.periodo)       params.append("periodo", filtros.periodo);

      const path = params.toString()
        ? `/api/resenas/filter?${params.toString()}`
        : `/api/resenas/all`;

      const data = await fetchJSON(path);
      setResenas(data);
    } catch (err) {
      console.error("Reseñas:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filtros]);

  /* recargar cuando cambian filtros */
  useEffect(() => { loadResenas(); }, [loadResenas]);

  /* ---------- CRUD handlers ---------- */
  const handleDelete = async id => {
    if (!confirm("¿Eliminar reseña?")) return;
    try {
      await fetchJSON(`/api/resenas/${id}`, { method: "DELETE" });
      setResenas(prev => prev.filter(r => r._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleSave = async data => {
    try {
      const path   = data._id ? `/api/resenas/${data._id}` : "/api/resenas";
      const method = data._id ? "PUT" : "POST";
      const saved  = await fetchJSON(path, {
        method,
        body: JSON.stringify(data)
      });

      setResenas(prev => {
        const copy = [...prev];
        const idx  = copy.findIndex(r => r._id === saved._id);
        if (idx === -1) copy.push(saved); else copy[idx] = saved;
        return copy;
      });
      setShowForm(false);
    } catch (err) { alert(err.message); }
  };

  /* ---------- UI ---------- */
  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <Header title="Reseñas" subtitle="Gestiona las opiniones de tus clientes" />

        {!showForm && <ResenaStats resenas={resenas} className="mb-6" />}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Lista de reseñas</h2>
          {!showForm && (
            <button
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              onClick={() => { setCurrent(null); setShowForm(true); }}
            >
              <Plus size={18} className="mr-1" /> Nueva reseña
            </button>
          )}
        </div>

        <ResenaFilter
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          filtros={filtros}       setFiltros={setFiltros}
          restaurantes={restaurantes}
        />

        {showForm ? (
          <ResenaForm
            resena={current}
            usuarios={usuarios}
            restaurantes={restaurantes}
            ordenes={ordenes}
            menuItems={menuItems}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        ) : loading ? (
          <p className="text-center py-12 text-gray-500">Cargando reseñas…</p>
        ) : resenas.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resenas.map(r => (
              <ResenaCard
                key={r._id}
                resena={r}
                onEdit={() => { setCurrent(r); setShowForm(true); }}
                onDelete={() => handleDelete(r._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">No se encontraron reseñas.</p>
        )}
      </div>
    </AdminLayout>
  );
}
