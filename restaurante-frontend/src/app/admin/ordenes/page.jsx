"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import OrdersHeader from "@/components/admin/orders/OrdersHeader"
import OrdersFilters from "@/components/admin/orders/OrdersFilters"
import OrdersTable from "@/components/admin/orders/OrdersTable"
import BulkEditModal from "@/components/admin/orders/BulkEditModal"
import DeleteConfirmModal from "@/components/admin/orders/DeleteConfirmModal"
import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrders, setSelectedOrders] = useState([])

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateRange: { start: null, end: null },
    restaurant: "",
  })

  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)

  // --- Fetch inicial de órdenes ---
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) return router.push("/login")

        const res = await fetch("http://localhost:5000/api/ordenes", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) return router.push("/login")
        if (!res.ok) throw new Error("Error al cargar pedidos")

        const data = await res.json()
        const mapped = data.map((o) => ({
          id: o._id,
          usuarioId: o.usuarioId._id,
          usuario: `${o.usuarioId.nombre} ${o.usuarioId.apellido}`,
          restauranteId: o.restauranteId._id,
          restaurante: o.restauranteId.nombre,
          fecha: new Date(o.fecha),
          estado: o.estado,
          total: o.total,
          articulos: o.articulos.map((a) => ({
            menuItemId: a.menuItemId._id,
            nombre: a.menuItemId.nombre,
            cantidad: a.cantidad,
            precio: a.precio,
          })),
        }))
        setOrders(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [router])

  // --- Aplicar filtros cada vez que cambian orders o filters ---
  useEffect(() => {
    let result = [...orders]

    if (filters.search) {
      const s = filters.search.toLowerCase()
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(s) ||
          o.usuario.toLowerCase().includes(s)
      )
    }

    if (filters.status) {
      result = result.filter((o) => o.estado === filters.status)
    }

    if (filters.restaurant) {
      result = result.filter(
        (o) => o.restauranteId === filters.restaurant
      )
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const start = new Date(filters.dateRange.start)
      const end = new Date(filters.dateRange.end)
      end.setHours(23, 59, 59, 999)
      result = result.filter(
        (o) => o.fecha >= start && o.fecha <= end
      )
    }

    setFilteredOrders(result)
  }, [orders, filters])

  // --- Selección individual y masiva ---
  const handleSelectOrder = (id) =>
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const handleSelectAll = (isSelected) => {
    setSelectedOrders(isSelected ? filteredOrders.map((o) => o.id) : [])
  }

  // --- Bulk Edit: abre modal ---
  const handleBulkEdit = () => {
    if (selectedOrders.length) setIsBulkEditModalOpen(true)
  }

  // --- Bulk Edit Submit: llama a la API ---
  const handleBulkEditSubmit = async (newStatus) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return router.push("/login")

      const res = await fetch(
        "http://localhost:5000/api/ordenes/bulk-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderIds: selectedOrders,
            estado: newStatus,
          }),
        }
      )
      if (res.status === 401) return router.push("/login")
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Error actualizando órdenes")
      }

      // Actualizar estado en cliente
      const updated = orders.map((o) =>
        selectedOrders.includes(o.id)
          ? { ...o, estado: newStatus }
          : o
      )
      setOrders(updated)
      setSelectedOrders([])
      setIsBulkEditModalOpen(false)
    } catch (err) {
      console.error(err)
      // Aquí podrías mostrar un toast o banner de error
    }
  }

  // --- Bulk Delete ---
  const handleBulkDelete = () => {
    if (selectedOrders.length) setIsDeleteModalOpen(true)
  }
  const handleBulkDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return router.push("/login")

      const res = await fetch(
        "http://localhost:5000/api/ordenes/bulk",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderIds: selectedOrders }),
        }
      )
      if (res.status === 401) return router.push("/login")
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Error eliminando órdenes")
      }
      const data = await res.json()
      console.log(data.message)

      // Actualizar UI: quitar del estado local
      const remaining = orders.filter(
        (o) => !selectedOrders.includes(o.id)
      )
      setOrders(remaining)
      setSelectedOrders([])
      setIsDeleteModalOpen(false)
    } catch (err) {
      console.error(err)
      // aquí podrías mostrar un toast o banner de error
    }
  }

  // --- Ver detalles ---
  const handleViewDetails = (orderId) => {
    const detail = orders.find((o) => o.id === orderId)
    setSelectedOrderDetails(detail)
    setIsDetailsModalOpen(true)
  }

  // --- Lista de restaurantes para filtro ---
  const restaurants = Array.from(
    new Set(orders.map((o) => o.restauranteId))
  ).map((id) => {
    const r = orders.find((o) => o.restauranteId === id)
    return { id, name: r.restaurante }
  })

  return (
    <AdminLayout>
      <OrdersHeader
        selectedCount={selectedOrders.length}
        onBulkEdit={handleBulkEdit}
        onBulkDelete={handleBulkDelete}
      />

      <OrdersFilters
        filters={filters}
        setFilters={setFilters}
        restaurants={restaurants}
      />

      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        onSelectAll={handleSelectAll}
        onViewDetails={handleViewDetails}
      />

      {isBulkEditModalOpen && (
        <BulkEditModal
          isOpen
          onClose={() => setIsBulkEditModalOpen(false)}
          onSubmit={handleBulkEditSubmit}
          selectedCount={selectedOrders.length}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleBulkDeleteConfirm}
          selectedCount={selectedOrders.length}
        />
      )}

      {isDetailsModalOpen && selectedOrderDetails && (
        <OrderDetailsModal
          isOpen
          onClose={() => setIsDetailsModalOpen(false)}
          order={selectedOrderDetails}
        />
      )}
    </AdminLayout>
  )
}
