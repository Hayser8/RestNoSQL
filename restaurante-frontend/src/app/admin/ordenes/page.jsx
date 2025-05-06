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
    dateRange: {
      start: null,
      end: null,
    },
    restaurant: "",
  })

  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)

  // Simular carga de datos
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }
        const res = await fetch("http://localhost:5000/api/ordenes", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (!res.ok) {
          throw new Error("Error al cargar pedidos")
        }
        const data = await res.json()
        // Mapear respuesta al shape que tu UI espera:
        const mapped = data.map((o) => ({
          id:         o._id,
          usuarioId:  o.usuarioId._id,
          usuario:    `${o.usuarioId.nombre} ${o.usuarioId.apellido}`,
          restauranteId: o.restauranteId._id,
          restaurante:   o.restauranteId.nombre,
          fecha:      new Date(o.fecha),
          estado:     o.estado,
          total:      o.total,
          articulos:  o.articulos.map((a) => ({
            menuItemId: a.menuItemId._id,
            nombre:     a.menuItemId.nombre,
            cantidad:   a.cantidad,
            precio:     a.precio,
          })),
        }))
        setOrders(mapped)
        setFilteredOrders(mapped)
      } catch (err) {
        console.error(err)
        // aquí podrías mostrar un mensaje de error global
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [router])

  // Aplicar filtros
  useEffect(() => {
    let result = [...orders]

    // Filtrar por búsqueda (ID o nombre de cliente)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (order) => order.id.toLowerCase().includes(searchLower) || order.usuario.toLowerCase().includes(searchLower),
      )
    }

    // Filtrar por estado
    if (filters.status) {
      result = result.filter((order) => order.estado === filters.status)
    }

    // Filtrar por restaurante
    if (filters.restaurant) {
      result = result.filter((order) => order.restauranteId === filters.restaurant)
    }

    // Filtrar por rango de fechas
    if (filters.dateRange.start && filters.dateRange.end) {
      const start = new Date(filters.dateRange.start)
      const end = new Date(filters.dateRange.end)
      end.setHours(23, 59, 59, 999) // Incluir todo el día final

      result = result.filter((order) => {
        const orderDate = new Date(order.fecha)
        return orderDate >= start && orderDate <= end
      })
    }

    setFilteredOrders(result)
  }, [filters, orders])

  // Manejar selección de órdenes
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId)
      } else {
        return [...prev, orderId]
      }
    })
  }

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  // Manejar edición en lote
  const handleBulkEdit = () => {
    if (selectedOrders.length > 0) {
      setIsBulkEditModalOpen(true)
    }
  }

  const handleBulkEditSubmit = (newStatus) => {
    // En una aplicación real, esto sería una llamada a la API
    const updatedOrders = orders.map((order) => {
      if (selectedOrders.includes(order.id)) {
        return { ...order, estado: newStatus }
      }
      return order
    })

    setOrders(updatedOrders)
    setIsBulkEditModalOpen(false)
    setSelectedOrders([])
  }

  // Manejar eliminación en lote
  const handleBulkDelete = () => {
    if (selectedOrders.length > 0) {
      setIsDeleteModalOpen(true)
    }
  }

  const handleBulkDeleteConfirm = () => {
    // En una aplicación real, esto sería una llamada a la API
    const updatedOrders = orders.filter((order) => !selectedOrders.includes(order.id))
    setOrders(updatedOrders)
    setIsDeleteModalOpen(false)
    setSelectedOrders([])
  }

  // Manejar visualización de detalles
  const handleViewDetails = (orderId) => {
    const orderDetails = orders.find((order) => order.id === orderId)
    setSelectedOrderDetails(orderDetails)
    setIsDetailsModalOpen(true)
  }

  // Obtener restaurantes únicos para el filtro
  const restaurants = [...new Set(orders.map((order) => order.restauranteId))].map((id) => {
    const restaurant = orders.find((order) => order.restauranteId === id)
    return { id, name: restaurant.restaurante }
  })

  return (
    <AdminLayout>
      <OrdersHeader selectedCount={selectedOrders.length} onBulkEdit={handleBulkEdit} onBulkDelete={handleBulkDelete} />

      <OrdersFilters filters={filters} setFilters={setFilters} restaurants={restaurants} />

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
          isOpen={isBulkEditModalOpen}
          onClose={() => setIsBulkEditModalOpen(false)}
          onSubmit={handleBulkEditSubmit}
          selectedCount={selectedOrders.length}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleBulkDeleteConfirm}
          selectedCount={selectedOrders.length}
        />
      )}

      {isDetailsModalOpen && selectedOrderDetails && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          order={selectedOrderDetails}
        />
      )}
    </AdminLayout>
  )
}
