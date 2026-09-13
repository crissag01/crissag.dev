import { DynamicBackground } from './components/DynamicBackground'
import { Hero } from './components/Hero'
import { AboutMe } from './components/AboutMe'
import { HowIWork } from './components/HowIWork'
import { TestimonialCarousel } from './components/TestimonialCarousel'
import { ProjectCarousel } from './components/ProjectCarousel'
import { ContactForm } from './components/ContactForm'
import { LanguageToggle } from './components/LanguageToggle'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { projects } from './data/projects'
import './App.css'

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
      <TestimonialCarousel />

      <section id="contact">
        <h2>{t('contactSection.heading')}</h2>
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
