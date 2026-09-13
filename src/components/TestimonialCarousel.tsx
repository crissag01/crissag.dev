import { useState, useEffect } from 'react'
import { CommentForm } from './CommentForm'
import { projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import './TestimonialCarousel.css'

interface Comment {
  id: string
  name: string
  projectId: string
  comment: string
  rating: number
  createdAt: string
  approved: boolean
}

export function TestimonialCarousel() {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguage()

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments')
      const data = await response.json()
      if (data.success) {
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
        ★
      </span>
    ))
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === parseInt(projectId))
    return project?.translations[language].title || 'Unknown project'
  }

  return (
    <section id="testimonials">
      <h2>{t('feedback.heading')}</h2>

      <CommentForm onCommentAdded={fetchComments} />

      <div className="comments-section">
        {isLoading ? (
          <div className="loading-state">
            <p>{t('feedback.loading')}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="empty-state">
            <p>{t('feedback.empty')}</p>
          </div>
        ) : (
          <div className="testimonials-wrapper">
            <div className="testimonials-scroll">
              {comments.map((comment) => (
                <div key={comment.id} className="testimonial-card-ribbon">
                  <div className="testimonial-header">
                    <div className="author-info">
                      <h3>{comment.name}</h3>
                      <p className="project-name">{getProjectName(comment.projectId)}</p>
                      <div className="stars">
                        {renderStars(comment.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="testimonial-content">"{comment.comment}"</p>
                  <p className="testimonial-date">
                    {new Date(comment.createdAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
