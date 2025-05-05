"use client"

import { Download, Calendar } from "lucide-react"

export default function DashboardHeader({ dateRange, setDateRange }) {
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Bienvenido al panel de administración de El Buen Sabor</p>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar className="w-4 h-4 text-gray-500" />
          </div>
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>

        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </button>
      </div>
    </div>
  )
}
