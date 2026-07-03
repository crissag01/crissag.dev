import './FileGrid.css'

interface File {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

interface Props {
  files: File[]
  onFolderClick: (name: string) => void
  currentPath: string
  onRefresh: () => void
  onFileAction?: (action: string, filename: string) => void
  onRename?: (filename: string, newName: string) => void
  onCopy?: (filename: string) => void
  onMove?: (filename: string) => void
}

export function FileGrid({ files, onFolderClick, currentPath, onRefresh, onFileAction, onRename, onCopy, onMove }: Props) {
  const handleDownload = async (filename: string) => {
    const path = currentPath === '/' ? `/${filename}` : `${currentPath}/${filename}`
    const response = await fetch(`/api/download?path=${encodeURIComponent(path)}`)
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
      onFileAction?.('Descargado', filename)
    }
  }

  const handleDelete = async (filename: string) => {
    if (!confirm(`¿Eliminar ${filename}?`)) return

    const path = currentPath === '/' ? `/${filename}` : `${currentPath}/${filename}`
    try {
      const response = await fetch(`/api/delete?path=${encodeURIComponent(path)}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        onFileAction?.('Eliminado', filename)
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting:', error)
      onFileAction?.('Error al eliminar', filename)
    }
  }

  if (files.length === 0) {
    return <div className="empty-state">📭 Carpeta vacía</div>
  }

  return (
    <div className="file-grid">
      {files.map((file) => (
        <div
          key={file.name}
          className={`file-card ${file.type}`}
          onDoubleClick={() => file.type === 'folder' && onFolderClick(file.name)}
        >
          <div className="file-icon">
            {file.type === 'folder' ? '📁' : '📄'}
          </div>

          <div className="file-info">
            <h3 className="file-name">{file.name}</h3>
            <p className="file-type">
              {file.type === 'folder' ? 'Carpeta' : 'Archivo'}
            </p>
          </div>

          {file.type === 'file' && (
            <div className="file-actions">
              <button
                className="action-btn download"
                onClick={() => handleDownload(file.name)}
                title="Descargar"
              >
                ⬇
              </button>
              <button
                className="action-btn copy"
                onClick={() => onCopy?.(file.name)}
                title="Copiar"
              >
                📋
              </button>
              <button
                className="action-btn rename"
                onClick={() => onRename?.(file.name, file.name)}
                title="Cambiar nombre"
              >
                ✎
              </button>
              <button
                className="action-btn move"
                onClick={() => onMove?.(file.name)}
                title="Mover"
              >
                ➜
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleDelete(file.name)}
                title="Eliminar"
              >
                🗑
              </button>
            </div>
          )}

          {file.type === 'folder' && (
            <div className="file-actions">
              <button
                className="folder-btn"
                onClick={() => onFolderClick(file.name)}
              >
                Abrir →
              </button>
              <button
                className="action-btn copy"
                onClick={() => onCopy?.(file.name)}
                title="Copiar"
              >
                📋
              </button>
              <button
                className="action-btn rename"
                onClick={() => onRename?.(file.name, file.name)}
                title="Cambiar nombre"
              >
                ✎
              </button>
              <button
                className="action-btn move"
                onClick={() => onMove?.(file.name)}
                title="Mover"
              >
                ➜
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleDelete(file.name)}
                title="Eliminar"
              >
                🗑
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
