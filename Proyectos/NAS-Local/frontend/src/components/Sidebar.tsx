import './Sidebar.css'

interface File {
  name: string
  type: 'file' | 'folder'
  size?: number
}

interface Props {
  currentPath: string
  files: File[]
  onNavigate: (path: string) => void
  breadcrumbs: string[]
  onBack: () => void
}

export function Sidebar({ currentPath, files, onNavigate, breadcrumbs, onBack }: Props) {
  const defaultFolders = ['Documentos', 'Imágenes', 'Música', 'Programas', 'Videos']

  const handleFolderClick = (folder: string) => {
    if (currentPath === '/') {
      onNavigate(`/${folder}`)
    } else {
      onNavigate(`${currentPath}/${folder}`)
    }
  }

  const fileList = files.filter(f => f.type === 'file')

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Navegación</h3>
        <button
          className={`nav-item ${currentPath === '/' ? 'active' : ''}`}
          onClick={() => onNavigate('/')}
        >
          🏠 Inicio
        </button>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Carpetas</h3>
        <div className="folder-list">
          {defaultFolders.map(folder => (
            <button
              key={folder}
              className="folder-item"
              onClick={() => handleFolderClick(folder)}
            >
              📁 {folder}
            </button>
          ))}
        </div>
      </div>

      {fileList.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">Files ({fileList.length})</h3>
          <div className="file-list">
            {fileList.map(file => (
              <div key={file.name} className="file-item">
                <span className="file-icon">📄</span>
                <span className="file-name" title={file.name}>
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-footer">
        <p className="path-info">Ruta: {currentPath}</p>
      </div>
    </aside>
  )
}
