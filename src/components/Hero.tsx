import { useLanguage } from '../i18n/LanguageContext'
import './Hero.css'

const FREELANCER_PROFILE_URL = 'https://www.freelancer.mx/u/crisAgdev?frm=crisAgdev&sb=t'

export function Hero() {
  const { t } = useLanguage()
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
    { name: 'HTML5', icon: '/stack/html5.svg' },
    { name: 'Docker', icon: '/stack/docker.svg' },
    { name: 'Linux', icon: '/stack/linux.svg' },
    { name: 'Git', icon: '/stack/git.svg' },
    { name: 'APIs', icon: '/stack/api.svg' },
    { name: 'n8n', icon: '/stack/n8n.svg' },
    { name: 'WhatsApp/Telegram Bots', icon: '/stack/bots.svg' },
    { name: 'AI Agents', icon: '/stack/ai-agents.svg' },
    { name: 'Claude', icon: '/stack/claude.svg' },
    { name: 'OpenAI', icon: '/stack/openai.svg' },
    { name: 'PostgreSQL/MySQL', icon: '/stack/database.svg' },
    { name: 'Google Sheets', icon: '/stack/google-sheets.svg' },
    { name: 'WordPress', icon: '/stack/wordpress.svg' },
    { name: 'cPanel', icon: '/stack/cpanel.svg' },
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
                <img src="/profile-photo.webp" alt="Cristofer Aguilar" width={180} height={180} loading="eager" />
              </div>

              {/* Información Principal */}
              <div className="profile-info">
              <div className="profile-header">
                <h1 className="profile-name">Cristofer Aguilar</h1>
                <span className="verified-badge">✓</span>
              </div>

              <p className="profile-title">{t('hero.title')}</p>

              <div className="profile-location">
                {t('hero.location')}
              </div>

              <div className="profile-description">
                {t('hero.description')}
              </div>

              <div className="technologies-badges">
                {technologies.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="profile-stats">
                <a href="#client-projects" className="stat-item">
                  <span className="stat-number">2</span>
                  <span className="stat-label">{t('hero.statClientProjects')}</span>
                </a>
                <a href="#contact" className="stat-item">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">{t('hero.statAvailable')}</span>
                </a>
              </div>

              <div className="profile-actions">
                <a href="#contact" className="btn-primary">{t('hero.contactCta')}</a>
                <a href="#client-projects" className="btn-secondary">{t('hero.projectsCta')}</a>
                <a href={FREELANCER_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">{t('hero.freelancerCta')}</a>
              </div>
            </div>
            </div>
          </div>

          {/* Stack de Tecnologías */}
          <div className="stack-section">
            <h3>{t('hero.stackHeading')}</h3>
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
