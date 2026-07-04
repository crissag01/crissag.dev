import { useEffect } from 'react'
import './Toast.css'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  autoCloseDuration?: number
}

export function Toast({ message, type, onClose, autoCloseDuration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, autoCloseDuration)
    return () => clearTimeout(timer)
  }, [onClose, autoCloseDuration])

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="polite">
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' ? '✓' : '✕'}
        </span>
        <p className="toast-message">{message}</p>
      </div>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  )
}
