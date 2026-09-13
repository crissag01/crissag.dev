import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Language } from './translations'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string) => string
  tList: (path: string) => string[]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'crissag-dev-language'

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'es' ? 'es' : 'en'
  } catch {
    return 'en'
  }
}

function resolvePath(path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => {
    if (node && typeof node === 'object' && key in node) {
      return (node as Record<string, unknown>)[key]
    }
    return undefined
  }, translations)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // ignore storage failures (private browsing, quota, etc.)
    }
  }, [language])

  const setLanguage = (lang: Language) => setLanguageState(lang)

  const t = (path: string): string => {
    const node = resolvePath(path)
    if (node && typeof node === 'object' && (language in node)) {
      const value = (node as Record<Language, unknown>)[language]
      if (typeof value === 'string') return value
    }
    return path
  }

  const tList = (path: string): string[] => {
    const node = resolvePath(path)
    if (node && typeof node === 'object' && (language in node)) {
      const value = (node as Record<Language, unknown>)[language]
      if (Array.isArray(value)) return value as string[]
    }
    return []
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tList }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
