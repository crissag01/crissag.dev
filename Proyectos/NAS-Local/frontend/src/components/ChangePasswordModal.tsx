import { useState } from 'react'
import './ChangePasswordModal.css'

interface Props {
  onClose: () => void
  onSuccess?: () => void
}

export function ChangePasswordModal({ onClose, onSuccess }: Props) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son requeridos')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres')
      return
    }

    setSuccess(true)
    setTimeout(() => {
      onSuccess?.()
      onClose()
    }, 1500)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar Contraseña</h2>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label>Contraseña Actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Tu contraseña actual"
            />
          </div>

          <div className="form-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
            />
          </div>

          <div className="form-group">
            <label>Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar nueva contraseña"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">✅ Contraseña actualizada</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Cambiar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
