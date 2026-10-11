import { useState, useRef, useEffect } from 'react'
import { Toast } from './Toast'
import { useLanguage } from '../i18n/LanguageContext'
import './ContactForm.css'

interface FormErrors {
  name?: string
  email?: string
  message?: string
  form?: string
}

interface Turnstile {
  ready?: (callback: () => void) => void
  render?: (containerId: string, options: Record<string, unknown>) => string
  remove?: (widgetId: string) => void
  reset?: (widgetId: string) => void
  getResponse?: (widgetId: string) => string
}

export function ContactForm() {
  const { t } = useLanguage()
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
  const formRef = useRef<HTMLFormElement>(null)
  const MAX_MESSAGE_LENGTH = 5000

  useEffect(() => {
    let script: HTMLScriptElement | null = null

    const loadTurnstile = () => {
      if (script) return

      script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      // Un <script> creado con createElement es async=true por defecto
      // (aunque no se ponga el atributo async en el markup). Turnstile
      // exige que sea false antes de usar turnstile.ready() manualmente,
      // o lanza un TurnstileError.
      script.async = false
      script.defer = false
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
    }

    // Carga Turnstile solo cuando el usuario se acerca al formulario, no al abrir la página.
    // Evita que el navegador pida permiso de almacenamiento de terceros de inmediato.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadTurnstile()
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    if (formRef.current) {
      observer.observe(formRef.current)
    }

    return () => {
      observer.disconnect()
      const turnstile = window.turnstile as Turnstile
      if (turnstileWidgetId.current && turnstile?.remove) {
        turnstile.remove(turnstileWidgetId.current)
      }
      if (script?.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return t('contactForm.errors.nameRequired')
        if (value.length < 2) return t('contactForm.errors.nameMin')
        if (value.length > 100) return t('contactForm.errors.nameMax')
        return undefined

      case 'email': {
        if (!value.trim()) return t('contactForm.errors.emailRequired')
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return t('contactForm.errors.emailInvalid')
        return undefined
      }

      case 'message':
        if (!value.trim()) return t('contactForm.errors.messageRequired')
        if (value.length < 10) return t('contactForm.errors.messageMin')
        if (value.length > MAX_MESSAGE_LENGTH) return t('contactForm.errors.messageMax').replace('{max}', String(MAX_MESSAGE_LENGTH))
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
    const token = turnstileWidgetId.current
      ? turnstile?.getResponse?.(turnstileWidgetId.current)
      : undefined

    if (!token) {
      setErrors({
        form: t('contactForm.verificationError')
      })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/contact', {
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
          message: t('contactForm.successToast'),
          type: 'success'
        })
        setFormData({ name: '', email: '', message: '' })
        if (turnstileWidgetId.current && turnstile?.reset) {
          turnstile.reset(turnstileWidgetId.current)
        }
      } else {
        setToast({
          message: data.error || t('contactForm.genericError'),
          type: 'error'
        })
      }
    } catch {
      setToast({
        message: t('contactForm.connectionError'),
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">
            {t('contactForm.nameLabel')}
            <span className="required-indicator" aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('contactForm.namePlaceholder')}
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
            {t('contactForm.emailLabel')}
            <span className="required-indicator" aria-label="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('contactForm.emailPlaceholder')}
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
            {t('contactForm.messageLabel')}
            <span className="required-indicator" aria-label="required">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t('contactForm.messagePlaceholder')}
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
              {t('contactForm.submitLoading')}
            </>
          ) : (
            t('contactForm.submitIdle')
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

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}
