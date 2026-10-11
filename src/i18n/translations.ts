export type Language = 'en' | 'es'

interface Localized {
  en: string
  es: string
}

interface LocalizedList {
  en: string[]
  es: string[]
}

export const translations = {
  hero: {
    title: {
      en: 'Automation Developer | Business Process Automation | Python, n8n, APIs, JavaScript',
      es: 'Automation Developer | Automatización de Procesos de Negocio | Python, n8n, APIs, JavaScript'
    },
    description: {
      en: 'I specialize in process automation, API integrations, and custom software solutions. I help businesses cut manual work and streamline operations with technology.',
      es: 'Especializado en automatización de procesos, integraciones API y desarrollo de soluciones personalizadas. Ayudo a empresas a optimizar sus operaciones con tecnología.'
    },
    location: { en: '📍 Monterrey, Nuevo León, Mexico', es: '📍 Monterrey, Nuevo León, México' },
    statClientProjects: { en: 'Client Projects', es: 'Proyectos de Cliente' },
    statAvailable: { en: 'Available', es: 'Disponible' },
    contactCta: { en: 'Contact Me', es: 'Contactar' },
    projectsCta: { en: 'View Projects', es: 'Ver Proyectos' },
    freelancerCta: { en: 'Freelancer.com Profile', es: 'Perfil en Freelancer.com' },
    stackHeading: { en: 'My Stack', es: 'Mi Stack' }
  } satisfies Record<string, Localized>,

  about: {
    heading: { en: 'About Me', es: 'Sobre mí' },
    paragraph1: {
      en: "I'm an Automation Developer focused on solving real business problems. I don't just write scripts — I build complete systems that run in production. With Python, n8n, APIs, and modern tooling, I create scalable automations that tie multiple services together.",
      es: 'Soy Automation Developer especializado en resolver problemas reales de negocio. No solo creo scripts, sino sistemas completos que funcionan en producción. Con Python, n8n, APIs y herramientas modernas, construyo automatizaciones escalables que integran múltiples servicios.'
    },
    paragraph2: {
      en: "I have experience deploying solutions in real environments with VPS, Docker, and Linux. I've worked on:",
      es: 'Tengo experiencia desplegando soluciones en entornos reales con VPS, Docker y Linux. He trabajado en:'
    },
    listItems: {
      en: [
        'Automated invoice processing with OCR',
        'WhatsApp and Telegram notification bots',
        'Automated task tracking and daily reporting',
        'Data validation and system-to-system integration',
        'Process automation with OpenClaw AI'
      ],
      es: [
        'Procesamiento automático de facturas con OCR',
        'Bots de notificación por WhatsApp y Telegram',
        'Seguimiento de tareas y reportes diarios automatizados',
        'Validación de datos e integración entre sistemas',
        'Automatización de procesos con OpenClaw AI'
      ]
    } satisfies LocalizedList,
    closing: {
      en: "Available for freelance projects, remote work, and long-term collaborations. Got a repetitive process that needs automating? Let's talk about it.",
      es: '¿Tienes un proceso repetitivo que necesita automatización? Disponible para proyectos freelance, trabajo remoto y colaboraciones a largo plazo. Déjame ayudarte a optimizar tu negocio.'
    }
  } satisfies Record<string, Localized | LocalizedList>,

  howItWork: {
    heading: { en: 'How I Work', es: 'Cómo Trabajo' },
    intro: {
      en: "A straightforward process, whether it's a quick automation or a full system.",
      es: 'Un proceso directo, ya sea una automatización rápida o un sistema completo.'
    },
    steps: [
      {
        title: { en: '1. Understand the bottleneck', es: '1. Entender el cuello de botella' },
        description: {
          en: "We start with a short call to map out the manual process, where time is actually being lost, and what a good outcome looks like for you.",
          es: 'Empezamos con una llamada corta para mapear el proceso manual, dónde se está perdiendo tiempo realmente, y cómo se ve un buen resultado para ti.'
        }
      },
      {
        title: { en: '2. Build & test', es: '2. Construir y probar' },
        description: {
          en: 'I build the automation or system in small, testable pieces, sharing progress along the way instead of disappearing for weeks.',
          es: 'Construyo la automatización o el sistema en piezas pequeñas y comprobables, compartiendo avances en el camino en vez de desaparecer por semanas.'
        }
      },
      {
        title: { en: '3. Ship & document', es: '3. Entregar y documentar' },
        description: {
          en: "Once it's working reliably, I deploy it and hand over clear docs so it doesn't depend on me to keep running.",
          es: 'Una vez que funciona de forma confiable, lo despliego y entrego documentación clara para que no dependa de mí para seguir funcionando.'
        }
      },
      {
        title: { en: '4. Support after launch', es: '4. Soporte post-lanzamiento' },
        description: {
          en: "I stay available for fixes and small adjustments after delivery — automations meet reality and need tweaks.",
          es: 'Sigo disponible para arreglos y ajustes pequeños después de la entrega — las automatizaciones se topan con la realidad y necesitan ajustes.'
        }
      }
    ]
  },

  projects: {
    clientHeading: { en: 'Client Work', es: 'Trabajo con Clientes' },
    clientIntro: {
      en: 'Automations and systems built and delivered for paying clients.',
      es: 'Automatizaciones y sistemas construidos y entregados para clientes que pagaron por el trabajo.'
    },
    practiceHeading: { en: 'Other Builds', es: 'Otros Proyectos' },
    practiceIntro: {
      en: "Personal and practice projects — not paid client work, but they show the same skills and pricing gives you a rough sense of what a similar build would cost.",
      es: 'Proyectos personales y de práctica — no son trabajo pagado de un cliente, pero muestran las mismas habilidades y el precio te da una idea aproximada de lo que costaría un proyecto similar.'
    },
    viewDetails: { en: 'View Details →', es: 'Ver Detalles →' },
    modal: {
      problemLabel: { en: '🎯 Problem It Solves', es: '🎯 Problema que Resuelve' },
      exploresLabel: { en: '🎯 What It Explores', es: '🎯 Qué Explora' },
      useCasesLabel: { en: '💼 Use Cases', es: '💼 Casos de Uso' },
      technologiesLabel: { en: '🛠️ Technologies', es: '🛠️ Tecnologías' }
    } satisfies Record<string, Localized>
  },

  feedback: {
    heading: { en: 'Visitor Feedback', es: 'Comentarios de Visitantes' },
    loading: { en: 'Loading comments...', es: 'Cargando comentarios...' },
    empty: {
      en: 'No comments yet — be the first to share your thoughts on my work.',
      es: 'No hay comentarios aún. ¡Sé el primero en compartir tu opinión sobre mi trabajo!'
    }
  } satisfies Record<string, Localized>,

  commentForm: {
    heading: { en: 'Leave a comment', es: 'Deja tu comentario' },
    nameLabel: { en: 'Name', es: 'Nombre' },
    namePlaceholder: { en: 'Your name', es: 'Tu nombre' },
    emailLabel: { en: 'Email', es: 'Email' },
    emailPlaceholder: { en: 'you@email.com', es: 'tu@email.com' },
    projectLabel: { en: 'Which project are you commenting on', es: 'Sobre qué proyecto opinas' },
    projectPlaceholder: { en: '-- Select a project --', es: '-- Selecciona un proyecto --' },
    ratingLabel: { en: 'Rating', es: 'Calificación' },
    ratingOptions: {
      en: ['Excellent (5)', 'Very Good (4)', 'Good (3)', 'Fair (2)', 'Poor (1)'],
      es: ['Excelente (5)', 'Muy Bueno (4)', 'Bueno (3)', 'Regular (2)', 'Pobre (1)']
    } satisfies LocalizedList,
    commentLabel: { en: 'Comment', es: 'Comentario' },
    commentPlaceholder: { en: 'Share your experience...', es: 'Comparte tu experiencia...' },
    submitIdle: { en: 'Send Comment', es: 'Enviar Comentario' },
    submitLoading: { en: 'Sending...', es: 'Enviando...' },
    successToast: {
      en: '✓ Thanks for your comment. It will be visible after review.',
      es: '✓ Gracias por tu comentario. Será visible después de ser revisado.'
    },
    errorGeneric: { en: 'Error submitting comment', es: 'Error al enviar el comentario' },
    errorConnection: { en: 'Connection error. Please try again.', es: 'Error de conexión. Intenta de nuevo.' },
    verificationError: {
      en: 'Please complete the security check',
      es: 'Por favor completa la verificación de seguridad'
    },
    errors: {
      nameRequired: { en: 'Name is required', es: 'El nombre es requerido' },
      nameMin: { en: 'At least 2 characters', es: 'Mínimo 2 caracteres' },
      emailRequired: { en: 'Email is required', es: 'El email es requerido' },
      emailInvalid: { en: 'Invalid email', es: 'Email inválido' },
      projectRequired: { en: 'Select a project', es: 'Selecciona un proyecto' },
      commentRequired: { en: 'Comment is required', es: 'El comentario es requerido' },
      commentMin: { en: 'At least 10 characters', es: 'Mínimo 10 caracteres' },
      commentMax: { en: 'Maximum 1000 characters', es: 'Máximo 1000 caracteres' }
    } satisfies Record<string, Localized>
  },

  contactForm: {
    nameLabel: { en: 'Name', es: 'Nombre' },
    namePlaceholder: { en: 'Your name', es: 'Tu nombre' },
    emailLabel: { en: 'Email', es: 'Email' },
    emailPlaceholder: { en: 'you@email.com', es: 'tu@email.com' },
    messageLabel: { en: 'Message', es: 'Mensaje' },
    messagePlaceholder: { en: 'Your message here...', es: 'Tu mensaje aquí...' },
    submitIdle: { en: 'Send Message', es: 'Enviar Mensaje' },
    submitLoading: { en: 'Sending...', es: 'Enviando...' },
    successToast: {
      en: '✓ Message sent successfully. I will get back to you soon.',
      es: '✓ Mensaje enviado correctamente. Te contactaremos pronto.'
    },
    verificationError: {
      en: 'Please complete the security check',
      es: 'Por favor completa la verificación de seguridad'
    },
    genericError: { en: 'Error sending the message. Please try again.', es: 'Error al enviar el mensaje. Intenta de nuevo.' },
    connectionError: {
      en: 'Connection error. Check your internet and try again.',
      es: 'Error de conexión. Verifica tu internet e intenta de nuevo.'
    },
    errors: {
      nameRequired: { en: 'Name is required', es: 'El nombre es requerido' },
      nameMin: { en: 'At least 2 characters', es: 'Debe tener al menos 2 caracteres' },
      nameMax: { en: 'Maximum 100 characters', es: 'No puede exceder 100 caracteres' },
      emailRequired: { en: 'Email is required', es: 'El email es requerido' },
      emailInvalid: { en: 'Invalid email', es: 'Email inválido' },
      messageRequired: { en: 'Message is required', es: 'El mensaje es requerido' },
      messageMin: { en: 'At least 10 characters', es: 'Debe tener al menos 10 caracteres' },
      messageMax: { en: 'Maximum {max} characters', es: 'No puede exceder {max} caracteres' }
    } satisfies Record<string, Localized>
  },

  contactSection: {
    heading: { en: "Let's Connect", es: 'Conectemos' }
  } satisfies Record<string, Localized>,

  footer: {
    rights: { en: 'All rights reserved.', es: 'Todos los derechos reservados.' }
  } satisfies Record<string, Localized>
}
