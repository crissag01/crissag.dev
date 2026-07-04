import { useState, useRef, useEffect } from 'react'
import { Toast } from './Toast'
import './ContactForm.css'

interface FormErrors {
  name?: string
  email?: string
  message?: string
  form?: string
}

interface Turnstile {
  ready?: (callback: () => void) => void
  render?: (containerId: string, options: any) => string
  remove?: (widgetId: string) => void
  reset?: (widgetId: string) => void
  getResponse?: (widgetId: string) => string
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const MAX_MESSAGE_LENGTH = 5000

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      const turnstile = window.turnstile as Turnstile
      if (turnstile?.ready) {
        turnstile.ready(() => {
          const siteKey = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITEKEY
          if (siteKey && document.getElementById('turnstile-widget')) {
            turnstileWidgetId.current = turnstile.render?.('turnstile-widget', {
              sitekey: siteKey,
              theme: 'dark',
              size: 'normal'
            }) || null
          }
        })
      }
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido'
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
        if (value.length > 100) return 'El nombre no puede exceder 100 caracteres'
        return undefined

      case 'email':
        if (!value.trim()) return 'El email es requerido'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Email inválido'
        return undefined

      case 'message':
        if (!value.trim()) return 'El mensaje es requerido'
        if (value.length < 10) return 'El mensaje debe tener al menos 10 caracteres'
        if (value.length > MAX_MESSAGE_LENGTH) return `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres`
        return undefined

      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name as keyof FormErrors]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (honeypot) {
      console.log('Honeypot triggered')
      return
    }

    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
        isValid = false
      }
    })

    if (!isValid) {
      setErrors(newErrors)
      return
    }

    const turnstile = window.turnstile as Turnstile
    const token = turnstile?.getResponse?.(turnstileWidgetId.current || '')

    if (!token) {
      setErrors({
        form: 'Por favor completa la verificación de seguridad'
      })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          turnstileToken: token
        })
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          message: '✓ Mensaje enviado correctamente. Te contactaremos pronto.',
          type: 'success'
        })
        setFormData({ name: '', email: '', message: '' })
        if (turnstile?.reset) {
          turnstile.reset(turnstileWidgetId.current || '')
        }
      } else {
        setToast({
          message: data.error || 'Error al enviar el mensaje. Intenta de nuevo.',
          type: 'error'
        })
      }
    } catch (error) {
      setToast({
        message: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">
            Nombre
            <span className="required-indicator" aria-label="requerido">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            maxLength={100}
            disabled={isLoading}
          />
          {errors.name && (
            <span id="name-error" className="error-message" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email
            <span className="required-indicator" aria-label="requerido">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isLoading}
          />
          {errors.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Mensaje
            <span className="required-indicator" aria-label="requerido">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tu mensaje aquí..."
            rows={5}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={`${errors.message ? 'message-error ' : ''}message-count`}
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={isLoading}
          />
          <div className="character-count" id="message-count">
            {formData.message.length} / {MAX_MESSAGE_LENGTH}
          </div>
          {errors.message && (
            <span id="message-error" className="error-message" role="alert">
              {errors.message}
            </span>
          )}
        </div>

        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div id="turnstile-widget" className="turnstile-container"></div>

        {errors.form && (
          <span className="error-message form-error" role="alert">
            {errors.form}
          </span>
        )}

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
            'Enviar Mensaje'
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

      <script>
        {`declare global { interface Window { turnstile?: any } }`}
      </script>
    </>
  )
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}
