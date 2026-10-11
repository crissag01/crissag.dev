import { useEffect, useState, useCallback } from 'react'
import { projects } from '../data/projects'

const TOKEN_KEY = 'crissag-admin-token'

interface Comment {
  id: string
  name: string
  email: string
  projectId: string
  comment: string
  rating: number
  createdAt: string
  approved: boolean
}

function getProjectTitle(projectId: string): string {
  const project = projects.find(p => p.id === Number(projectId))
  return project?.translations.es.title ?? `Proyecto #${projectId}`
}

function readStoredToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}

export function AdminApp() {
  const [token, setToken] = useState(readStoredToken)
  const [tokenInput, setTokenInput] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const fetchPending = useCallback(async (authToken: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/comments/pending', {
        headers: { Authorization: `Bearer ${authToken}` }
      })

      if (response.status === 401) {
        try { sessionStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
        setToken('')
        setError('Token inválido o expirado. Vuelve a ingresarlo.')
        return
      }

      const data = await response.json()
      if (data.success) {
        setComments(data.comments)
      } else {
        setError(data.error || 'Error al cargar comentarios')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount/token-change is intentional
    if (token) fetchPending(token)
  }, [token, fetchPending])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const value = tokenInput.trim()
    if (!value) return
    try { sessionStorage.setItem(TOKEN_KEY, value) } catch { /* ignore */ }
    setToken(value)
    setTokenInput('')
  }

  const handleLogout = () => {
    try { sessionStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
    setToken('')
    setComments([])
  }

  const handleApprove = async (id: string) => {
    setBusyId(id)
    try {
      const response = await fetch(`/api/comments/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== id))
      } else {
        setError(data.error || 'Error al aprobar')
      }
    } catch {
      setError('Error de conexión al aprobar')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Borrar este comentario permanentemente?')) return
    setBusyId(id)
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== id))
      } else {
        setError(data.error || 'Error al borrar')
      }
    } catch {
      setError('Error de conexión al borrar')
    } finally {
      setBusyId(null)
    }
  }

  if (!token) {
    return (
      <div className="admin-shell">
        <form className="admin-login" onSubmit={handleLogin}>
          <h1>Admin · crissag.dev</h1>
          <label htmlFor="token">ADMIN_TOKEN</label>
          <input
            id="token"
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Pega tu token"
            autoFocus
          />
          <button type="submit">Entrar</button>
          {error && <p className="admin-error">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>Comentarios pendientes</h1>
        <div className="admin-header-actions">
          <button onClick={() => fetchPending(token)} disabled={isLoading}>
            {isLoading ? 'Cargando…' : 'Refrescar'}
          </button>
          <button onClick={handleLogout} className="admin-logout">Salir</button>
        </div>
      </header>

      {error && <p className="admin-error">{error}</p>}

      {!isLoading && comments.length === 0 && !error && (
        <p className="admin-empty">No hay comentarios pendientes.</p>
      )}

      <div className="admin-list">
        {comments.map((c) => (
          <div key={c.id} className="admin-card">
            <div className="admin-card-header">
              <strong>{c.name}</strong>
              <span className="admin-stars">{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</span>
            </div>
            <div className="admin-card-meta">
              <a href={`mailto:${c.email}`}>{c.email}</a>
              <span>{getProjectTitle(c.projectId)}</span>
              <span>{new Date(c.createdAt).toLocaleString('es-ES')}</span>
            </div>
            <p className="admin-card-comment">{c.comment}</p>
            <div className="admin-card-actions">
              <button
                className="admin-approve"
                disabled={busyId === c.id}
                onClick={() => handleApprove(c.id)}
              >
                Aprobar
              </button>
              <button
                className="admin-delete"
                disabled={busyId === c.id}
                onClick={() => handleDelete(c.id)}
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
