"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader"
import StatCards from "@/components/admin/dashboard/StatCards"
import OrdersChart from "@/components/admin/dashboard/OrdersChart"
import RevenueChart from "@/components/admin/dashboard/RevenueChart"
import TopSellingItems from "@/components/admin/dashboard/TopSellingItems"
import RecentOrders from "@/components/admin/dashboard/RecentOrders"
import ReviewsOverview from "@/components/admin/dashboard/ReviewsOverview"
import RestaurantPerformance from "@/components/admin/dashboard/RestaurantPerformance"

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("week") // "day", "week", "month", "year"

  return (
    <AdminLayout>
      <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCards dateRange={dateRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <OrdersChart dateRange={dateRange} />
        <RevenueChart dateRange={dateRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <TopSellingItems dateRange={dateRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewsOverview />
        <RestaurantPerformance />
      </div>
    </AdminLayout>
  )
}
