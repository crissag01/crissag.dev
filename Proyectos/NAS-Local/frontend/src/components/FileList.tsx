import './FileList.css'

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
}

export function FileList({ files, onFolderClick, currentPath, onRefresh }: Props) {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '-'
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return size.toFixed(2) + ' ' + units[unitIndex]
  }

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
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  if (files.length === 0) {
    return <div className="empty-state">📭 Carpeta vacía</div>
  }

  return (
    <div className="file-list">
      <div className="file-list-header">
        <div className="col-name">Nombre</div>
        <div className="col-type">Tipo</div>
        <div className="col-size">Tamaño</div>
        <div className="col-modified">Modificado</div>
        <div className="col-actions">Acciones</div>
      </div>

      <div className="file-list-items">
        {files.map((file) => (
          <div key={file.name} className={`file-item ${file.type}`}>
            <div className="col-name">
              {file.type === 'folder' ? (
                <button 
                  className="folder-link"
                  onClick={() => onFolderClick(file.name)}
                >
                  📁 {file.name}
                </button>
              ) : (
                <span className="file-name">📄 {file.name}</span>
              )}
            </div>
            <div className="col-type">{file.type === 'folder' ? 'Carpeta' : 'Archivo'}</div>
            <div className="col-size">{formatSize(file.size)}</div>
            <div className="col-modified">{file.modified || '-'}</div>
            <div className="col-actions">
              {file.type === 'file' && (
                <>
                  <button 
                    className="action-btn download"
                    onClick={() => handleDownload(file.name)}
                    title="Descargar"
                  >
                    ⬇
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(file.name)}
                    title="Eliminar"
                  >
                    🗑
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
