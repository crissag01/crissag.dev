# ✅ CHECKLIST - Configuración Paso a Paso

## Sigue este checklist en orden para una configuración sin errores

---

## FASE 1: Dependencias (5 minutos)

- [ ] Abre terminal en la carpeta del proyecto
- [ ] Ejecuta: `npm install`
- [ ] Espera a que termine (verás carpeta `node_modules`)
- [ ] Verifica que no hay errores (sin lineas rojas)

**Comando**:
```bash
cd c:\Users\criss\Downloads\Dominio\crissag.dev
npm install
```

**Resultado esperado**:
```
added XXX packages, and audited XXX packages in Xs
up to date in Xs
```

---

## FASE 2: Configurar Archivo .env (10 minutos)

### Paso 1: Crear archivo .env
- [ ] Ve a la carpeta raíz del proyecto
- [ ] Copia el archivo `.env.example`
- [ ] Renómbra la copia a `.env`

**Comandos**:
```bash
# Desde PowerShell
Copy-Item .env.example .env

# O abre el archivo .env.example y guarda como .env
```

### Paso 2: Editar `.env` - Sección Email

**Para Gmail** (RECOMENDADO):

- [ ] Abre Google Account: https://myaccount.google.com/security
- [ ] En la barra lateral: **"App passwords"**
- [ ] Si no ves "App passwords":
  - [ ] Primero activa "2-Step Verification"
  - [ ] Luego vuelve a App passwords

- [ ] Selecciona:
  - Mail
  - Windows Computer

- [ ] Copia la contraseña de 16 caracteres
- [ ] En `.env`, actualiza:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=aaaa bbbb cccc dddd
SMTP_FROM=tu-email@gmail.com
CONTACT_EMAIL=tu-email@gmail.com
```

**Ej**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=cristofer.aguilar@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=cristofer.aguilar@gmail.com
CONTACT_EMAIL=crissag@proton.me
```

### Paso 3: Editar `.env` - Sección Cloudflare

**Pendiente**: Obtendrás estas claves en FASE 3

Por ahora deja como:
```env
CLOUDFLARE_TURNSTILE_SECRET=pendiente-fase-3
VITE_CLOUDFLARE_TURNSTILE_SITEKEY=pendiente-fase-3
```

### Paso 4: Verifica el archivo

- [ ] Abre `.env`
- [ ] Verifica que:
  - [ ] No hay comillas en valores (❌ `"hola"`, ✅ `hola`)
  - [ ] No hay espacios al inicio (❌ ` SMTP_HOST=`, ✅ `SMTP_HOST=`)
  - [ ] Las variables están presentes

---

## FASE 3: Configurar Cloudflare Turnstile (10 minutos)

### Paso 1: Crear Cuenta Cloudflare

- [ ] Ve a: https://dash.cloudflare.com
- [ ] Si no tienes cuenta: Sign Up (es gratis)
- [ ] Confirma tu email
- [ ] Inicia sesión

### Paso 2: Crear Site en Turnstile

- [ ] En el Dashboard de Cloudflare
- [ ] Barra lateral izquierda: **Security**
- [ ] Submenu: **Turnstile**
- [ ] Click en: **Create Site**

### Paso 3: Configurar Detalles

Completa el formulario:

```
Site name: crissag.dev
Domains: localhost, crissag.dev
Mode: Managed Challenge
```

- [ ] Site name: `crissag.dev`
- [ ] Click "+ Add domain"
- [ ] Agrega: `localhost` (para testing local)
- [ ] Click "+ Add domain" de nuevo
- [ ] Agrega: `crissag.dev` (para producción)
- [ ] Mode: **Managed Challenge** (default, bien)
- [ ] Click: **Create**

### Paso 4: Copiar Claves

Recibirás dos claves importantes:

```
Site Key: 1x00000000000000000000AA
Secret Key: 0x4AAAAAAA...
```

- [ ] **NO** cierres esta página
- [ ] Copia el "Site Key" (público, ok compartir)
- [ ] Copia el "Secret Key" (SECRETO, ⚠️ no compartir)

### Paso 5: Agregar a `.env`

En tu archivo `.env`, actualiza:

