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
          <h2>{project.title}</h2>

          <p className="modal-description">{project.fullDescription}</p>

          <div className="modal-technologies">
            <h3>Tecnologías</h3>
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
