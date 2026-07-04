import { DynamicBackground } from './components/DynamicBackground'
import { Hero } from './components/Hero'
import { AboutMe } from './components/AboutMe'
import { TestimonialCarousel } from './components/TestimonialCarousel'
import { ProjectCarousel } from './components/ProjectCarousel'
import { ContactForm } from './components/ContactForm'
import './App.css'

function App() {
  return (
    <>
      <DynamicBackground />

      <Hero />
      <AboutMe />
      <TestimonialCarousel />
      <ProjectCarousel />

      <section id="contact">
        <h2>Conectemos</h2>
        <ContactForm />
      </section>

      <footer>
        <p>&copy; 2026 Cristofer Aguilar. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
