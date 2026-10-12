import type { Project } from '../data/projects';
import { useLanguage } from '../i18n/LanguageContext';
import './ProjectModal.css';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { t, language } = useLanguage();

  if (!isOpen || !project) return null;

  const text = project.translations[language]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <img src={project.image} alt={text.title} className="modal-image" />

        <div className="modal-body">
          <div className="modal-header-content">
            <h2>{text.title}</h2>
            <div className="modal-price">{text.price}</div>
          </div>

          <div className="modal-problem">
            <h3>{t(project.tier === 'client' ? 'projects.modal.problemLabel' : 'projects.modal.exploresLabel')}</h3>
            <p>{text.problem}</p>
          </div>

          <p className="modal-description">{text.fullDescription}</p>

          <div className="modal-use-cases">
            <h3>{t('projects.modal.useCasesLabel')}</h3>
            <ul>
              {text.useCases.map((useCase) => (
                <li key={useCase}>{useCase}</li>
              ))}
            </ul>
          </div>

          <div className="modal-technologies">
            <h3>{t('projects.modal.technologiesLabel')}</h3>
            <div className="tech-list">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link"
            >
              {t('projects.modal.viewOnGithub')} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
