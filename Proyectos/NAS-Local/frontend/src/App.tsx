import { useState, useEffect } from 'react'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import './App.css'

interface User {
  username: string
  isAuthenticated: boolean
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('nasuser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (username: string) => {
    const userData = { username, isAuthenticated: true }
    setUser(userData)
    localStorage.setItem('nasuser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('nasuser')
  }

  if (loading) {
    return <div className="loading-screen">Cargando...</div>
  }

  return (
    <>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  )
}
