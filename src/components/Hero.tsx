import './Hero.css'

export function Hero() {
  const technologies = [
    'Python',
    'n8n',
    'APIs',
    'JavaScript',
    'React',
    'Node.js',
    'TypeScript',
    'Claude AI',
    'Automation'
  ]

  const stack = [
    { name: 'Python', icon: '/stack/python.svg' },
    { name: 'JavaScript', icon: '/stack/javascript.svg' },
    { name: 'React', icon: '/stack/react.svg' },
    { name: 'Node.js', icon: '/stack/nodejs.svg' },
    { name: 'TypeScript', icon: '/stack/typescript.svg' },
    { name: 'Docker', icon: '/stack/docker.svg' },
    { name: 'n8n', icon: '/stack/n8n.svg' },
    { name: 'Claude', icon: '/stack/claude.svg' },
    { name: 'OpenAI', icon: '/stack/openai.svg' },
  ]

  return (
    <>
      <section id="hero-spacer"></section>
      <div className="hero-banner">
        <div className="banner-background">
          <div className="banner-gradient"></div>
        </div>

        <div className="banner-content">
          <div className="profile-card">
            {/* Banner de Portada */}
            <div className="profile-banner">
              <img src="/Banner-photo.jpg" alt="Banner Cristofer Aguilar" />
            </div>

            {/* Contenedor Foto + Info */}
            <div className="profile-content">
              {/* Foto de Perfil */}
              <div className="profile-photo">
                <img src="/profile'photo.png" alt="Cristofer Aguilar" />
              </div>

              {/* Información Principal */}
              <div className="profile-info">
              <div className="profile-header">
                <h1 className="profile-name">Cristofer Aguilar</h1>
                <span className="verified-badge">✓</span>
              </div>

              <p className="profile-title">Automation Developer | Business Process Automation | Python, n8n, APIs, JavaScript</p>

              <div className="profile-location">
                📍 Monterrey, Nuevo León, Mexico
              </div>

              <div className="profile-description">
                Especializado en automatización de procesos, integraciones API y desarrollo de soluciones personalizadas. Ayudo a empresas a optimizar sus operaciones con tecnología.
              </div>

              <div className="technologies-badges">
                {technologies.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="profile-stats">
                <a href="#projects" className="stat-item">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Proyectos</span>
                </a>
                <a href="#testimonials" className="stat-item">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Clientes</span>
                </a>
                <a href="#contact" className="stat-item">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">Disponible</span>
                </a>
              </div>

              <div className="profile-actions">
                <a href="#contact" className="btn-primary">Contactar</a>
                <a href="#projects" className="btn-secondary">Ver Proyectos</a>
              </div>
            </div>
            </div>
          </div>

          {/* Stack de Tecnologías */}
          <div className="stack-section">
            <h3>Mi Stack</h3>
            <div className="stack-grid">
              {stack.map((tech) => (
                <div key={tech.name} className="stack-icon" title={tech.name}>
                  <img src={tech.icon} alt={tech.name} />
                  <span className="stack-label">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