```env
CLOUDFLARE_TURNSTILE_SECRET=0x4AAAAAAA...
VITE_CLOUDFLARE_TURNSTILE_SITEKEY=1x00000000...
```

**Ejemplo completo de `.env` ahora**:
```env
PORT=3001
CORS_ORIGIN=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=aaaa bbbb cccc dddd
SMTP_FROM=tu-email@gmail.com
CONTACT_EMAIL=tu-email@gmail.com

CLOUDFLARE_TURNSTILE_SECRET=0x4AAAAAAA...
VITE_CLOUDFLARE_TURNSTILE_SITEKEY=1x00000000...
```

- [ ] Guarda el archivo

---

## FASE 4: Ejecutar el Proyecto (2 minutos)

### Paso 1: Inicia el desarrollo

- [ ] Terminal abierta en carpeta del proyecto
- [ ] Ejecuta: `npm run dev`

**Comando**:
```bash
npm run dev
```

**Deberías ver**:
```
✓ Server running on http://localhost:3001

  ✜  local:   http://localhost:20414
```

Ambas líneas significan que está funcionando ✅

### Paso 2: Espera un poco

- [ ] Espera 5-10 segundos
- [ ] El servidor inicializa assets

---

## FASE 5: Probar el Formulario (5 minutos)

### Paso 1: Abre el navegador

- [ ] Ve a: http://localhost:20414
- [ ] Espera a que cargue

### Paso 2: Navega a la sección Conectemos

- [ ] Desplázate hacia abajo
- [ ] Encuentra la sección "Conectemos"

### Paso 3: Verifica que todo está ahí

Deberías ver:
- [ ] Campo "Nombre"
- [ ] Campo "Email"
- [ ] Campo "Mensaje" (text area)
- [ ] **Widget de Cloudflare** (pequeño cuadrado gris/oscuro)
- [ ] Botón "Enviar Mensaje"

### Paso 4: Prueba el Formulario

- [ ] Llena:
  - [ ] Nombre: Tu nombre
  - [ ] Email: tu@email.com
  - [ ] Mensaje: Hola, este es un mensaje de prueba

- [ ] Verifica validación:
  - [ ] Si dejas campo en blanco → Error rojo
  - [ ] Si escribes email inválido → Error
  - [ ] Contador de caracteres en mensaje

### Paso 5: Completa el desafío Turnstile

- [ ] Verás un cuadro de Cloudflare
- [ ] Puede pedir:
  - [ ] Un simple click (si eres claramente humano)
  - [ ] Un desafío pequeño
- [ ] Complétalo

### Paso 6: Envía el Mensaje

- [ ] Click en "Enviar Mensaje"
- [ ] Deberías ver:
  - [ ] Botón se deshabilita
  - [ ] Spinner de carga
  - [ ] En 1-2 segundos: **Toast de éxito** (esquina inferior derecha)

**Mensaje de éxito**:
```
✓ Mensaje enviado correctamente. Te contactaremos pronto.
```

- [ ] ¡Éxito! El formulario funciona

### Paso 7: Verifica el Email

- [ ] Ve a tu email
- [ ] Busca en **Inbox** (o spam si está ahí)
- [ ] Deberías recibir un email con:
  - [ ] Asunto: "Nuevo contacto de [Tu nombre]"
  - [ ] Email del remitente: tu@email.com
  - [ ] Mensaje: Lo que escribiste

- [ ] ✅ ¡Email enviado correctamente!

---

## FASE 6: Validar Todas las Características (5 minutos)

### Test 1: Validación en Tiempo Real

- [ ] Llena "Nombre"
- [ ] Borra todo
- [ ] Verifica que aparece error rojo inmediato

### Test 2: Email Inválido

- [ ] Escribe "hola" en Email (sin @)
- [ ] Verifica error: "Email inválido"

### Test 3: Mensaje Muy Corto

- [ ] Escribe "a" en Mensaje
- [ ] Verifica error: "Debe tener al menos 10 caracteres"

### Test 4: Rate Limiting

- [ ] Llena y envía mensaje ✅
- [ ] Intenta de nuevo 6 veces
- [ ] La 6ta intento debería mostrar error:
  ```
  Demasiados intentos de contacto. Intenta más tarde.
  ```
