import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function ReportList() {
  const [reportes, setReportes]   = useState([])
  const [cargando, setCargando]   = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    obtenerReportes()
  }, [])

  async function obtenerReportes() {
    setCargando(true)
    setError('')

    const { data, error: sbError } = await supabase
      .from('reportes')
      .select('*')
      .order('fecha', { ascending: false }) // Los más recientes primero

    if (sbError) {
      setError('No se pudieron cargar los reportes.')
    } else {
      setReportes(data)
    }

    setCargando(false)
  }

  // Formatear la fecha a español legible
  function formatearFecha(fechaISO) {
    return new Date(fechaISO).toLocaleString('es-CO', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    })
  }

  if (cargando) {
    return (
      <p className="text-center text-slate-400 text-sm py-8 animate-pulse">
        Cargando reportes...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center text-red-500 text-sm py-8">
        {error}
      </p>
    )
  }

  if (reportes.length === 0) {
    return (
      <p className="text-center text-slate-400 text-sm py-8">
        No hay reportes todavía. ¡Sé el primero en reportar!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {reportes.map((reporte) => (
        <div
          key={reporte.id}
          className="bg-white border border-blue-100 rounded-2xl p-5"
        >
          {/* Encabezado: título + municipio */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-slate-800 text-sm leading-snug">
              {reporte.titulo}
            </h3>
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap">
              📍 {reporte.municipio}
            </span>
          </div>

          {/* Descripción */}
          {reporte.descripcion && (
            <p className="text-slate-500 text-sm leading-relaxed mb-3">
              {reporte.descripcion}
            </p>
          )}

          {/* Fecha */}
          <p className="text-xs text-slate-400">
            🕐 {formatearFecha(reporte.fecha)}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ReportList