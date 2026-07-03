import { useState, useEffect } from 'react'
import './MoveFolderModal.css'

interface File {
  name: string
  type: 'file' | 'folder'
}

interface Props {
  onClose: () => void
  onMove: (destinationPath: string) => void
}

export function MoveFolderModal({ onClose, onMove }: Props) {
  const [selectedFolder, setSelectedFolder] = useState<string>('/')
  const [folders, setFolders] = useState<Array<{path: string, name: string}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const response = await fetch('/api/files?path=/')
        const data = await response.json()
        const folderList = data.files
          .filter((f: File) => f.type === 'folder')
          .map((f: File) => ({
            path: `/${f.name}`,
            name: f.name
          }))
        setFolders(folderList)
      } catch (error) {
        console.error('Error loading folders:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFolders()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onMove(selectedFolder)
    onClose()
  }

  const folderOptions = [
    { path: '/', name: 'Raíz' },
    ...folders
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Mover a...</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Selecciona carpeta destino</label>
            {loading ? (
              <div className="loading-text">Cargando carpetas...</div>
            ) : (
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="folder-select"
                autoFocus
              >
                {folderOptions.map(option => (
                  <option key={option.path} value={option.path}>
                    {option.name === 'Raíz' ? '/' : option.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Mover
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
