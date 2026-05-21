import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Login({ onSwitch, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const fakeEmail = `${username}@safezone.app`

    const { data, error: sbError } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    })

    if (sbError) {
      setError('Usuario o contraseña incorrectos.')
      setCargando(false)
      return
    }

    // Obtener el username desde profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.user.id)
      .single()

    onLogin(data.user, profile?.username || username)
    setCargando(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Nombre de usuario
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
          placeholder="Ej: juan"
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          maxLength={10}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={cargando}
        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
      >
        {cargando ? 'Entrando...' : 'Iniciar sesión'}
      </button>

      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{' '}
        <button onClick={onSwitch} className="text-blue-700 font-medium hover:underline">
          Regístrate
        </button>
      </p>
    </div>
  )
}

export default Login