"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter }            from "next/navigation";

import AdminLayout              from "@/components/admin/AdminLayout";
import OrdersHeader             from "@/components/admin/orders/OrdersHeader";
import OrdersFilters            from "@/components/admin/orders/OrdersFilters";
import OrdersTable              from "@/components/admin/orders/OrdersTable";
import BulkEditModal            from "@/components/admin/orders/BulkEditModal";
import DeleteConfirmModal       from "@/components/admin/orders/DeleteConfirmModal";
import OrderDetailsModal        from "@/components/admin/orders/OrderDetailsModal";

/* ────────────────────────────────────────────────────────── */
/* configuración                                              */
const PER_PAGE = 30;                      // filas por página
const API_URL  = "http://localhost:5000"; // ajusta si es distinto
/* ────────────────────────────────────────────────────────── */

export default function OrdersPage() {
  const router = useRouter();

  /* ───────── estado UI ───────── */
  const [orders,      setOrders]      = useState([]);   // página actual
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  const [selected,    setSelected]    = useState([]);

  /* filtros que VIAJAN al backend  */
  const [filters, setFilters] = useState({
    search:"", status:"", restaurant:"", dateRange:{ start:"", end:"" }
  });
  /* guardamos referencia mutable para poder usarla dentro de fetchOrders */
  const filtersRef = useRef(filters);
  useEffect(()=>{ filtersRef.current = filters; },[filters]);

  /* dialogs */
  const [bulkOpen,   setBulkOpen]   = useState(false);
  const [delOpen,    setDelOpen]    = useState(false);
  const [detOpen,    setDetOpen]    = useState(false);
  const [detOrder,   setDetOrder]   = useState(null);

  /* ───────────────── fetch con paginación + filtros globales ───────────────── */
  const fetchOrders = async (newPage = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const p = new URLSearchParams({
        page  : newPage,
        limit : PER_PAGE,
      });

      /* añade filtros actuales */
      const f = filtersRef.current;
      if (f.search)            p.append("q",          f.search.trim());
      if (f.status)            p.append("status",     f.status);
      if (f.restaurant)        p.append("restaurantId", f.restaurant);
      if (f.dateRange.start && f.dateRange.end) {
        p.append("start", f.dateRange.start);
        p.append("end",   f.dateRange.end);
      }

      const res = await fetch(`${API_URL}/api/ordenes?${p.toString()}`, {
        headers:{ Authorization:`Bearer ${token}` }
      });
      if (res.status === 401) return router.push("/login");
      if (!res.ok) throw new Error("Error al obtener órdenes");

      const { data, total } = await res.json();     // backend ⇒ { data, total }

      /* normaliza datos para la tabla */
      const mapped = data.map(o => ({
        id           : o._id,
        usuarioId    : o.usr?._id        ?? o.usuarioId,
        usuario      : o.usr
                       ? `${o.usr.nombre} ${o.usr.apellido}`
                       : `${o.usuarioId.nombre} ${o.usuarioId.apellido}`,
        restauranteId: o.restaurarteId   ?? o.restauranteId,
        restaurante  : o.rest?.nombre    ?? o.restauranteId?.nombre,
        fecha        : new Date(o.fecha),
        estado       : o.estado,
        total        : o.total,
        articulos    : o.articulos.map(a => ({
          menuItemId : a.menuItemId,
          nombre     : a.nombre,
          cantidad   : a.cantidad,
          precio     : a.precio
        }))
      }));

      setOrders(mapped);
      setTotalPages(Math.max(1, Math.ceil(total / PER_PAGE)));
      setPage(newPage);
      setSelected([]);                       // limpia selección al paginar o filtrar
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* carga inicial */
  useEffect(()=>{ fetchOrders(1); },[]);

  /* cada vez que cambian filtros ⇒ reinicia a página 1 con filtros nuevos */
  useEffect(()=>{ fetchOrders(1); },[filters]);

  /* ───────── helpers de selección ───────── */
  const toggleSelect = id =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);

  const toggleAll = sel =>
    setSelected(sel ? orders.map(o=>o.id) : []);

  /* ───────── placeholder bulk‑edit / bulk‑delete (lógica igual que tenías) ───────── */
  const submitBulkEdit    = async (status)=>{/* … */};
  const confirmBulkDelete = async ()=>{/* … */};

  /* detalles */
  const viewDetails = id => {
    const found = orders.find(o=>o.id===id);
    setDetOrder(found); setDetOpen(true);
  };

  /* lista de restaurantes para el filtro select */
  const restaurants = Array.from(
      new Set(orders.map(o=>o.restauranteId))
    ).map(id=>({
      id,
      name: orders.find(o=>o.restauranteId === id)?.restaurante || "—"
    }));

  /* ───────────────────────────── UI ───────────────────────────── */
  return (
    <AdminLayout>
      <OrdersHeader
        selectedCount={selected.length}
        onBulkEdit ={()=>selected.length && setBulkOpen(true)}
        onBulkDelete={()=>selected.length && setDelOpen(true)}
      />

      <OrdersFilters
        filters={filters}
        setFilters={setFilters}
        restaurants={restaurants}
      />

      <OrdersTable
        orders={orders}
        loading={loading}
        selectedOrders={selected}
        onSelectOrder={toggleSelect}
        onSelectAll={toggleAll}
        onViewDetails={viewDetails}
      />

      {/* paginación sencilla */}
      <div className="flex justify-center items-center gap-4 my-6">
        <button
          onClick={()=>fetchOrders(page-1)}
          disabled={page===1 || loading}
          className="text-gray-600 px-3 py-1 border rounded disabled:opacity-50"
        >← Anterior</button>

        <span className="text-gray-600 text-sm">
          Página {page} de {totalPages}
        </span>

        <button
          onClick={()=>fetchOrders(page+1)}
          disabled={page===totalPages || loading}
          className="text-gray-600 px-3 py-1 border rounded disabled:opacity-50"
        >Siguiente →</button>
      </div>

      {/* modales */}
      {bulkOpen && (
        <BulkEditModal
          isOpen   onClose={()=>setBulkOpen(false)}
          onSubmit={submitBulkEdit}
          selectedCount={selected.length}
        />
      )}
      {delOpen && (
        <DeleteConfirmModal
          isOpen   onClose={()=>setDelOpen(false)}
          onConfirm={confirmBulkDelete}
          selectedCount={selected.length}
        />
      )}
      {detOpen && detOrder && (
        <OrderDetailsModal
          isOpen   onClose={()=>setDetOpen(false)}
          order={detOrder}
        />
      )}
    </AdminLayout>
  );
}
