export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  technologies: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'ASSIST CARD - Automatización de Cotizaciones',
    description: 'Sistema automatizado para cotizaciones de seguros ASSIST CARD',
    fullDescription: 'Flujo automatizado en n8n que procesa solicitudes de cotizaciones de ASSIST CARD. Integra webhooks, validación de datos, comunicación con APIs externas y generación automática de reportes. Incluye versionamiento optimizado para manejo de errores y reintentos automáticos.',
    image: '/projects/cloud-devops.svg',
    technologies: ['n8n', 'JavaScript', 'APIs', 'Webhooks', 'Automatización'],
    link: '#'
  },
  {
    id: 2,
    title: 'NAS Local con File Upload',
    description: 'Sistema de almacenamiento local con interfaz web',
    fullDescription: 'Servidor NAS personalizado desarrollado con HTML, CSS, JavaScript y Node.js usando npm fileupload. Permite subir, descargar y organizar archivos desde una interfaz web intuitiva. Incluye búsqueda, categorización y gestión de permisos.',
    image: '/projects/nas-server.svg',
    technologies: ['JavaScript', 'HTML/CSS', 'Node.js', 'npm'],
    link: '#'
  },
  {
    id: 3,
    title: 'Configuraciones OpenClaw',
    description: 'Sistema de configuración y gestión para OpenClaw',
    fullDescription: 'Solución completa de configuración para OpenClaw con interfaz administrativa. Permite gestionar parámetros, usuarios, permisos y logs. Incluye validación en tiempo real y sincronización de cambios.',
    image: '/projects/openclaw-ai.svg',
    technologies: ['React', 'TypeScript', 'API Rest', 'Base de Datos'],
    link: '#'
  },
  {
    id: 4,
    title: 'Automatización de Facturas',
    description: 'Flujos de n8n para generación y distribución de facturas',
    fullDescription: 'Suite de automatizaciones en n8n para generar facturas y distribuirlas automáticamente por Telegram y WhatsApp. Incluye cálculos automáticos, formateo de documentos, integración con proveedores de pago y notificaciones en tiempo real.',
    image: '/projects/invoice-whatsapp.svg',
    technologies: ['n8n', 'Telegram Bot', 'WhatsApp API', 'Google Sheets', 'JavaScript'],
    link: '#'
  },
  {
    id: 5,
    title: 'Organizador de Finanzas',
    description: 'Aplicación en Python para análisis y organización financiera',
    fullDescription: 'Herramienta en Python que automatiza la organización y análisis de datos financieros. Procesa transacciones, genera reportes de gastos, proyecciones presupuestarias y análisis de tendencias. Interfaz CLI intuitiva y exportación de reportes.',
    image: '/projects/python-apps.svg',
    technologies: ['Python', 'Pandas', 'Matplotlib', 'CLI'],
    link: '#'
  },
  {
    id: 6,
    title: 'Wallpaper Engine Automations',
    description: 'Scripts y automatizaciones para Wallpaper Engine',
    fullDescription: 'Colección de scripts avanzados y automatizaciones para Wallpaper Engine. Incluye efectos interactivos, sincronización de música, animaciones dinámicas y configuraciones personalizables. Optimizado para bajo consumo de recursos.',
    image: '/projects/automation-tools.svg',
    technologies: ['JavaScript', 'WebGL', 'HTML5', 'CSS3'],
    link: '#'
  }
];
