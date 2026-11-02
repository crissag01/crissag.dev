export type ProjectTier = 'client' | 'practice'

interface ProjectText {
  title: string
  description: string
  fullDescription: string
  problem: string
  useCases: string[]
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
        fullDescription: 'A complete configuration solution for OpenClaw with an admin interface. Manages settings, users, permissions, and logs, with real-time validation and change synchronization. Result: fewer configuration mistakes and better control over changes made by the team.',
        problem: "Even with OpenClaw 2.0's improved WebUI, configuring it end-to-end — settings, users, permissions — is still confusing for teams without hands-on experience with the platform.",
        useCases: ['OpenClaw platform administrators', 'Managing multiple users and roles', 'Auditing and logging configuration changes']
      },
      es: {
        title: 'Configuraciones OpenClaw',
        description: 'Sistema de configuración y gestión para OpenClaw',
        fullDescription: 'Solución completa de configuración para OpenClaw con interfaz administrativa. Permite gestionar parámetros, usuarios, permisos y logs. Incluye validación en tiempo real y sincronización de cambios. Resultado: menos errores de configuración y más control sobre cambios realizados por el equipo.',
        problem: 'Aunque OpenClaw 2.0 mejoró su WebUI, configurarla de punta a punta —parámetros, usuarios, permisos— sigue siendo confuso para equipos sin experiencia práctica con la plataforma.',
        useCases: ['Administradores de plataformas OpenClaw', 'Gestión de múltiples usuarios y roles', 'Auditoría y logs de cambios en configuración']
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
        fullDescription: 'n8n workflows where the sender just forwards an invoice (PDF or photo) over Telegram or WhatsApp. The file is read with OCR, an OpenAI model extracts the fields into structured data, the row is appended to Google Sheets, and the sender gets an instant confirmation. Result: less manual data entry, fewer transcription mistakes, and immediate receipt confirmation.',
        problem: 'Invoices arrived as files in chat and were typed into spreadsheets by hand — slow, error-prone, and with no confirmation that anything was received.',
        useCases: ['Teams that receive invoices or receipts over chat', 'Bookkeeping that needs data in a spreadsheet, not in screenshots', 'Instant receipt confirmation to the sender']
      },
      es: {
        title: 'Automatización de Captura de Facturas',
        description: 'Flujos de n8n que leen facturas enviadas por Telegram/WhatsApp y las registran en Google Sheets',
        fullDescription: 'Flujos de n8n donde quien envía solo manda la factura (PDF o foto) por Telegram o WhatsApp. El archivo se lee con OCR, un modelo de OpenAI extrae los campos en datos estructurados, la fila se agrega a Google Sheets y el remitente recibe confirmación al instante. Resultado: menos captura manual, menos errores por transcripción y confirmación inmediata de recibido.',
        problem: 'Las facturas llegaban como archivos por chat y se capturaban a mano en hojas de cálculo: lento, con errores y sin confirmación de recibido.',
        useCases: ['Equipos que reciben facturas o recibos por chat', 'Contabilidad que necesita datos en una hoja, no en capturas', 'Confirmación inmediata de recibido al remitente']
      }
    }
  },
  {
    id: 1,
    tier: 'client',
    image: '/projects/Assist-Card-Automation.png',
    technologies: ['n8n', 'REST API', 'JavaScript', 'Webhooks', 'OAuth2'],
    repoUrl: 'https://github.com/crissag01/crissag.dev/tree/Proyectos/Proyectos/Flujos%20n8n',
    translations: {
      en: {
        title: 'ASSIST CARD — Quote Automation',
        description: 'n8n workflow that automates travel-assistance quotes through the Assist Card API',
        fullDescription: 'An n8n workflow that logs into the Assist Card integration API (token auth with automatic refresh), requests a plan quote for a trip (dates, origin, destination, passenger birth dates), and returns the available plans ranked by price with a link to each one\'s coverage PDF. Built so an agent only has to send the trip details once instead of filling out the provider\'s quote form by hand.',
        problem: 'Quoting travel-assistance plans meant logging into the provider\'s portal and filling out the same form by hand for every traveler configuration — slow when an agency has to compare several plans per request.',
        useCases: ['Travel agencies quoting several plans per request', 'Connecting a chat or voice assistant to live quotes from a provider API', 'Any workflow that needs safe, read-only access to a third-party quoting API']
      },
      es: {
        title: 'ASSIST CARD — Automatización de Cotizaciones',
        description: 'Flujo de n8n que automatiza cotizaciones de asistencia al viajero con la API de Assist Card',
        fullDescription: 'Flujo de n8n que inicia sesión en la API de integraciones de Assist Card (autenticación por token con renovación automática), solicita la cotización de planes para un viaje (fechas, origen, destino, fechas de nacimiento de los pasajeros) y devuelve los planes disponibles ordenados por precio con el enlace al PDF de coberturas de cada uno. Pensado para que un agente solo tenga que mandar los datos del viaje una vez, en vez de llenar a mano el formulario de cotización del proveedor. Resultado: comparación más rápida de opciones y menos recaptura de datos por cada solicitud.',
        problem: 'Cotizar planes de asistencia al viajero significaba entrar al portal del proveedor y llenar el mismo formulario a mano por cada configuración de viajeros — lento cuando la agencia tiene que comparar varios planes por solicitud.',
        useCases: ['Agencias de viajes que cotizan varios planes por solicitud', 'Conectar un asistente de chat o voz a cotizaciones en vivo de la API de un proveedor', 'Cualquier flujo que necesite acceso seguro y de solo lectura a una API de cotización de terceros']
      }
    }
  },
  {
    id: 7,
    tier: 'client',
    image: '/projects/quote-agent.svg',
    technologies: ['OpenClaw', 'AI Agents', 'Pipedrive API', 'Telegram Bot', 'RPA'],
    translations: {
      en: {
        title: 'Automated Insurance Quote Agent',
        description: 'Autonomous agent that quotes auto insurance, compares carriers, and routes for approval',
        fullDescription: 'An autonomous OpenClaw agent that handles the full quote cycle on a CRM with no API of its own: it logs in, enters the prospect and vehicle data, runs the quote across several insurance carriers, generates a comparison document, and sends it to a human for approval over Telegram — then logs the result back into the sales pipeline. A state machine tracks each deal by its pipeline stage, so scheduled runs never pick up a deal that\'s already in progress, rejections trigger an automatic correct-and-resend cycle, and follow-ups only go out during business hours.',
        problem: 'Quoting a car insurance policy meant an agent manually re-entering the same prospect and vehicle data into a legacy CRM for every carrier, then building the comparison and chasing approval by hand — slow, repetitive, and easy to lose track of mid-flow.',
        useCases: ['Insurance agencies quoting multiple carriers per prospect', 'Adding a human-approval gate to an otherwise automated sales step', 'Automating data entry on a legacy system with no API']
      },
      es: {
        title: 'Agente de Cotizaciones de Seguros Automatizado',
        description: 'Agente autónomo que cotiza seguros de auto, compara aseguradoras y gestiona la aprobación',
        fullDescription: 'Agente autónomo de OpenClaw que ejecuta el ciclo completo de cotización en un CRM sin API propia: inicia sesión, captura los datos del prospecto y del vehículo, corre la cotización contra varias aseguradoras, genera un comparativo y lo envía a una persona para su aprobación por Telegram — y registra el resultado de vuelta en el pipeline de ventas. Una máquina de estados rastrea cada negociación por su etapa en el pipeline, así las corridas programadas nunca vuelven a tomar una que ya está en proceso, los rechazos disparan un ciclo automático de corrección y reenvío, y los seguimientos solo salen en horario laboral.',
        problem: 'Cotizar una póliza de auto significaba que una persona volviera a capturar a mano los mismos datos del prospecto y del vehículo en un CRM legado por cada aseguradora, armara el comparativo y diera seguimiento a la aprobación manualmente — lento, repetitivo y fácil de perder a la mitad.',
        useCases: ['Agencias de seguros que cotizan varias aseguradoras por prospecto', 'Agregar un punto de aprobación humana a un paso de ventas automatizado', 'Automatizar captura de datos en un sistema legado sin API']
      }
    }
  },
  {
    id: 8,
    tier: 'client',
    image: '/projects/whatsapp-monitor.svg',
    technologies: ['Node.js', 'ManyChat API', 'Telegram Bot', 'Monitoring', 'Browser Automation'],
    translations: {
      en: {
        title: 'WhatsApp Chatbot Monitor & Bulk Editor',
        description: 'Link-health monitoring and bulk message editing for a WhatsApp claims chatbot',
        fullDescription: 'A monitoring script that checks every document link served by a WhatsApp chatbot (covering claims procedures across 10+ insurance carriers), and alerts the team over Telegram the moment one breaks — instead of finding out from a customer. Paired with a bulk-editor script for the chatbot platform\'s own flow builder, which has no find-and-replace: it walks every carrier branch and updates a given step\'s message in one run instead of editing each one by hand.',
        problem: 'A chatbot serving claims documents for 10+ insurance carriers had broken links go unnoticed until a customer complained, and updating a shared message meant manually editing the same step across every single carrier branch in the flow builder.',
        useCases: ['Chatbots or help centers serving many branches of the same document/link structure', 'Catching broken third-party links before customers do', 'Bulk-editing a flow-builder UI that has no native find-and-replace']
      },
      es: {
        title: 'Monitor y Editor Masivo para Chatbot de WhatsApp',
        description: 'Monitoreo de enlaces y edición masiva de mensajes para un chatbot de siniestros en WhatsApp',
        fullDescription: 'Script de monitoreo que revisa cada enlace a documentos que sirve un chatbot de WhatsApp (procedimientos de siniestros de 10+ aseguradoras), y avisa al equipo por Telegram en cuanto uno se cae — en vez de enterarse por un cliente. Se complementa con un script de edición masiva para el editor de flujos de la plataforma del chatbot, que no tiene buscar-y-reemplazar: recorre cada rama de aseguradora y actualiza el mensaje de un paso en una sola corrida en vez de editar cada una a mano.',
        problem: 'Un chatbot que entrega documentos de siniestros para 10+ aseguradoras dejaba pasar enlaces rotos hasta que un cliente se quejaba, y actualizar un mensaje compartido significaba editar a mano el mismo paso en cada rama de aseguradora del editor de flujos.',
        useCases: ['Chatbots o centros de ayuda con muchas ramas de la misma estructura de documentos/enlaces', 'Detectar enlaces rotos de terceros antes que los clientes', 'Edición masiva de un editor de flujos que no tiene buscar-y-reemplazar nativo']
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
