import { DynamicBackground } from './components/DynamicBackground'
import { Hero } from './components/Hero'
import { AboutMe } from './components/AboutMe'
import { TestimonialCarousel } from './components/TestimonialCarousel'
import { ProjectCarousel } from './components/ProjectCarousel'
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
        <div className="social-links">
          <a href="https://github.com/crissag01/Projects.git" target="_blank" rel="noopener noreferrer" className="social-link">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/cristofer-aguilar-249694382/" target="_blank" rel="noopener noreferrer" className="social-link">
            LinkedIn
          </a>
          <a href="mailto:crissag@proton.me" className="social-link">
            Email
          </a>
        </div>
      </section>

      <footer>
        <p>&copy; 2026 Cristofer Aguilar. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
