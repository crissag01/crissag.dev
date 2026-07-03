# NAS Local - Gestor de Almacenamiento Personal

Sistema moderno de almacenamiento en red local. Sube, descarga, organiza y gestiona tus archivos desde una interfaz web intuitiva y responsive.

## 🎨 Características

- **Upload Drag & Drop:** Arrastra archivos para subirlos instantáneamente
- **Navegación Intuitiva:** Breadcrumbs y vistas de carpetas
- **Gestor de Archivos:** Descarga, elimina y organiza tus datos
- **Responsive Design:** Funciona perfectamente en desktop y mobile
- **Interfaz Moderna:** Tema púrpura y negro con animaciones suaves
- **API REST:** Backend completo con Express.js

## 🏗️ Stack Tecnológico

**Frontend:**
- React 19 + TypeScript
- Vite 8 (bundler)
- CSS3 moderno (sin dependencias)

**Backend:**
- Node.js + Express.js
- Multer (file uploads)
- CORS habilitado

## 📋 Requisitos Previos

- Node.js 20.19+
- npm 10+
- Espacio en disco disponible

## 🚀 Instalación y Ejecución

### 1. Clonar y entrar en la carpeta
```bash
cd crissag.dev/Proyectos/NAS-Local
```

### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend
```bash
cd ../frontend
npm install
```

### 4. Ejecutar Backend (terminal 1)
```bash
cd backend
npm run dev
# El servidor estará en http://localhost:3001
```

### 5. Ejecutar Frontend (terminal 2)
```bash
cd frontend
npm run dev
# La app estará en http://localhost:5173
```

## 📁 Estructura

```
NAS-Local/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileManager.tsx
│   │   │   ├── FileList.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── *.css
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── backend/
│   ├── server.js
│   ├── routes/ (para expandir)
│   └── package.json
├── storage/ (generado automáticamente)
└── README.md
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/files?path=/` | Listar archivos en ruta |
| POST | `/upload` | Subir archivos |
| GET | `/download?path=/file.txt` | Descargar archivo |
| DELETE | `/delete?path=/file.txt` | Eliminar archivo |
| GET | `/health` | Health check |

## 💾 Almacenamiento

Los archivos se almacenan en la carpeta `storage/` en el directorio raíz del proyecto.

**Estructura:**
```
NAS-Local/
└── storage/
    ├── Documentos/
    │   ├── file1.pdf
    │   └── file2.docx
    ├── Imágenes/
    │   └── photo.jpg
    └── Proyectos/
        └── proyecto1/
```

## 🔐 Seguridad

- ✅ Validación de rutas (previene path traversal)
- ✅ CORS habilitado (configurable)
- ✅ Multer con límites de archivo
- ✅ No se exponen rutas internas

## 🛠️ Desarrollo

### Build Frontend
```bash
cd frontend
npm run build
# Output en frontend/dist
```

### Ejecutar en Producción
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (servir dist/)
cd frontend
npm run build
# Usar un servidor estático para servir dist/
```

## 📊 Performance

- Interfaz responsive y rápida
- Uploads múltiples en paralelo
- Breadcrumbs para navegación eficiente
- Carga lazy de archivos

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Puerto 3001 ocupado | Cambia `PORT` en backend/server.js |
| Error CORS | Verifica que backend esté corriendo en 3001 |
| Archivos no se suben | Verifica permisos de carpeta `storage/` |
| Frontend no ve backend | Revisa `vite.config.ts` proxy |

## 📈 Próximas Mejoras

- [ ] Búsqueda y filtros
- [ ] Creación de carpetas
- [ ] Compresión (ZIP)
- [ ] Previsualizaciones de imágenes
- [ ] Historial de descargas
- [ ] Autenticación/usuarios
- [ ] Sincronización en nube
- [ ] Control de versiones

## 📝 Notas de Desarrollo

- Usa el proxy en `vite.config.ts` para desarrollo
- En producción, sirve frontend desde `/` y APIs desde `/api`
- La carpeta `storage/` puede crecer - considera backups
- No hay limite de tamaño configurado (añadir si es necesario)

## 🤝 Contribuciones

Las mejoras son bienvenidas. Para cambios:

1. Crea una rama (`git checkout -b feature/mejora`)
2. Commit cambios (`git commit -m 'Add mejora'`)
3. Push (`git push origin feature/mejora`)
4. Abre un Pull Request

## 📄 Licencia

MIT License - Libre para usar y modificar

---

**Versión:** 1.0.0
**Última actualización:** Junio 2026
**Autor:** Cristofer Aguilar

