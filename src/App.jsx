import './index.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import ReportForm from './components/ReportForm'
import ReportList from './components/ReportList'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [user, setUser]           = useState(null)
  const [username, setUsername]   = useState('')
  const [vista, setVista]         = useState('login') // 'login' | 'register'
  const [cargando, setCargando]   = useState(true)

  // Revisar si ya hay sesión activa al cargar
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setUser(session.user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()
        setUsername(profile?.username || '')
      }
      setCargando(false)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setUsername('')
  }

  function handleLogin(user, username) {
    setUser(user)
    setUsername(username)
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 font-sans">

      {/* Navbar */}
      <nav className="bg-white border-b border-blue-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 2L4 6v6c0 5.1 3.4 9.9 8 11 4.6-1.1 8-5.9 8-11V6l-8-4z" />
              </svg>
            </div>
            <span className="text-blue-700 font-bold text-xl tracking-tight">SafeZone</span>
          </div>

          {/* Usuario en sesión */}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">
                👤 <strong>{username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-2xl mx-auto px-6 pt-16 pb-8 text-center">
        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          Proyecto universitario · Sabana Centro
        </span>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-5">
          Red colaborativa de alertas para{' '}
          <span className="text-blue-700">comerciantes</span>
        </h1>
      </main>

      {/* Auth o contenido principal */}
      {!user ? (
        // Pantalla de login / registro
        <section className="max-w-sm mx-auto px-6 mb-16">
          <div className="bg-white border border-blue-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
              {vista === 'login' ? '🔐 Iniciar sesión' : '✏️ Crear cuenta'}
            </h2>
            {vista === 'login'
              ? <Login    onSwitch={() => setVista('register')} onLogin={handleLogin} />
              : <Register onSwitch={() => setVista('login')}    onLogin={handleLogin} />
            }
          </div>
        </section>
      ) : (
        // Contenido solo para usuarios registrados
        <>
          <section className="max-w-xl mx-auto px-6 mb-10">
            <div className="bg-white border border-blue-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                🚨 Crear nuevo reporte
              </h2>
              <ReportForm />
            </div>
          </section>

          <section className="max-w-xl mx-auto px-6 mb-16">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              📋 Reportes recientes
            </h2>
            <ReportList />
          </section>
        </>
      )}

      {/* Cards de features */}
      <section className="max-w-2xl mx-auto px-6 pb-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '⚡', title: 'Reportes en tiempo real', text: 'Notifica incidentes al instante a toda la red.' },
          { icon: '🤝', title: 'Red colaborativa',        text: 'Comerciantes conectados compartiendo información.' },
          { icon: '📍', title: 'Sabana Centro',           text: 'Diseñado para la comunidad comercial de la región.' },
        ].map((card) => (
          <div key={card.title} className="bg-white border border-blue-100 rounded-2xl p-5">
            <div className="text-2xl mb-3">{card.icon}</div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">{card.title}</h3>
            <p className="text-slate-500 text-sm leading-snug">{card.text}</p>
          </div>
        ))}
      </section>

      <footer className="text-center text-xs text-slate-400 pb-6">
        SafeZone · Proyecto universitario 2026
      </footer>
    </div>
  )
}

export default App