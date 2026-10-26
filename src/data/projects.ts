export type ProjectTier = 'client' | 'practice'

interface ProjectText {
  title: string
  description: string
  fullDescription: string
  problem: string
  useCases: string[]
  price?: string
}

export interface Project {
  id: number
  tier: ProjectTier
  image: string
  technologies: string[]
  repoUrl?: string
  translations: {
    en: ProjectText
    es: ProjectText
  }
}

export const projects: Project[] = [
  {
    id: 3,
    tier: 'client',
    image: '/projects/Openclaw-banner.png',
    technologies: ['React', 'TypeScript', 'API Rest', 'Base de Datos'],
    translations: {
      en: {
        title: 'OpenClaw Configuration & Management',
        description: 'Configuration and management system for OpenClaw',
        fullDescription: 'A complete configuration solution for OpenClaw with an admin interface. Manages settings, users, permissions, and logs, with real-time validation and change synchronization.',
        problem: "Even with OpenClaw 2.0's improved WebUI, configuring it end-to-end — settings, users, permissions — is still confusing for teams without hands-on experience with the platform.",
        useCases: ['OpenClaw platform administrators', 'Managing multiple users and roles', 'Auditing and logging configuration changes'],
        price: 'From $2,500 USD setup + $100 USD/mo'
      },
      es: {
        title: 'Configuraciones OpenClaw',
        description: 'Sistema de configuración y gestión para OpenClaw',
        fullDescription: 'Solución completa de configuración para OpenClaw con interfaz administrativa. Permite gestionar parámetros, usuarios, permisos y logs. Incluye validación en tiempo real y sincronización de cambios.',
        problem: 'Aunque OpenClaw 2.0 mejoró su WebUI, configurarla de punta a punta —parámetros, usuarios, permisos— sigue siendo confuso para equipos sin experiencia práctica con la plataforma.',
        useCases: ['Administradores de plataformas OpenClaw', 'Gestión de múltiples usuarios y roles', 'Auditoría y logs de cambios en configuración'],
        price: 'Desde $2,500 USD de instalación + $100 USD/mes'
      }
    }
  },
  {
    id: 4,
    tier: 'client',
    image: '/projects/n8n-facturas-1.jpg',
    technologies: ['n8n', 'Telegram Bot', 'WhatsApp API', 'Google Sheets', 'JavaScript'],
    repoUrl: 'https://github.com/crissag01/crissag.dev/tree/Proyectos/Proyectos/Flujos%20n8n',
    translations: {
      en: {
        title: 'Invoice Capture Automation',
        description: 'n8n workflows that read invoices sent over Telegram/WhatsApp and log them to Google Sheets',
        fullDescription: 'n8n workflows where the sender just forwards an invoice (PDF or photo) over Telegram or WhatsApp. The file is read with OCR, an OpenAI model extracts the fields into structured data, the row is appended to Google Sheets, and the sender gets an instant confirmation.',
        problem: 'Invoices arrived as files in chat and were typed into spreadsheets by hand — slow, error-prone, and with no confirmation that anything was received.',
        useCases: ['Teams that receive invoices or receipts over chat', 'Bookkeeping that needs data in a spreadsheet, not in screenshots', 'Instant receipt confirmation to the sender'],
        price: 'From $3,500 USD setup + $150 USD/mo'
      },
      es: {
        title: 'Automatización de Captura de Facturas',
        description: 'Flujos de n8n que leen facturas enviadas por Telegram/WhatsApp y las registran en Google Sheets',
        fullDescription: 'Flujos de n8n donde quien envía solo manda la factura (PDF o foto) por Telegram o WhatsApp. El archivo se lee con OCR, un modelo de OpenAI extrae los campos en datos estructurados, la fila se agrega a Google Sheets y el remitente recibe confirmación al instante.',
        problem: 'Las facturas llegaban como archivos por chat y se capturaban a mano en hojas de cálculo: lento, con errores y sin confirmación de recibido.',
        useCases: ['Equipos que reciben facturas o recibos por chat', 'Contabilidad que necesita datos en una hoja, no en capturas', 'Confirmación inmediata de recibido al remitente'],
        price: 'Desde $3,500 USD de instalación + $150 USD/mes'
      }
    }
  },
  {
    id: 1,
    tier: 'practice',
    image: '/projects/Assist-Card-Automation.png',
    technologies: ['n8n', 'JavaScript', 'APIs', 'Webhooks', 'Automatización'],
    repoUrl: 'https://github.com/crissag01/crissag.dev/tree/Proyectos/Proyectos/Flujos%20n8n',
    translations: {
      en: {
        title: 'ASSIST CARD — Quote Automation (practice build)',
        description: 'Practice workflow automating insurance quote requests',
        fullDescription: 'An n8n workflow I built to practice processing insurance quote requests end to end: webhooks, data validation, external API calls, and automatic report generation, with retries and error handling.',
        problem: 'A practice build modeling a pattern common at travel-insurance agencies, where quotes are processed by hand and responses can take 24h+.',
        useCases: ['Insurance agencies handling 50+ quotes/month', 'Businesses that need near-instant responses', 'Reducing manual back-office workload']
      },
      es: {
        title: 'ASSIST CARD — Automatización de Cotizaciones (proyecto de práctica)',
        description: 'Flujo de práctica para automatizar solicitudes de cotización de seguros',
        fullDescription: 'Flujo en n8n que construí para practicar el procesamiento de solicitudes de cotización de seguros de extremo a extremo: webhooks, validación de datos, llamadas a APIs externas y generación automática de reportes, con reintentos y manejo de errores.',
        problem: 'Proyecto de práctica que modela un patrón común en agencias de seguros de viaje, donde las cotizaciones se procesan a mano y las respuestas pueden tardar 24h+.',
        useCases: ['Agencias de seguros con 50+ cotizaciones/mes', 'Empresas que necesitan respuestas casi inmediatas', 'Reducir la carga manual de back-office']
      }
    }
  },
  {
    id: 2,
    tier: 'practice',
    image: '/projects/Nas-3.jpeg',
    technologies: ['JavaScript', 'HTML/CSS', 'Node.js', 'npm'],
    repoUrl: 'https://github.com/crissag01/crissag.dev/tree/Proyectos/Proyectos/NAS-Local',
    translations: {
      en: {
        title: 'Local NAS with File Upload (practice build)',
        description: 'Local storage server with a web interface',
        fullDescription: 'A custom NAS server built with HTML, CSS, JavaScript, and Node.js (using npm fileupload). Upload, download, and organize files from a simple web interface, with search, categorization, and permission management.',
        problem: 'Explores what teams without private cloud storage need: keeping sensitive files off third-party platforms without losing easy access.',
        useCases: ['Teams with private-data policies', 'Secure local storage for sensitive files', 'Browser-accessible project file management']
      },
      es: {
        title: 'NAS Local con File Upload (proyecto de práctica)',
        description: 'Sistema de almacenamiento local con interfaz web',
        fullDescription: 'Servidor NAS personalizado desarrollado con HTML, CSS, JavaScript y Node.js usando npm fileupload. Permite subir, descargar y organizar archivos desde una interfaz web intuitiva. Incluye búsqueda, categorización y gestión de permisos.',
        problem: 'Explora lo que necesitan los equipos sin almacenamiento en la nube privada: mantener archivos sensibles fuera de plataformas externas sin perder acceso fácil.',
        useCases: ['Equipos con políticas de datos privados', 'Almacenamiento local seguro de archivos sensibles', 'Gestión de proyectos con acceso desde navegador']
      }
    }
  },
  {
    id: 5,
    tier: 'practice',
    image: '/projects/python-apps.svg',
    technologies: ['Python', 'Pandas', 'Matplotlib', 'CLI'],
    repoUrl: 'https://github.com/crissag01/crissag.dev/tree/Proyectos/Proyectos/Organizador%20de%20Finanzas%20Python',
    translations: {
      en: {
        title: 'Personal Finance Organizer (practice build)',
        description: 'Python app for financial analysis and organization',
        fullDescription: 'A Python tool that automates organizing and analyzing financial data: processes transactions, generates expense reports, budget projections, and trend analysis. Simple CLI interface with report export.',
        problem: 'Explores a common pain point for freelancers: disorganized spending with no clear reports or budget projections.',
        useCases: ['Freelancers and founders with variable expenses', 'Monthly spending trend analysis', 'Automatic financial report generation']
      },
      es: {
        title: 'Organizador de Finanzas (proyecto de práctica)',
        description: 'Aplicación en Python para análisis y organización financiera',
        fullDescription: 'Herramienta en Python que automatiza la organización y análisis de datos financieros. Procesa transacciones, genera reportes de gastos, proyecciones presupuestarias y análisis de tendencias. Interfaz CLI intuitiva y exportación de reportes.',
        problem: 'Explora un problema común para freelancers: gastos desorganizados sin reportes claros ni proyecciones presupuestarias.',
        useCases: ['Freelancers y emprendedores con gastos variables', 'Análisis de tendencias de gasto mensual', 'Generación automática de reportes financieros']
      }
    }
  }
]
