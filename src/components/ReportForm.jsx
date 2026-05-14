import { useState } from 'react'
import { supabase } from '../supabaseClient'

// Lista de municipios de Sabana Centro
const MUNICIPIOS = [
  'Zipaquirá', 'Chía', 'Cajicá', 'Tocancipá',
  'Sopó', 'Tabio', 'Tenjo', 'Cogua', 'Nemocón', 'Gachancipá'
]

function ReportForm() {
  // Estado del formulario
  const [titulo, setTitulo]           = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [municipio, setMunicipio]     = useState('')

  // Estado de la UI
  const [enviando, setEnviando]   = useState(false)
  const [enviado, setEnviado]     = useState(false)
  const [error, setError]         = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validación básica
    if (!titulo || !municipio) {
      setError('El título y el municipio son obligatorios.')
      return
    }

    setEnviando(true)

    // Insertar en Supabase
    const { error: sbError } = await supabase
      .from('reportes')
      .insert([{ titulo, descripcion, municipio }])

    setEnviando(false)

    if (sbError) {
      setError('Error al enviar. Intenta de nuevo.')
    } else {
      setEnviado(true)
      setTitulo('')
      setDescripcion('')
      setMunicipio('')

      // Ocultar el mensaje de éxito después de 4 segundos
      setTimeout(() => setEnviado(false), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-blue-100 rounded-2xl p-8 w-full max-w-md">

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 2L4 6v6c0 5.1 3.4 9.9 8 11 4.6-1.1 8-5.9 8-11V6l-8-4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-none">Nuevo reporte</h2>
            <p className="text-xs text-slate-400 mt-0.5">SafeZone · Sabana Centro</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Título del incidente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Hurto en tienda del centro"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="¿Qué pasó? Describe el incidente con detalle..."
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Municipio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Municipio <span className="text-red-500">*</span>
            </label>
            <select
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Selecciona un municipio</option>
              {MUNICIPIOS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {enviando ? 'Enviando...' : 'Enviar reporte'}
          </button>

          {/* Mensaje de éxito */}
          {enviado && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-lg px-4 py-3">
              <span className="text-green-500 text-base">✓</span>
              ¡Reporte enviado correctamente!
            </div>
          )}

        </form>
      </div>
    </div>
  )
}

export default ReportForm