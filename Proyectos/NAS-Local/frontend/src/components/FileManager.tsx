import { useState } from 'react'
import { FileUpload } from './FileUpload'
import { FileList } from './FileList'
import { Breadcrumb } from './Breadcrumb'
import './FileManager.css'

interface File {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

interface Props {
  files: File[]
  currentPath: string
  loading: boolean
  onNavigate: (path: string) => void
  onRefresh: () => void
}

export function FileManager({ files, currentPath, loading, onNavigate, onRefresh }: Props) {
  const [showUpload, setShowUpload] = useState(false)

  const handleFolderClick = (folderName: string) => {
    const newPath = currentPath === '/' 
      ? `/${folderName}`
      : `${currentPath}/${folderName}`
    onNavigate(newPath)
  }

  const handleBack = () => {
    const pathParts = currentPath.split('/').filter(Boolean)
    pathParts.pop()
    const newPath = pathParts.length ? '/' + pathParts.join('/') : '/'
    onNavigate(newPath)
  }

  return (
    <div className="file-manager">
      <div className="file-manager-toolbar">
        <div className="toolbar-left">
          {currentPath !== '/' && (
            <button className="btn btn-secondary" onClick={handleBack}>
              ← Atrás
            </button>
          )}
          <button className="btn btn-primary" onClick={onRefresh} disabled={loading}>
            {loading ? 'Cargando...' : '🔄 Actualizar'}
          </button>
        </div>

        <button className="btn btn-accent" onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? '✕ Cancelar' : '⬆ Subir Archivo'}
        </button>
      </div>

      <Breadcrumb path={currentPath} onNavigate={onNavigate} />

      {showUpload && (
        <FileUpload 
          currentPath={currentPath}
          onUploadComplete={() => {
            setShowUpload(false)
            onRefresh()
          }}
        />
      )}

      {loading ? (
        <div className="loading">Cargando archivos...</div>
      ) : (
        <FileList 
          files={files}
          onFolderClick={handleFolderClick}
          currentPath={currentPath}
          onRefresh={onRefresh}
        />
      )}
    </div>
  )
}
