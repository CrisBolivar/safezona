import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORES = ['#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF']

function Dashboard() {
  const [reportes, setReportes]       = useState([])
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [cargando, setCargando]       = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    setCargando(true)

    // Traer todos los reportes
    const { data: dataReportes } = await supabase
      .from('reportes')
      .select('*')
      .order('fecha', { ascending: true })

    // Contar usuarios en profiles
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    setReportes(dataReportes || [])
    setTotalUsuarios(count || 0)
    setCargando(false)
  }

  // Agrupar reportes por municipio
  function porMunicipio() {
    const mapa = {}
    reportes.forEach(r => {
      mapa[r.municipio] = (mapa[r.municipio] || 0) + 1
    })
    return Object.entries(mapa).map(([name, value]) => ({ name, value }))
  }

  // Agrupar reportes por día
  function porDia() {
    const mapa = {}
    reportes.forEach(r => {
      const dia = new Date(r.fecha).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short'
      })
      mapa[dia] = (mapa[dia] || 0) + 1
    })
    return Object.entries(mapa).map(([dia, cantidad]) => ({ dia, cantidad }))
  }

  if (cargando) {
    return (
      <p className="text-center text-slate-400 animate-pulse py-12">
        Cargando dashboard...
      </p>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-slate-900">📊 Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Estadísticas generales de SafeZone</p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-blue-100 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-blue-700">{reportes.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total reportes</p>
        </div>
        <div className="bg-white border border-blue-100 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-blue-700">{totalUsuarios}</p>
          <p className="text-sm text-slate-500 mt-1">Usuarios registrados</p>
        </div>
        <div className="bg-white border border-blue-100 rounded-2xl p-5 text-center col-span-2 sm:col-span-1">
          <p className="text-3xl font-bold text-blue-700">{porMunicipio().length}</p>
          <p className="text-sm text-slate-500 mt-1">Municipios activos</p>
        </div>
      </div>

      {/* Gráfica de barras — reportes por día */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Reportes por día</h3>
        {porDia().length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Sin datos todavía</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={porDia()}>
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#1D4ED8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Gráfica de torta — reportes por municipio */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Reportes por municipio</h3>
        {porMunicipio().length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Sin datos todavía</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={porMunicipio()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${Math.round(percent * 100)}%`
                }
              >
                {porMunicipio().map((_, i) => (
                  <Cell key={i} fill={COLORES[i % COLORES.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  )
}

export default Dashboard