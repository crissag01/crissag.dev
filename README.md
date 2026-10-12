# crissag.dev — Portafolio Profesional

Portafolio de Cristofer Aguilar: proyectos, automatizaciones y experiencia en desarrollo de software. Sitio bilingüe (inglés/español) desplegado en Vercel.

## 🎨 Características

- **Diseño Moderno:** Interfaz minimalista con tema púrpura y negro
- **Bilingüe:** Inglés por defecto, con toggle a español
- **Responsive Design:** Funciona perfectamente en mobile y desktop
- **Panel de Admin:** Moderación de comentarios en `/admin`
- **SEO Ready:** Meta tags y estructura semántica

## 🏗️ Estructura del Proyecto

```
├── src/
│   ├── components/        # Componentes React del sitio público
│   ├── data/               # Data estática (proyectos, etc)
│   ├── hooks/               # Hooks compartidos (ej. useTurnstile)
│   ├── i18n/                 # Traducciones y contexto de idioma
│   ├── admin/               # App del panel de moderación (/admin)
│   ├── App.tsx              # Componente principal del sitio público
│   └── main.tsx            # Entry point del sitio público
├── admin/
│   └── index.html          # Entry point de Vite para /admin
├── api/                     # Funciones serverless (Vercel)
│   ├── _lib/                 # Lógica compartida (Supabase, mailer, etc)
│   ├── contact.ts            # POST /api/contact
│   └── comments/             # GET/POST /api/comments + moderación
├── supabase/
│   └── migrations/          # Esquema SQL de la base de datos
├── public/                  # Assets estáticos (imágenes, iconos)
├── vite.config.ts           # Configuración de Vite (multi-entry)
└── package.json             # Dependencias del proyecto
```

Las automatizaciones de n8n y otros proyectos de práctica que aparecen en el portafolio viven en la rama [`Proyectos`](https://github.com/crissag01/crissag.dev/tree/Proyectos) de este mismo repositorio, separados de `main` para mantener el repo del sitio enfocado solo en el código del sitio.

## 🚀 Stack Tecnológico

**Frontend:**
- React 19 + TypeScript
- Vite (bundler, multi-entry para sitio público + admin)
- CSS3 (sin frameworks)

**Backend:**
- Funciones serverless en Vercel (Node.js)
- Supabase (Postgres) para comentarios y rate limiting
- Nodemailer (SMTP) para notificaciones por correo
- Cloudflare Turnstile como protección anti-bot

## 📁 Guía de Componentes

### DynamicBackground
Fondo animado con partículas conectadas. Optimizado para rendimiento.

### Hero
Sección principal con nombre, título y stack de tecnologías.

### AboutMe
Sección "Sobre Mí" con descripción profesional.

### HowIWork
Explica el proceso de trabajo en pasos.

### ProjectCarousel
Carrusel interactivo de proyectos (trabajo de cliente y proyectos de práctica por separado), con hover effects.

### ProjectModal
Modal para ver detalles completos de cada proyecto.

### TestimonialCarousel / CommentForm
Comentarios de visitantes, moderados antes de publicarse.

## 🔐 Seguridad

- ✅ No se almacenan credenciales en el código — todo vía variables de entorno en Vercel
- ✅ Turnstile + rate limiting en los formularios públicos (contacto y comentarios)
- ✅ Comentarios moderados antes de publicarse (`/admin`, protegido por token)
- ✅ RLS activado en las tablas de Supabase — solo accesibles server-side

## 📞 Contacto

- **Email:** crissag@proton.me
- **GitHub:** [crissag01](https://github.com/crissag01)
- **LinkedIn:** [Cristofer Aguilar](https://www.linkedin.com/in/cristofer-aguilar-249694382/)

## 📄 Licencia

**Todos los derechos reservados.**

Este repositorio **no cuenta con ninguna licencia de código abierto**. La ausencia de una licencia no significa que el código sea de uso libre: por defecto, todos los derechos de autor sobre este código permanecen exclusivamente en manos del autor (Cristofer Aguilar).

Esto significa que **no tienes permiso para usar, copiar, modificar, distribuir, clonar ni crear forks de este código**, total o parcialmente, sin autorización previa y por escrito del autor. Cualquier uso no autorizado constituye una infracción de derechos de autor y podrá dar lugar a las acciones legales correspondientes.

Si te interesa licenciar o usar parte de este código, contáctame: crissag@proton.me

---

**Autor:** Cristofer Aguilar
