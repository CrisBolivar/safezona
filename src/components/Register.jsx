import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Register({ onSwitch, onLogin }) {
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const [cargando, setCargando]   = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (username.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres.')
      return
    }
    if (password.length < 4 || password.length > 10) {
      setError('La contraseña debe tener entre 4 y 10 caracteres.')
      return
    }

    setCargando(true)

    // Supabase Auth necesita formato email, simulamos uno
    const fakeEmail = `${username}@safezone.app`

    const { data, error: sbError } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
    })

    if (sbError) {
      setError(sbError.message === 'User already registered'
        ? 'Ese usuario ya existe.'
        : 'Error al registrar. Intenta de nuevo.')
      setCargando(false)
      return
    }

    // Guardar el username en la tabla profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, username }])

    if (profileError) {
      setError('Usuario ya existe, prueba con otro nombre.')
      setCargando(false)
      return
    }

    onLogin(data.user, username)
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
          maxLength={20}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Contraseña <span className="text-slate-400 font-normal">(4–10 caracteres)</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          minLength={4}
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
        onClick={handleRegister}
        disabled={cargando}
        className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
      >
        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <button onClick={onSwitch} className="text-blue-700 font-medium hover:underline">
          Inicia sesión
        </button>
      </p>
    </div>
  )
}

export default Register