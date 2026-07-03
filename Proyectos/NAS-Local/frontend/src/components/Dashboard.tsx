import { useState, useEffect, useRef } from 'react'
import { FileGrid } from './FileGrid'
import { Sidebar } from './Sidebar'
import { ChangePasswordModal } from './ChangePasswordModal'
import { LogViewer } from './LogViewer'
import { SystemStats } from './SystemStats'
import { CreateFolderModal } from './CreateFolderModal'
import { MoveFolderModal } from './MoveFolderModal'
import './Dashboard.css'

interface File {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

interface Log {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  user?: string
}

interface User {
  username: string
  isAuthenticated: boolean
}

interface Props {
  user: User
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: Props) {
  const [currentPath, setCurrentPath] = useState('/')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [fileToMove, setFileToMove] = useState<string | null>(null)
  const [logs, setLogs] = useState<Log[]>([])
  const [renameFile, setRenameFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Agregar log
  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString('es-ES')
    const log: Log = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp,
      message,
      type,
      user: user.username
    }
    setLogs(prev => [...prev, log].slice(-50))
  }

  useEffect(() => {
    addLog(`Login exitoso: ${user.username}`, 'success')
  }, [])

  const loadFiles = async (path: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      setFiles(data.files || [])
      addLog(`Carpeta abierta: ${path || 'Inicio'}`, 'info')
    } catch (error) {
      console.error('Error loading files:', error)
      addLog(`Error al cargar: ${path}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFiles(currentPath)
  }, [currentPath])

  const handleFolderClick = (folderName: string) => {
    const newPath = currentPath === '/'
      ? `/${folderName}`
      : `${currentPath}/${folderName}`
    setCurrentPath(newPath)
    addLog(`Abriendo carpeta: ${folderName}`, 'info')
  }

  const handleBack = () => {
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    const newPath = parts.length ? '/' + parts.join('/') : '/'
    setCurrentPath(newPath)
  }

  const handleLogout = () => {
    addLog(`Sesión cerrada por ${user.username}`, 'success')
    setTimeout(() => onLogout(), 500)
  }

  const handlePasswordChange = () => {
    addLog(`Contraseña cambiada por ${user.username}`, 'success')
    setShowPasswordModal(false)
  }

  const handleCreateFolder = async (folderName: string) => {
    try {
      const newPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`
      const response = await fetch(`/api/files?path=${encodeURIComponent(newPath)}`, {
        method: 'POST'
      })
      if (response.ok) {
        addLog(`Carpeta creada: ${folderName}`, 'success')
        await loadFiles(currentPath)
      }
    } catch (error) {
      console.error('Error creating folder:', error)
      addLog(`Error al crear carpeta: ${folderName}`, 'error')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('files', file)
    })
    formData.append('path', currentPath)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        const data = await response.json()
        addLog(`${data.count} archivo(s) subido(s)`, 'success')
        await loadFiles(currentPath)
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      addLog('Error al subir archivos', 'error')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRename = async (filename: string) => {
    const newName = prompt(`Nuevo nombre para ${filename}:`, filename)
    if (!newName || newName === filename) return

    const oldPath = currentPath === '/' ? `/${filename}` : `${currentPath}/${filename}`
    const newPath = currentPath === '/' ? `/${newName}` : `${currentPath}/${newName}`

    try {
      const response = await fetch('/api/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath })
      })
      if (response.ok) {
        addLog(`Renombrado: ${filename} → ${newName}`, 'success')
        await loadFiles(currentPath)
      } else {
        addLog(`Error al renombrar: ${filename}`, 'error')
      }
    } catch (error) {
      console.error('Error renaming:', error)
      addLog(`Error al renombrar: ${filename}`, 'error')
    }
  }

  const handleCopy = async (filename: string) => {
    const source = currentPath === '/' ? `/${filename}` : `${currentPath}/${filename}`
    const newName = filename.includes('.')
      ? filename.replace(/\.([^.]+)$/, ' (copia).$1')
      : `${filename} (copia)`
    const destination = currentPath === '/' ? `/${newName}` : `${currentPath}/${newName}`

    try {
      const response = await fetch('/api/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination })
      })
      if (response.ok) {
        addLog(`Copiado: ${filename}`, 'success')
        await loadFiles(currentPath)
      } else {
        addLog(`Error al copiar: ${filename}`, 'error')
      }
    } catch (error) {
      console.error('Error copying:', error)
      addLog(`Error al copiar: ${filename}`, 'error')
    }
  }

  const handleMove = (filename: string) => {
    setFileToMove(filename)
    setShowMoveModal(true)
  }

  const handleMoveConfirm = async (destinationPath: string) => {
    if (!fileToMove) return

    const source = currentPath === '/' ? `/${fileToMove}` : `${currentPath}/${fileToMove}`
    const destination = `${destinationPath}/${fileToMove}`

    try {
      const response = await fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination })
      })
      if (response.ok) {
        addLog(`Movido: ${fileToMove}`, 'success')
        await loadFiles(currentPath)
      } else {
        const error = await response.json()
        addLog(`Error al mover: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error moving:', error)
      addLog(`Error al mover: ${fileToMove}`, 'error')
    }

    setFileToMove(null)
  }

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const breadcrumbs = currentPath === '/' ? [] : currentPath.split('/').filter(Boolean)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>NAS Local</h1>
          <span className="user-badge">👤 {user.username}</span>
        </div>
        <div className="header-center">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="header-right">
          <button
            className="btn-icon"
            onClick={() => setShowPasswordModal(true)}
            title="Cambiar contraseña"
          >
            🔑
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <Sidebar
          currentPath={currentPath}
          files={files}
          onNavigate={setCurrentPath}
          breadcrumbs={breadcrumbs}
          onBack={handleBack}
        />

        <main className="dashboard-main">
          <div className="toolbar">
            <div className="toolbar-left">
              {currentPath !== '/' && (
                <button className="btn btn-secondary" onClick={handleBack}>
                  ← Atrás
                </button>
              )}
              <button className="btn btn-primary" onClick={() => loadFiles(currentPath)}>
                🔄 Actualizar
              </button>
            </div>
            <div className="toolbar-right">
              <button
                className="btn btn-accent"
                onClick={() => setShowCreateFolderModal(true)}
              >
                + Nueva Carpeta
              </button>
              <button
                className="btn btn-accent"
                onClick={handleUploadClick}
              >
                ⬆ Subir
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading">Cargando archivos...</div>
          ) : (
            <FileGrid
              files={filteredFiles}
              onFolderClick={handleFolderClick}
              currentPath={currentPath}
              onRefresh={() => loadFiles(currentPath)}
              onFileAction={(action, filename) => {
                addLog(`${action}: ${filename}`, 'info')
              }}
              onRename={handleRename}
              onCopy={handleCopy}
              onMove={handleMove}
            />
          )}

          <div className="sidebar-right">
            <SystemStats />
          </div>

          <LogViewer logs={logs} />
        </main>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordChange}
        />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal
          onClose={() => setShowCreateFolderModal(false)}
          onSuccess={handleCreateFolder}
        />
      )}

      {showMoveModal && (
        <MoveFolderModal
          onClose={() => {
            setShowMoveModal(false)
            setFileToMove(null)
          }}
          onMove={handleMoveConfirm}
        />
      )}
    </div>
  )
}
