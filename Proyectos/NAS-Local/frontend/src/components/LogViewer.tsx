import { useEffect, useRef } from 'react'
import './LogViewer.css'

interface Log {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  user?: string
}

interface Props {
  logs: Log[]
}

export function LogViewer({ logs }: Props) {
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const getIconByType = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      default: return 'ℹ️'
    }
  }

  return (
    <div className="log-viewer">
      <div className="log-header">
        <h3>📋 Logs</h3>
        <span className="log-count">{logs.length} eventos</span>
      </div>
      
      <div className="log-content">
        {logs.length === 0 ? (
          <div className="log-empty">Sin eventos</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`log-entry log-${log.type}`}>
              <span className="log-icon">{getIconByType(log.type)}</span>
              <div className="log-details">
                <span className="log-time">{log.timestamp}</span>
                <span className="log-message">{log.message}</span>
                {log.user && <span className="log-user">por {log.user}</span>}
              </div>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}
