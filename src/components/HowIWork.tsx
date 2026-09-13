import { translations } from '../i18n/translations'
import { useLanguage } from '../i18n/LanguageContext'
import './HowIWork.css'

export function HowIWork() {
  const { t, language } = useLanguage()

  return (
    <section id="how-i-work">
      <h2>{t('howItWork.heading')}</h2>
      <p className="how-it-work-intro">{t('howItWork.intro')}</p>

      <div className="how-it-work-steps">
        {translations.howItWork.steps.map((step) => (
          <div key={step.title.en} className="how-it-work-step">
            <h3>{step.title[language]}</h3>
            <p>{step.description[language]}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
