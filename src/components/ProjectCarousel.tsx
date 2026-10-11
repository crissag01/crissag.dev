import { useState } from 'react';
import { ProjectModal } from './ProjectModal';
import type { Project } from '../data/projects';
import { useLanguage } from '../i18n/LanguageContext';
import './ProjectCarousel.css';

interface ProjectCarouselProps {
  projects: Project[];
  headingKey: string;
  introKey?: string;
  sectionId: string;
}

export function ProjectCarousel({ projects, headingKey, introKey, sectionId }: ProjectCarouselProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t, language } = useLanguage();

  return (
    <>
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <section id={sectionId} className="projects-section">
        <h2>{t(headingKey)}</h2>
        {introKey && <p className="projects-intro">{t(introKey)}</p>}
        <div className="carousel-container">
          {projects.map((project) => {
            const text = project.translations[language]
            return (
              <div
                key={project.id}
                className={`project-card ${hoveredId === project.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="project-image-wrapper">
                  <img src={project.image} alt={text.title} className="project-image" />
                  <div className="overlay"></div>
                </div>

                <div className="project-content">
                  <h3>{text.title}</h3>
                  <p className="short-description">{text.description}</p>
                  <p className="price-tag">{text.price}</p>

                  <div className={`expanded-content ${hoveredId === project.id ? 'show' : ''}`}>
                    <div className="expanded-content-inner">
                      <p className="problem"><strong>{t(project.tier === 'client' ? 'projects.modal.problemLabel' : 'projects.modal.exploresLabel')}:</strong> {text.problem}</p>
                      <p className="full-description">{text.fullDescription}</p>
                      <div className="technologies">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <button
                        className="project-link"
                        onClick={() => setSelectedProject(project)}
                      >
                        {t('projects.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  );
}
