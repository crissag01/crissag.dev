import { useState } from 'react'
import { projects } from '../data/projects'
import { Toast } from './Toast'
import './CommentForm.css'

interface CommentFormProps {
  onCommentAdded?: () => void
}

export function CommentForm({ onCommentAdded }: CommentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectId: '',
    comment: '',
    rating: 5
  })
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    else if (formData.name.length < 2) newErrors.name = 'Mínimo 2 caracteres'

    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'

    if (!formData.projectId) newErrors.projectId = 'Selecciona un proyecto'

    if (!formData.comment.trim()) newErrors.comment = 'El comentario es requerido'
    else if (formData.comment.length < 10) newErrors.comment = 'Mínimo 10 caracteres'
    else if (formData.comment.length > 1000) newErrors.comment = 'Máximo 1000 caracteres'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          projectId: formData.projectId,
          comment: formData.comment.trim(),
          rating: formData.rating
        })
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          message: '✓ Gracias por tu comentario. Será visible pronto.',
          type: 'success'
        })
        setFormData({
          name: '',
          email: '',
          projectId: '',
          comment: '',
          rating: 5
        })
        onCommentAdded?.()
      } else {
        setToast({
          message: data.error || 'Error al enviar el comentario',
          type: 'error'
        })
      }
    } catch (error) {
      setToast({
        message: 'Error de conexión. Intenta de nuevo.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form className="comment-form" onSubmit={handleSubmit} noValidate>
        <h3>Deja tu comentario</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              Nombre
              <span className="required-indicator">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              aria-invalid={!!errors.name}
              disabled={isLoading}
              maxLength={100}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
              <span className="required-indicator">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              aria-invalid={!!errors.email}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="projectId">
            Sobre qué proyecto opinas
            <span className="required-indicator">*</span>
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            aria-invalid={!!errors.projectId}
            disabled={isLoading}
          >
            <option value="">-- Selecciona un proyecto --</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          {errors.projectId && <span className="error-message">{errors.projectId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rating">
            Calificación
            <span className="required-indicator">*</span>
          </label>
          <div className="rating-input">
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excelente (5)</option>
              <option value={4}>⭐⭐⭐⭐ Muy Bueno (4)</option>
              <option value={3}>⭐⭐⭐ Bueno (3)</option>
              <option value={2}>⭐⭐ Regular (2)</option>
              <option value={1}>⭐ Pobre (1)</option>
            </select>
            <div className="star-display">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < formData.rating ? 'filled' : 'empty'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">
            Comentario
            <span className="required-indicator">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Comparte tu experiencia..."
            rows={4}
            aria-invalid={!!errors.comment}
            disabled={isLoading}
            maxLength={1000}
          />
          <div className="character-count">
            {formData.comment.length} / 1000
          </div>
          {errors.comment && <span className="error-message">{errors.comment}</span>}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Enviando...
            </>
          ) : (
            'Enviar Comentario'
          )}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
