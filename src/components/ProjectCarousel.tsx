import { useState } from 'react';
import { projects } from '../data/projects';
import { ProjectModal } from './ProjectModal';
import type { Project } from '../data/projects';
import './ProjectCarousel.css';

export function ProjectCarousel() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <section id="projects">
        <h2>Mis Proyectos</h2>
        <div className="carousel-container">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${hoveredId === project.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="project-image-wrapper">
                <img src={project.image} alt={project.title} className="project-image" />
                <div className="overlay"></div>
              </div>

              <div className="project-content">
                <h3>{project.title}</h3>
                <p className="short-description">{project.description}</p>
                <p className="price-tag">Desde {project.price}</p>

                <div className={`expanded-content ${hoveredId === project.id ? 'show' : ''}`}>
                  <p className="problem"><strong>Problema:</strong> {project.problem}</p>
                  <p className="full-description">{project.fullDescription}</p>
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
                    Ver Detalles →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
