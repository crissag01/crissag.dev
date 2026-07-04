import type { Project } from '../data/projects';
import './ProjectModal.css';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <img src={project.image} alt={project.title} className="modal-image" />

        <div className="modal-body">
          <div className="modal-header-content">
            <h2>{project.title}</h2>
            <div className="modal-price">Desde {project.price}</div>
          </div>

          <div className="modal-problem">
            <h3>🎯 Problema que Resuelve</h3>
            <p>{project.problem}</p>
          </div>

          <p className="modal-description">{project.fullDescription}</p>

          <div className="modal-use-cases">
            <h3>💼 Casos de Uso</h3>
            <ul>
              {project.useCases.map((useCase) => (
                <li key={useCase}>{useCase}</li>
              ))}
            </ul>
          </div>

          <div className="modal-technologies">
            <h3>🛠️ Tecnologías</h3>
            <div className="tech-list">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.link && project.link !== '#' && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="modal-link">
              Ver Proyecto →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
