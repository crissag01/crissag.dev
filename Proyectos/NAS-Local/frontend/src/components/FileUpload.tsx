import { useState, useRef } from 'react'
import './FileUpload.css'

interface Props {
  currentPath: string
  onUploadComplete: () => void
}

export function FileUpload({ currentPath, onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    const formData = new FormData()
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }
    formData.append('path', currentPath)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        console.log('Upload exitoso')
        onUploadComplete()
      } else {
        alert('Error en la subida')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Error en la subida')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleUpload(e.dataTransfer.files)
  }

  return (
    <div className="file-upload">
      <div 
        className={`upload-area ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          style={{ display: 'none' }}
        />

        <div className="upload-content">
          <p className="upload-icon">📁</p>
          <p className="upload-text">
            Arrastra archivos aquí o{' '}
            <button 
              className="upload-link"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              haz clic para seleccionar
            </button>
          </p>
          {uploading && <p className="uploading">Subiendo...</p>}
        </div>
      </div>
    </div>
  )
}
