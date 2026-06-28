import './AboutMe.css';

export function AboutMe() {
  return (
    <section id="about-me">
      <div className="about-container">
        <h2>Sobre mí</h2>
        <p>
          Soy Automation Developer especializado en resolver problemas reales de negocio. No solo creo scripts, sino sistemas completos que funcionan en producción. Con Python, n8n, APIs y herramientas modernas, construyo automatizaciones escalables que integran múltiples servicios.
        </p>
        <p>
          Tengo experiencia desplegando soluciones en entornos reales con VPS, Docker y Linux. He trabajado en:
        </p>
        <ul style={{marginLeft: '1.5rem', lineHeight: '1.8'}}>
          <li>Procesamiento automático de facturas con OCR</li>
          <li>Bots de notificación por WhatsApp y Telegram</li>
          <li>Seguimiento de tareas y reportes diarios automatizados</li>
          <li>Validación de datos e integración entre sistemas</li>
          <li>Automatización de procesos con OpenClaw AI</li>
        </ul>
        <p style={{marginTop: '1.5rem'}}>
          Disponible para proyectos freelance, trabajo remoto y colaboraciones a largo plazo. ¿Tienes un proceso repetitivo que necesita automatización? Déjame ayudarte a optimizar tu negocio.
        </p>
      </div>
    </section>
  );
}
