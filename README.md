# crissag.dev - Portafolio Profesional

Portafolio personal de Cristofer Aguilar mostrando proyectos, automatizaciones y experiencia en desarrollo de software.

## 🎨 Características

- **Diseño Moderno:** Interfaz minimalista con tema púrpura y negro
- **Animaciones Suaves:** Canvas dinámico y transiciones optimizadas
- **Responsive Design:** Funciona perfectamente en mobile y desktop
- **Performance Optimizado:** Carga rápida y eficiente
- **SEO Ready:** Meta tags y estructura semántica

## 🏗️ Estructura del Proyecto

```
├── src/
│   ├── components/        # Componentes React reutilizables
│   ├── data/             # Data estática (proyectos, etc)
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globales
├── public/               # Assets estáticos (imágenes, iconos)
├── Proyectos/           
│   ├── Flujos n8n/       # Automatizaciones en n8n
│   └── n8n-flows-docs/   # Documentación de flujos
├── dist/                # Build output
├── vite.config.ts       # Configuración de Vite
├── tsconfig.json        # Configuración de TypeScript
└── package.json         # Dependencias del proyecto

```

## 🚀 Stack Tecnológico

**Frontend:**
- React 19.2.6
- TypeScript 6.0
- Vite 8.0 (bundler)
- CSS3 (sin frameworks)
- Canvas API (animaciones)

**Automatizaciones:**
- n8n (orquestación de workflows)
- Google Sheets / Gmail (integración)
- Telegram & WhatsApp APIs
- Webhooks personalizados

**DevOps:**
- Node.js 20.19+
- npm (package manager)
- Git

## 💻 Requisitos Previos

- Node.js 20.19+ o 22.12+
- npm 10+
- Git

## 🛠️ Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/crissag01/crissag.dev.git
cd crissag.dev
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar servidor de desarrollo
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:20413` (o el siguiente puerto disponible).

### 4. Build para producción
```bash
npm run build
```

Output estará en la carpeta `dist/`.

## 📁 Guía de Componentes

### DynamicBackground
Fondo animado con partículas conectadas. Optimizado para rendimiento.

### Hero
Sección principal con nombre, título y stack de tecnologías.

### AboutMe
Sección "Sobre Mí" con descripción profesional.

### ProjectCarousel
Carrusel interactivo de proyectos con hover effects.

### ProjectModal
Modal para ver detalles completos de cada proyecto.

### TestimonialCarousel
Carrusel de testimonios y comentarios.

## 🤖 Automatizaciones (n8n)

Disponibles en `Proyectos/Flujos n8n/`:

- **ASSIST CARD:** Sistema de cotizaciones automático
- **Facturas:** Distribución por Telegram y WhatsApp
- **Bitácora:** Registro de eventos en tiempo real
- **Organizador de Métricas:** Centralización de datos

Documentación completa: `Proyectos/n8n-flows-docs/`

## 📊 Performance

- Lighthouse Score: 95+
- TTL (Time to Load): < 2s
- LCP (Largest Contentful Paint): < 1.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## 🔐 Seguridad

- ✅ No se almacenan credenciales en el código
- ✅ Variables de entorno en `.env.local`
- ✅ HTTPS solo en producción
- ✅ Headers de seguridad configurados
- ✅ CSP (Content Security Policy) activo

## 📝 Convenciones de Código

- **Componentes:** PascalCase (ej: `Hero.tsx`)
- **Archivos de estilo:** kebab-case (ej: `hero.css`)
- **Variables:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **TypeScript:** Tipos explícitos siempre

## 🧪 Testing

```bash
npm run build    # Verificar build
npm run lint     # Análisis de código
```

## 🚀 Deploy a Hostinger

### Opción 1: cPanel
1. Build: `npm run build`
2. Upload `dist/` via FTP a la carpeta pública
3. Configura dominio en Hostinger

### Opción 2: Node.js en Hostinger
1. Push a GitHub
2. Configura CI/CD en Hostinger
3. Apunta dominio al servidor

### Opción 3: Vercel / Netlify (Recomendado)
1. Conecta GitHub
2. Selecciona rama `main`
3. Build command: `npm run build`
4. Output: `dist`
5. Deploy automático

## 📈 Variables de Entorno

```env
# .env.local
VITE_API_URL=https://api.example.com
VITE_GA_ID=G-XXXXX
```

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Node version incompatible | Actualiza a 20.19+ o 22.12+ |
| Puerto 20413 ocupado | Vite usa automáticamente el siguiente |
| Estilos no cargan | Limpia `node_modules` y `dist`, reinstala |
| Build falla | Verifica `tsconfig.json` |

## 📞 Contacto

- **Email:** crissag@proton.me
- **GitHub:** [crissag01](https://github.com/crissag01)
- **LinkedIn:** [Cristofer Aguilar](https://www.linkedin.com/in/cristofer-aguilar-249694382/)

## 📄 Licencia

MIT License - Libre para usar y modificar

## 🎯 Roadmap

- [ ] Agregar más proyectos al portafolio
- [ ] Implementar blog con artículos
- [ ] Integrar formulario de contacto
- [ ] Dashboard de analytics
- [ ] Modo oscuro/claro selector
- [ ] Traducción a múltiples idiomas

## 🤝 Contribuciones

Las sugerencias y mejoras son bienvenidas. Para cambios mayores:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/improvement`)
3. Commit cambios (`git commit -m 'Add improvement'`)
4. Push a la rama (`git push origin feature/improvement`)
5. Abre un Pull Request

---

**Última actualización:** Junio 2026
**Versión:** 1.0.0
**Autor:** Cristofer Aguilar

# Portafolio
