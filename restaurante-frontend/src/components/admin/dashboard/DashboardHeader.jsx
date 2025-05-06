"use client"

import { Download, Calendar } from "lucide-react"
import { useState } from "react"
import { Parser } from 'json2csv'
import { saveAs } from 'file-saver'

export default function DashboardHeader({ dateRange, setDateRange }) {
  const [exporting, setExporting] = useState(false)

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No autorizado')

      // Llamamos a los distintos endpoints en paralelo
      const [statsRes, ordRes, revRes, perfRes, revwRes] = await Promise.all([
        fetch(`http://localhost:5000/api/stats/range?range=${dateRange}`),
        fetch(`http://localhost:5000/api/stats/orders?range=${dateRange}`),
        fetch(`http://localhost:5000/api/stats/revenue?range=${dateRange}`),
        fetch(`http://localhost:5000/api/stats/restaurants?range=${dateRange}`,   { headers:{ Authorization:`Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/resenas/stats?range=${dateRange}`, { headers:{ Authorization:`Bearer ${token}` } }),
      ])

      // Verificamos respuestas
      if (!statsRes.ok || !ordRes.ok || !revRes.ok || !perfRes.ok || !revwRes.ok) {
        throw new Error('Alguno de los endpoints falló')
      }

      const [stats, ordersChart, revenueChart, performance, reviewStats] = await Promise.all([
        statsRes.json(),
        ordRes.json(),
        revRes.json(),
        perfRes.json(),
        revwRes.json()
      ])

      // Preparamos cada sección  
      const sections = []

      // 1) StatCards
      sections.push({
        title: 'KPIs',
        data: Object.entries(stats).map(([key, val]) => ({
          Métrica: key,
          Valor: val.value != null ? val.value : '',
          Cambio:   val.change != null ? val.change + '%' : ''
        }))
      })

      // 2) Orders chart
      sections.push({
        title: 'Ordenes',
        data: ordersChart.map(d => ({
          Tiempo:      d.time,
          Completados: d.completados,
          Pendientes:  d.pendientes,
          Cancelados:  d.cancelados
        }))
      })

      // 3) Revenue chart
      sections.push({
        title: 'Ingresos',
        data: revenueChart.map(d => ({
          Tiempo:   d.time,
          Ingresos: d.ingresos
        }))
      })

      // 4) Performance por Restaurante
      sections.push({
        title: 'Rendimiento Restaurantes',
        data: performance.map(r => ({
          Restaurante:  r.name,
          Ventas:       r.ventas,
          Pedidos:      r.pedidos,
          Calificación: r.calificacion
        }))
      })

      // 5) Reviews stats
      sections.push({
        title: 'Resumen Resenas',
        data: [{ Total: reviewStats.total, Promedio: reviewStats.average }]
      })
      sections.push({
        title: 'Distribución Resenas',
        data: [5,4,3,2,1].map(r => ({
          Calificación: `${r} estrellas`,
          Cantidad:      reviewStats.distribution[r] || 0
        }))
      })

      // Generar un CSV multi-sección
      let csv = ''
      for (const sect of sections) {
        if (!sect.data.length) continue
        csv += `\n\n# ===== ${sect.title} =====\n`
        const parser = new Parser({ fields: Object.keys(sect.data[0]) })
        csv += parser.parse(sect.data) + '\n'
      }

      // Descargarlo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, `dashboard_${dateRange}_${Date.now()}.csv`)
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setExporting(false)
    }
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
            className="text-gray-600 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Download className="w-4 h-4 mr-2" />
          {exporting ? 'Exportando…' : 'Exportar CSV'}
        </button>
      </div>
    </div>
  )
}
