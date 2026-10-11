import { useEffect, useRef, type RefObject } from 'react'

interface TurnstileGlobal {
  ready?: (callback: () => void) => void
  render?: (container: string, options: Record<string, unknown>) => string
  remove?: (widgetId: string) => void
  reset?: (widgetId: string) => void
  getResponse?: (widgetId: string) => string
}

declare global {
  interface Window {
    turnstile?: TurnstileGlobal
  }
}

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

// Shared across every widget on the page — Cloudflare's script only needs
// to load once; each widget just calls turnstile.render() into its own
// container afterward.
let scriptLoadPromise: Promise<void> | null = null

function loadTurnstileScript(): Promise<void> {
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = TURNSTILE_SCRIPT_SRC
      // A <script> created via createElement is async=true by default,
      // even without the attribute in markup. Turnstile requires it to be
      // false before calling turnstile.ready() manually, or it throws.
      script.async = false
      script.defer = false
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Turnstile script'))
      document.head.appendChild(script)
    })
  }
  return scriptLoadPromise
}

/**
 * Renders a Turnstile widget into `#{containerId}` once `triggerRef`'s
 * element scrolls near the viewport, deferring the Cloudflare script load
 * (and its third-party storage prompt) until the form is actually needed.
 */
export function useTurnstile(containerId: string, triggerRef: RefObject<HTMLElement | null>) {
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const renderWidget = async () => {
      try {
        await loadTurnstileScript()
      } catch {
        return
      }
      if (cancelled) return

      const turnstile = window.turnstile
      if (!turnstile?.ready) return

      turnstile.ready(() => {
        if (cancelled) return
        const siteKey = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITEKEY
        if (siteKey && document.getElementById(containerId)) {
          // render() takes a CSS selector, not a bare id.
          widgetIdRef.current = turnstile.render?.(`#${containerId}`, {
            sitekey: siteKey,
            theme: 'dark',
            size: 'normal'
          }) || null
        }
      })
    }

    const el = triggerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          renderWidget()
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)

    return () => {
      cancelled = true
      observer.disconnect()
      const turnstile = window.turnstile
      if (widgetIdRef.current && turnstile?.remove) {
        turnstile.remove(widgetIdRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- containerId/triggerRef are stable for the component's lifetime
  }, [])

  const getToken = (): string | undefined => {
    const turnstile = window.turnstile
    return widgetIdRef.current ? turnstile?.getResponse?.(widgetIdRef.current) : undefined
  }

  const reset = () => {
    const turnstile = window.turnstile
    if (widgetIdRef.current && turnstile?.reset) {
      turnstile.reset(widgetIdRef.current)
    }
  }

  return { getToken, reset }
}
