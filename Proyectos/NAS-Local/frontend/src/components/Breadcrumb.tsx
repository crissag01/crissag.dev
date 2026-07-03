import './Breadcrumb.css'

interface Props {
  path: string
  onNavigate: (path: string) => void
}

export function Breadcrumb({ path, onNavigate }: Props) {
  const parts = path === '/' ? [] : path.split('/').filter(Boolean)

  return (
    <nav className="breadcrumb">
      <button 
        className={`breadcrumb-item ${path === '/' ? 'active' : ''}`}
        onClick={() => onNavigate('/')}
      >
        🏠 Inicio
      </button>

      {parts.map((part, index) => {
        const fullPath = '/' + parts.slice(0, index + 1).join('/')
        return (
          <div key={part} className="breadcrumb-separator">
            <span>/</span>
            <button 
              className="breadcrumb-item"
              onClick={() => onNavigate(fullPath)}
            >
              {part}
            </button>
          </div>
        )
      })}
    </nav>
  )
}
