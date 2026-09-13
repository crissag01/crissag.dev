import { useLanguage } from '../i18n/LanguageContext'
import './LanguageToggle.css'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="language-toggle" role="group" aria-label="Language selector">
      <button
        type="button"
        className={language === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <span className="language-toggle-divider">/</span>
      <button
        type="button"
        className={language === 'es' ? 'active' : ''}
        onClick={() => setLanguage('es')}
        aria-pressed={language === 'es'}
      >
        ES
      </button>
    </div>
  )
}
