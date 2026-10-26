import { DynamicBackground } from './components/DynamicBackground'
import { Hero } from './components/Hero'
import { AboutMe } from './components/AboutMe'
import { HowIWork } from './components/HowIWork'
import { ProjectCarousel } from './components/ProjectCarousel'
import { ContactForm } from './components/ContactForm'
import { LanguageToggle } from './components/LanguageToggle'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { projects } from './data/projects'
import './App.css'

const WHATSAPP_URL = 'https://wa.me/528132653893'

const clientProjects = projects.filter(p => p.tier === 'client')
const practiceProjects = projects.filter(p => p.tier === 'practice')

function AppContent() {
  const { t } = useLanguage()

  return (
    <>
      <LanguageToggle />
      <DynamicBackground />

      <Hero />
      <AboutMe />
      <HowIWork />
      <ProjectCarousel
        projects={clientProjects}
        headingKey="projects.clientHeading"
        introKey="projects.clientIntro"
        sectionId="client-projects"
      />
      <ProjectCarousel
        projects={practiceProjects}
        headingKey="projects.practiceHeading"
        introKey="projects.practiceIntro"
        sectionId="practice-projects"
      />
      <section id="cta-band">
        <h2>{t('ctaBand.heading')}</h2>
        <p>{t('ctaBand.text')}</p>
        <a href="#contact" className="btn-primary">{t('ctaBand.button')}</a>{' '}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">{t('ctaBand.whatsapp')}</a>
      </section>

      <section id="contact">
        <h2>{t('contactSection.heading')}</h2>
        <p className="contact-alt">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{t('contactSection.whatsapp')}</a>
        </p>
        <ContactForm />
      </section>

      <footer>
        <p>&copy; 2026 Cristofer Aguilar. {t('footer.rights')}</p>
      </footer>
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
