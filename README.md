# Proyectos

Rama dedicada únicamente al código fuente y documentación de los proyectos de práctica que aparecen referenciados en el portafolio ([crissag.dev](https://crissag.dev), rama `main`). No contiene el sitio web — solo el material de origen de cada proyecto.

## Estructura

```
Proyectos/
├── Flujos n8n/              # Workflows de n8n exportados (.json)
├── n8n-flows-docs/          # Documentación de cada workflow de n8n
├── NAS-Local/                # Servidor NAS casero (Node.js/Express + frontend)
├── Organizador de Finanzas Python/   # App de finanzas personales (Python + frontend)
├── Wallpaper Engine/         # Scripts de automatización para Wallpaper Engine
└── *.md                      # Material comercial (propuestas, checklists, presupuestos)
```

### `Flujos n8n/` + `n8n-flows-docs/`

Workflows de n8n listos para importar, con su documentación de setup:

- **ASSIST CARD** — automatización de cotizaciones (`ASSISTCARD 1 (Recepcion) v2*.json`)
- **Facturas** — distribución por Telegram y WhatsApp (`Facturas (Telegram|Whatsapp)*.json`)
- **Bitácora (WhatsApp)** — registro de eventos (`Bitacora (Whatsapp).json`)
- **Organizador de Métricas** — centralización de datos (`Organizador de metricas y respuestas*.json`)

Docs de cada uno (setup, mejores prácticas) en `n8n-flows-docs/`.

### `NAS-Local/`

Servidor NAS personal con interfaz web (upload, gestión de archivos, breadcrumbs). Backend en Node.js/Express (`backend/`), frontend en React/TypeScript (`frontend/`). Ver `NAS-Local/README.md` para instalación.

### `Organizador de Finanzas Python/`

App de finanzas personales (ingresos, gastos, tarjetas, comprobantes). Backend en Python (`backend/`), frontend estático (`frontend/`). Ver `Organizador de Finanzas Python/README.md` para instalación.

### `Wallpaper Engine/`

Scripts de automatización e interactividad para Wallpaper Engine (`wallpaper.py`, `start.bat`).

### Archivos sueltos

Material comercial/de ventas usado para los proyectos de cliente (presupuestos, checklist de llamadas de discovery, templates de propuesta) — no son código.

---

**Autor:** Cristofer Aguilar
