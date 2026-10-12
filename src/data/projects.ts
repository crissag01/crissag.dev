export type ProjectTier = 'client' | 'practice'

interface ProjectText {
  title: string
  description: string
  fullDescription: string
  problem: string
  useCases: string[]
  price: string
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
        price: 'From $2,500 setup + $100/mo'
      },
      es: {
        title: 'Configuraciones OpenClaw',
        description: 'Sistema de configuración y gestión para OpenClaw',
        fullDescription: 'Solución completa de configuración para OpenClaw con interfaz administrativa. Permite gestionar parámetros, usuarios, permisos y logs. Incluye validación en tiempo real y sincronización de cambios.',
        problem: 'Aunque OpenClaw 2.0 mejoró su WebUI, configurarla de punta a punta —parámetros, usuarios, permisos— sigue siendo confuso para equipos sin experiencia práctica con la plataforma.',
        useCases: ['Administradores de plataformas OpenClaw', 'Gestión de múltiples usuarios y roles', 'Auditoría y logs de cambios en configuración'],
        price: 'Desde $2,500 de instalación + $100/mes'
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
        title: 'Invoice Automation',
        description: 'n8n workflows for invoice generation and distribution',
        fullDescription: 'A suite of n8n automations that generate invoices and distribute them automatically over Telegram and WhatsApp. Includes automatic calculations, document formatting, payment provider integration, and real-time notifications.',
        problem: 'The business was generating invoices by hand — slow, error-prone, and with no instant notification to clients.',
        useCases: ['Freelancers and agencies with multiple clients', 'Businesses with recurring payments', 'Automatic invoice notifications via WhatsApp/Telegram'],
        price: 'From $3,500 setup + $150/mo'
      },
      es: {
        title: 'Automatización de Facturas',
        description: 'Flujos de n8n para generación y distribución de facturas',
        fullDescription: 'Suite de automatizaciones en n8n para generar facturas y distribuirlas automáticamente por Telegram y WhatsApp. Incluye cálculos automáticos, formateo de documentos, integración con proveedores de pago y notificaciones en tiempo real.',
        problem: 'El negocio generaba facturas manualmente, cometiendo errores, consumiendo tiempo valioso y sin notificación inmediata a clientes.',
        useCases: ['Freelancers y agencias con múltiples clientes', 'Empresas con pagos recurrentes', 'Notificación automática de facturas por WhatsApp/Telegram'],
        price: 'Desde $3,500 de instalación + $150/mes'
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
        useCases: ['Insurance agencies handling 50+ quotes/month', 'Businesses that need near-instant responses', 'Reducing manual back-office workload'],
        price: 'Similar builds start at ~$3,500 setup + $150/mo'
      },
      es: {
        title: 'ASSIST CARD — Automatización de Cotizaciones (proyecto de práctica)',
        description: 'Flujo de práctica para automatizar solicitudes de cotización de seguros',
        fullDescription: 'Flujo en n8n que construí para practicar el procesamiento de solicitudes de cotización de seguros de extremo a extremo: webhooks, validación de datos, llamadas a APIs externas y generación automática de reportes, con reintentos y manejo de errores.',
        problem: 'Proyecto de práctica que modela un patrón común en agencias de seguros de viaje, donde las cotizaciones se procesan a mano y las respuestas pueden tardar 24h+.',
        useCases: ['Agencias de seguros con 50+ cotizaciones/mes', 'Empresas que necesitan respuestas casi inmediatas', 'Reducir la carga manual de back-office'],
        price: 'Proyectos similares desde ~$3,500 de instalación + $150/mes'
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
        useCases: ['Teams with private-data policies', 'Secure local storage for sensitive files', 'Browser-accessible project file management'],
        price: 'Similar builds start at ~$1,500 setup + $50/mo'
      },
      es: {
        title: 'NAS Local con File Upload (proyecto de práctica)',
        description: 'Sistema de almacenamiento local con interfaz web',
        fullDescription: 'Servidor NAS personalizado desarrollado con HTML, CSS, JavaScript y Node.js usando npm fileupload. Permite subir, descargar y organizar archivos desde una interfaz web intuitiva. Incluye búsqueda, categorización y gestión de permisos.',
        problem: 'Explora lo que necesitan los equipos sin almacenamiento en la nube privada: mantener archivos sensibles fuera de plataformas externas sin perder acceso fácil.',
        useCases: ['Equipos con políticas de datos privados', 'Almacenamiento local seguro de archivos sensibles', 'Gestión de proyectos con acceso desde navegador'],
        price: 'Proyectos similares desde ~$1,500 de instalación + $50/mes'
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
        useCases: ['Freelancers and founders with variable expenses', 'Monthly spending trend analysis', 'Automatic financial report generation'],
        price: 'Similar builds start at ~$1,200 one-time'
      },
      es: {
        title: 'Organizador de Finanzas (proyecto de práctica)',
        description: 'Aplicación en Python para análisis y organización financiera',
        fullDescription: 'Herramienta en Python que automatiza la organización y análisis de datos financieros. Procesa transacciones, genera reportes de gastos, proyecciones presupuestarias y análisis de tendencias. Interfaz CLI intuitiva y exportación de reportes.',
        problem: 'Explora un problema común para freelancers: gastos desorganizados sin reportes claros ni proyecciones presupuestarias.',
        useCases: ['Freelancers y emprendedores con gastos variables', 'Análisis de tendencias de gasto mensual', 'Generación automática de reportes financieros'],
        price: 'Proyectos similares desde ~$1,200 pago único'
      }
    }
  },
  {
    id: 6,
    tier: 'practice',
    image: '/projects/automation-tools.svg',
    technologies: ['JavaScript', 'WebGL', 'HTML5', 'CSS3'],
    repoUrl: 'https://github.com/crissag01/crissag.dev/tree/Proyectos/Proyectos/Wallpaper%20Engine',
    translations: {
      en: {
        title: 'Wallpaper Engine Automations (hobby build)',
        description: 'Scripts and automations for Wallpaper Engine',
        fullDescription: 'A collection of scripts and automations for Wallpaper Engine: interactive effects, music sync, dynamic animations, and customizable settings, optimized for low resource usage.',
        problem: 'A hobby project exploring lightweight, interactive alternatives to static or resource-heavy wallpapers.',
        useCases: ['People who want personalized, interactive wallpapers', 'Wallpaper synced to music in real time', 'Dynamic visual effects with low CPU usage'],
        price: 'Similar builds ~$800–$1,200 custom'
      },
      es: {
        title: 'Wallpaper Engine Automations (proyecto hobby)',
        description: 'Scripts y automatizaciones para Wallpaper Engine',
        fullDescription: 'Colección de scripts avanzados y automatizaciones para Wallpaper Engine. Incluye efectos interactivos, sincronización de música, animaciones dinámicas y configuraciones personalizables. Optimizado para bajo consumo de recursos.',
        problem: 'Proyecto hobby que explora alternativas ligeras e interactivas a fondos de pantalla estáticos o pesados en recursos.',
        useCases: ['Usuarios que buscan fondos personalizados e interactivos', 'Sincronización de wallpaper con música en tiempo real', 'Efectos visuales dinámicos con bajo consumo de CPU'],
        price: 'Proyectos similares ~$800–$1,200 a medida'
      }
    }
  }
]
