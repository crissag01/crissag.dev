import { testimonials } from '../data/testimonials';
import './TestimonialCarousel.css';

export function TestimonialCarousel() {
  return (
    <section id="testimonials">
      <h2>Opiniones</h2>

      <div className="testimonials-wrapper">
        <div className="testimonials-scroll">
          {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="testimonial-card-ribbon">
              <div className="testimonial-header">
                <img src={testimonial.avatar} alt={testimonial.author} className="avatar" />
                <div className="author-info">
                  <h3>{testimonial.author}</h3>
                  <p className="role">{testimonial.role}</p>
                  <p className="company">{testimonial.company}</p>
                </div>
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