- [ ] ✅ Rate limiting funciona

### Test 5: Honeypot (Anti-bot)

- [ ] (No necesitas hacer nada, está automático)
- [ ] El campo invisible "website" evita bots
- [ ] ✅ Los bots no pasarán

### Test 6: Mobile Responsive

- [ ] Abre DevTools: F12
- [ ] Haz click en icono de mobile (esquina superior izquierda)
- [ ] Prueba en iPhone/Android view
- [ ] Verifica que:
  - [ ] Campos son legibles
  - [ ] Widget de Turnstile se ve bien
  - [ ] Botón es clickeable
  - [ ] Toast aparece en mobile

---

## FASE 7: Verificar Archivos (3 minutos)

Verifica que todos los archivos nuevos están presentes:

```
En carpeta raíz:
- [ ] .env (tu archivo con config)
- [ ] .env.example (template)
- [ ] server.js (backend)
- [ ] SETUP_GUIA.md
- [ ] CLOUDFLARE_SETUP.md
- [ ] CONTACTO_CLOUDFLARE.md
- [ ] MEJORAS_COMPLETADAS.md
- [ ] RESUMEN_IMPLEMENTACION.md
- [ ] CHECKLIST_SETUP.md (este archivo)

En src/components:
- [ ] ContactForm.tsx (mejorado)
- [ ] ContactForm.css (mejorado)
- [ ] Toast.tsx (nuevo)
- [ ] Toast.css (nuevo)
```

- [ ] Todos presentes ✅

---

## FASE 8: Documentación Final (Lectura)

- [ ] Lee **RESUMEN_IMPLEMENTACION.md** (5 min)
- [ ] Lee **SETUP_GUIA.md** si necesitas referencia
- [ ] Guarda **CONTACTO_CLOUDFLARE.md** para contactar soporte

---

## 🎉 ¡COMPLETADO!

Si todas las fases están ✅, tu formulario está:

✅ Configurado  
✅ Seguro  
✅ Funcional  
✅ Listo para producción  

---

## 🆘 Si Algo Sale Mal

### El servidor no inicia
```
Error: Port 3001 already in use
```
**Solución**:
```bash
# Cambiar puerto en .env
PORT=3002

# O matar proceso en puerto 3001
netstat -ano | findstr :3001
taskkill /PID XXXX /F
```

### Widget no aparece
**Checklist**:
- [ ] `.env` tiene `VITE_CLOUDFLARE_TURNSTILE_SITEKEY`?
- [ ] Cloudflare dashboard tiene dominio "localhost" agregado?
- [ ] Hard refresh: `Ctrl+Shift+R`

### No recibo email
- [ ] Revisa carpeta spam
- [ ] Verifica `.env`: `CONTACT_EMAIL=...` es correcto?
- [ ] Verifica `SMTP_USER`, `SMTP_PASS` en `.env`
- [ ] Si Gmail: ¿usaste "App Password"?

### "Verification failed"
- [ ] Verifica `CLOUDFLARE_TURNSTILE_SECRET` en `.env`
- [ ] Reinicia servidor: `Ctrl+C` → `npm run dev`

---

## 📞 Contactar Soporte

Si tienes problemas con Cloudflare:
- Ver: **CONTACTO_CLOUDFLARE.md**
- Email: support@cloudflare.com
- Dashboard: https://dash.cloudflare.com → ? → Contact Support

---

## ✨ Resumen

| Fase | Tarea | Tiempo | Completado |
|------|-------|--------|-----------|
| 1 | npm install | 5 min | ☐ |
| 2 | Configurar .env | 10 min | ☐ |
| 3 | Cloudflare Turnstile | 10 min | ☐ |
| 4 | npm run dev | 2 min | ☐ |
| 5 | Probar formulario | 5 min | ☐ |
| 6 | Validar features | 5 min | ☐ |
| 7 | Verificar archivos | 3 min | ☐ |
| 8 | Leer documentación | 5 min | ☐ |

**Tiempo Total**: ~45 minutos

---

**¡Buena suerte!** 🚀

Si necesitas ayuda: Abre terminal y revisa los logs, o contacta a soporte de Cloudflare.

**Última actualización**: 2026-07-04
