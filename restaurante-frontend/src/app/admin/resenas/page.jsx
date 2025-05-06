"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";

import AdminLayout   from "@/components/admin/AdminLayout";
import { Header }    from "@/components/admin/restaurante/header";
import ResenaStats   from "@/components/admin/resena/resena-stats";
import ResenaFilter  from "@/components/admin/resena/resena-filter";
import ResenaCard    from "@/components/admin/resena/resena-card";
import ResenaForm    from "@/components/admin/resena/resena-form";

const BACKEND  = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000";
const PAGE_SIZE = 9;

/* helper fetch -------------------------------------------------------- */
const fetchJSON = async (path, opts = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BACKEND}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
    ...opts,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Error del servidor");
  }
  return res.json();
};
/* -------------------------------------------------------------------- */

export default function ResenasPage() {
  /* catálogos */
  const [usuarios,     setUsuarios]     = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [ordenes,      setOrdenes]      = useState([]);
  const [menuItems,    setMenuItems]    = useState([]);

  /* reseñas + paginación */
  const [resenas, setResenas] = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);

  /* filtros */
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState({
    restauranteId: "",
    calificacion : "",
    periodo      : "",
  });

  /* modal CRUD */
  const [showForm, setShowForm] = useState(false);
  const [current,  setCurrent]  = useState(null);

  /* reset a pág 1 si cambian filtros / búsqueda */
  useEffect(() => { setPage(1); }, [searchTerm, filtros]);

  /* cargar catálogos una sola vez */
  useEffect(() => {
    (async () => {
      try {
        const [u, r, o, m] = await Promise.all([
          fetchJSON("/api/usuarios"),
          fetchJSON("/api/restaurantes"),
          fetchJSON("/api/ordenes"),
          fetchJSON("/api/articulos-menu"),
        ]);
        setUsuarios(u); setRestaurantes(r); setOrdenes(o); setMenuItems(m);
      } catch (err) { alert(err.message); }
    })();
  }, []);

  /* leer reseñas con paginación y filtros */
  const loadResenas = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
      });
      if (searchTerm)            params.append("q", searchTerm);
      if (filtros.restauranteId) params.append("restauranteId", filtros.restauranteId);
      if (filtros.calificacion)  params.append("calificacion",  filtros.calificacion);
      if (filtros.periodo)       params.append("periodo",       filtros.periodo);

      const isFiltered =
        searchTerm || filtros.restauranteId || filtros.calificacion || filtros.periodo;

      const path = isFiltered
        ? `/api/resenas/filter?${params}`
        : `/api/resenas/all?${params}`;

      const { data, total } = await fetchJSON(path);
      setResenas(data);
      setTotal(total);
    } catch (err) { alert(err.message); }
    finally      { setLoading(false); }
  }, [page, searchTerm, filtros]);

  useEffect(() => { loadResenas(); }, [loadResenas]);

  /* CRUD helpers ------------------------------------------------------ */
  const refresh = () => loadResenas();

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar reseña?")) return;
    try {
      await fetchJSON(`/api/resenas/${id}`, { method: "DELETE" });
      refresh();
    } catch (err) { alert(err.message); }
  };

  const handleSave = async (data) => {
    try {
      const path   = data._id ? `/api/resenas/${data._id}` : "/api/resenas";
      const method = data._id ? "PUT" : "POST";
      await fetchJSON(path, { method, body: JSON.stringify(data) });
      setShowForm(false);
      refresh();
    } catch (err) { alert(err.message); }
  };

  /* total de páginas */
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  /* render ------------------------------------------------------------ */
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resenas.map((r) => (
                <ResenaCard
                  key={r._id}
                  resena={r}
                  onEdit={() => { setCurrent(r); setShowForm(true); }}
                  onDelete={() => handleDelete(r._id)}
                />
              ))}
            </div>

            {/* paginación */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className={`text-gray-600 px-4 py-2 rounded-md border ${
                  page === 1
                    ? "text-gray-500 border-gray-200 cursor-not-allowed"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                Anterior
              </button>

              <span className="text-sm text-gray-700">
                Página {page} de {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className={`text-gray-600 px-4 py-2 rounded-md border ${
                  page === totalPages
                    ? "text-gray-600 border-gray-200 cursor-not-allowed"
                    : "border-gray-500 hover:bg-gray-100"
                }`}
              >
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <p className="text-center py-12 text-gray-500">No se encontraron reseñas.</p>
        )}
      </div>
    </AdminLayout>
  );
}
