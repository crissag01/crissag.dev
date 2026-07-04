# 🚀 Guía de Configuración Completa - Formulario de Contacto Mejorado

## ¿Qué Cambió?

Se ha transformado el formulario de contacto de una solución simple basada en `mailto:` a un sistema completo de contacto seguro con:

✅ Backend Node.js/Express  
✅ Cloudflare Turnstile (CAPTCHA moderno)  
✅ Rate Limiting (5 mensajes por 15 minutos)  
✅ Validación en tiempo real  
✅ Componente Toast para feedback  
✅ Honeypot spam protection  
✅ Sanitización de entrada  
✅ Envío de emails real  
✅ Mejores estilos y accesibilidad  

---

## 📋 Pasos de Configuración (IMPORTANTE)

### 1️⃣ Instalar Dependencias

```bash
npm install
```

Esto instala:
- `express` - Framework backend
- `nodemailer` - Envío de emails
- `express-rate-limit` - Rate limiting
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Variables de entorno
- `concurrently` - Ejecutar múltiples procesos

### 2️⃣ Crear Archivo `.env`

Copia el contenido de `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

Luego edita `.env` con tus valores:

```env
# Backend
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Email (opción 1: Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-app
SMTP_FROM=tu-email@gmail.com
CONTACT_EMAIL=donde-recibir-emails@gmail.com

# Cloudflare Turnstile (obtén en https://dash.cloudflare.com)
CLOUDFLARE_TURNSTILE_SECRET=0x4AAAAAAA...
VITE_CLOUDFLARE_TURNSTILE_SITEKEY=1x00000000...
```

### 3️⃣ Configurar Email (Gmail)

#### Opción A: Gmail con App Password (RECOMENDADO)

1. Abre: https://myaccount.google.com/security
2. Habilita: **Two-Step Verification**
3. Ve a: **App passwords**
4. Selecciona: Mail + Windows Computer
5. Copia la contraseña de 16 caracteres
6. Pégala en `.env` como `SMTP_PASS`

#### Opción B: Otros proveedores

- **SendGrid**: https://sendgrid.com (SMTP credentials)
- **Resend**: https://resend.com (Python SDK)
- **Mailtrap**: https://mailtrap.io (Testing)

### 4️⃣ Configurar Cloudflare Turnstile

1. Ve a: https://dash.cloudflare.com
2. Sign up / Login
3. Security → Turnstile
4. **Create Site**
5. Nombre: `crissag.dev`
6. Dominios: `localhost`, `crissag.dev`
7. Copia las claves a `.env`:
   - `CLOUDFLARE_TURNSTILE_SECRET` (secret key)
   - `VITE_CLOUDFLARE_TURNSTILE_SITEKEY` (site key)

### 5️⃣ Ejecutar el Proyecto

```bash
npm run dev
```

Esto abre **DOS procesos simultáneamente**:
- Frontend Vite: http://localhost:20414
- Backend Express: http://localhost:3001

Deberías ver en la terminal:
```
✓ Server running on http://localhost:3001
  ✜  local:   http://localhost:20414
```

### 6️⃣ Probar el Formulario

1. Ve a: http://localhost:20414
2. Desplázate a **"Conectemos"**
3. Deberías ver:
   - Campo Nombre (con indicador *)
   - Campo Email (con indicador *)
   - Campo Mensaje (con contador de caracteres)
   - **Widget de Cloudflare Turnstile** (pequeño en la esquina)
   - Botón "Enviar Mensaje"

4. Llena el formulario
5. Completa el desafío de Turnstile
6. Haz clic en **"Enviar Mensaje"**
7. Deberías ver un **Toast de éxito** (esquina inferior derecha)
8. Revisa tu email para confirmar

---

## 🔐 Seguridad Implementada

### ✅ Protección contra Bots
- **Cloudflare Turnstile**: Verifica que eres humano
- **Honeypot Field**: Campo invisible que los bots llenan
- **Rate Limiting**: Máx 5 mensajes por usuario cada 15 minutos

### ✅ Validación
- **Servidor**: Valida todo antes de procesar
- **Cliente**: Feedback inmediato al usuario
- **Email**: Regex validation antes de enviar
- **Sanitización**: Quita caracteres peligrosos

### ✅ Privacidad
- `.env` no se sube a Git (ver `.gitignore`)
- Secrets nunca en código fuente
- CORS configurable
- Rate limiting por IP

---

## 📁 Archivos Nuevos/Modificados

### Nuevos archivos:
```
src/components/
  ├── ContactForm.tsx (mejorado)
  ├── ContactForm.css (mejorado)
  ├── Toast.tsx (nuevo)
  └── Toast.css (nuevo)

server.js (nuevo - backend)
.env.example (nuevo)
CLOUDFLARE_SETUP.md (nuevo)
```

### Modificados:
```
package.json (nuevas dependencias + scripts)
vite.config.ts (proxy a backend)
src/App.tsx (usa Toast)
src/App.css (limpiado)
.gitignore (ignora .env)
```

---

## 🧪 Estructura del Flujo

```
Usuario rellena formulario
        ↓
Validación client-side (tiempo real)
        ↓
Completa desafío Cloudflare Turnstile
        ↓
Click "Enviar Mensaje"
        ↓
POST /api/contact (backend)
        ↓
Verifica token Turnstile
        ↓
Rate limiting (5 por 15 min)
        ↓
Sanitización de entrada
        ↓
Validación servidor
        ↓
Envío email via SMTP
        ↓
Toast de éxito al usuario
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
```bash
npm install
```

### Widget Turnstile no aparece
1. Verifica que `.env` contiene `VITE_CLOUDFLARE_TURNSTILE_SITEKEY`
2. Reinicia: `Ctrl+C` → `npm run dev`
3. Hard refresh: `Ctrl+Shift+R`

### Error: "Verification failed"
1. Verifica `CLOUDFLARE_TURNSTILE_SECRET` en `.env`
2. El sitio debe estar registrado en https://dash.cloudflare.com

### No recibo emails
1. Verifica `.env`: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
2. Si es Gmail: Usa "App Password", no contraseña normal
3. Revisa spam/promotiones
4. Verifica que `CONTACT_EMAIL` es correcto

### Server no inicia
```bash
# Verificar que puerto 3001 está libre
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows
```

---

## 🚢 Deploy (Producción)

### En Vercel/Netlify (Frontend)
```bash
npm run build
# Deploy la carpeta dist/
```

### Backend (opciones)
1. **Railway.app** - Gratis hasta $5/mes
2. **Heroku** - Gratis con limitaciones
3. **AWS EC2** - Más control
4. **tu servidor** - VPS propio

### Variables de Entorno en Producción

En tu plataforma de hosting, configura:
```
CORS_ORIGIN=https://crissag.dev
SMTP_HOST=...
CLOUDFLARE_TURNSTILE_SECRET=...
```

---

## 📞 Contactar Soporte

Ver **CLOUDFLARE_SETUP.md** para:
- Detalles de Cloudflare Turnstile
- Cómo contactar a Cloudflare
- Servicios de seguridad adicionales
- Mejores prácticas

---

## 📊 Resumen de Mejoras

| Aspecto | Antes | Después |
|---------|-------|---------|
| Envío | mailto: (no real) | Email real via SMTP |
| Seguridad | Ninguna | Turnstile + Rate limit |
| Validación | HTML básica | Tiempo real + Server |
| Feedback | Nada claro | Toast de éxito/error |
| Spam | Vulnerable | Protegido con Turnstile |
| UX | Botones solamente | Formulario completo |
| Accesibilidad | Básica | Mejorada (aria-labels) |

---

**¿Dudas?** Revisa los archivos:
- `CLOUDFLARE_SETUP.md` - Configuración Cloudflare
- `server.js` - Lógica del backend
- `src/components/ContactForm.tsx` - Lógica frontend

**¡Listo para usar!** 🎉
