import { useState, useRef } from 'react'
import { projects } from '../data/projects'
import { Toast } from './Toast'
import { useLanguage } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'
import { useTurnstile } from '../hooks/useTurnstile'
import './CommentForm.css'

interface CommentFormProps {
  onCommentAdded?: () => void
}

export function CommentForm({ onCommentAdded }: CommentFormProps) {
  const { t, language } = useLanguage()
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
  const formRef = useRef<HTMLFormElement>(null)

  const { getToken, reset: resetTurnstile } = useTurnstile('comment-turnstile-widget', formRef)

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

    if (!formData.name.trim()) newErrors.name = t('commentForm.errors.nameRequired')
    else if (formData.name.length < 2) newErrors.name = t('commentForm.errors.nameMin')

    if (!formData.email.trim()) newErrors.email = t('commentForm.errors.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('commentForm.errors.emailInvalid')

    if (!formData.projectId) newErrors.projectId = t('commentForm.errors.projectRequired')

    if (!formData.comment.trim()) newErrors.comment = t('commentForm.errors.commentRequired')
    else if (formData.comment.length < 10) newErrors.comment = t('commentForm.errors.commentMin')
    else if (formData.comment.length > 1000) newErrors.comment = t('commentForm.errors.commentMax')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const token = getToken()
    if (!token) {
      setErrors(prev => ({ ...prev, form: t('commentForm.verificationError') }))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          projectId: formData.projectId,
          comment: formData.comment.trim(),
          rating: formData.rating,
          turnstileToken: token
        })
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          message: t('commentForm.successToast'),
          type: 'success'
        })
        setFormData({
          name: '',
          email: '',
          projectId: '',
          comment: '',
          rating: 5
        })
        resetTurnstile()
        onCommentAdded?.()
      } else {
        setToast({
          message: data.error || t('commentForm.errorGeneric'),
          type: 'error'
        })
      }
    } catch {
      setToast({
        message: t('commentForm.errorConnection'),
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form ref={formRef} className="comment-form" onSubmit={handleSubmit} noValidate>
        <h3>{t('commentForm.heading')}</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              {t('commentForm.nameLabel')}
              <span className="required-indicator">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('commentForm.namePlaceholder')}
              aria-invalid={!!errors.name}
              disabled={isLoading}
              maxLength={100}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              {t('commentForm.emailLabel')}
              <span className="required-indicator">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('commentForm.emailPlaceholder')}
              aria-invalid={!!errors.email}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="projectId">
            {t('commentForm.projectLabel')}
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
            <option value="">{t('commentForm.projectPlaceholder')}</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.translations[language].title}
              </option>
            ))}
          </select>
          {errors.projectId && <span className="error-message">{errors.projectId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rating">
            {t('commentForm.ratingLabel')}
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
              {translations.commentForm.ratingOptions[language].map((label, index) => {
                const value = 5 - index
                return (
                  <option key={value} value={value}>
                    {'⭐'.repeat(value)} {label}
                  </option>
                )
              })}
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
            {t('commentForm.commentLabel')}
            <span className="required-indicator">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder={t('commentForm.commentPlaceholder')}
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

        <div id="comment-turnstile-widget" className="turnstile-container"></div>

        {errors.form && <span className="error-message">{errors.form}</span>}

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              {t('commentForm.submitLoading')}
            </>
          ) : (
            t('commentForm.submitIdle')
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
