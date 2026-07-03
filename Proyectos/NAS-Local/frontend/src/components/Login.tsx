import { useState } from 'react'
import './Login.css'

interface Props {
  onLogin: (username: string) => void
}

export function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Usuario y contraseña requeridos')
      return
    }

    // Validación simple (en producción usar backend real)
    if (username && password.length >= 4) {
      onLogin(username)
    } else {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🔐 NAS Local</h1>
          <p>Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu usuario"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p>Demo: usuario: admin | contraseña: admin123</p>
        </div>
      </div>
    </div>
  )
}
