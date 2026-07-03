import { useState } from 'react'
import './CreateFolderModal.css'

interface Props {
  onClose: () => void
  onSuccess: (folderName: string) => void
}

export function CreateFolderModal({ onClose, onSuccess }: Props) {
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!folderName.trim()) {
      setError('El nombre de la carpeta es requerido')
      return
    }

    if (folderName.includes('/') || folderName.includes('\\')) {
      setError('El nombre no puede contener barras')
      return
    }

    onSuccess(folderName)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nueva Carpeta</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nombre de la carpeta</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Mi carpeta"
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
