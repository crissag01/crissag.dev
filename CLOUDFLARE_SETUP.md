# Guía de Configuración Cloudflare y Seguridad

## 🔐 Cloudflare Turnstile (CAPTCHA alternativo)

Cloudflare Turnstile es una solución de verificación de seguridad moderna y amigable con el usuario que reemplaza a reCAPTCHA.

### 1. Obtener Claves de Turnstile

#### Paso 1: Ir al Dashboard de Cloudflare
1. Accede a [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Inicia sesión con tu cuenta de Cloudflare (crea una si no tienes)

#### Paso 2: Navegar a Turnstile
1. En la barra lateral, ve a **Security** → **Turnstile**
2. Haz clic en **Create Site**

#### Paso 3: Configurar Sitio
```
Nombre del Sitio: crissag.dev (o tu dominio)
Dominios: localhost, crissag.dev (agregar todos los dominios)
Modo: Managed Challenge (recomendado)
```

#### Paso 4: Copiar Claves
Recibirás dos claves:
- **Site Key**: Para el frontend (visible)
- **Secret Key**: Para el backend (NUNCA compartir)

### 2. Configurar Variables de Entorno

#### En `.env` (local):
```env
# Frontend (público)
VITE_CLOUDFLARE_TURNSTILE_SITEKEY=1x00000000000000000000AA

# Backend (secreto)
CLOUDFLARE_TURNSTILE_SECRET=0x4AAAAAAFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
```

#### En `.env.example` (para compartir):
```env
VITE_CLOUDFLARE_TURNSTILE_SITEKEY=tu-site-key
CLOUDFLARE_TURNSTILE_SECRET=tu-secret-key
```

### 3. Verificar Instalación

1. Inicia el servidor: `npm run dev`
2. Ve a http://localhost:20414
3. Desplázate a "Conectemos"
4. Deberías ver el widget de Turnstile (pequeño checkbox en la esquina inferior derecha)
5. Completa el desafío y envía el formulario

---

## 📞 Contactar a Cloudflare para Servicios Adicionales

### Canales de Contacto Oficiales

#### 1. **Dashboard Support (Recomendado)**
- Panel: https://dash.cloudflare.com
- Inferior derecho: Click en **?** → **Contact Support**
- Requiere estar logueado
- Mejor para: Soporte técnico, preguntas específicas

#### 2. **Email de Soporte**
```
support@cloudflare.com
```

#### 3. **Formulario de Contacto General**
https://www.cloudflare.com/en-gb/contact-sales/

### Servicios de Seguridad Disponibles

#### 🛡️ **Protección DDoS**
- **Cloudflare DDoS Protection**: Protección contra ataques distribuidos
- Contacto: Support → Describe tu caso

#### 🔍 **Web Application Firewall (WAF)**
- Reglas personalizadas para bloquear amenazas
- Protección contra OWASP Top 10
- Contacto: https://www.cloudflare.com/en-gb/waf/

#### 🔐 **Security Scorecard**
- Auditoría de seguridad de tu sitio
- Contacto: https://dash.cloudflare.com → Security → Scorecard

#### 🌍 **Bot Management**
- Detecta y bloquea bots maliciosos
- Complementa Turnstile para formularios
- Contacto: Sales → Bot Management

#### 📝 **Page Rules & Advanced Rules**
- Control granular de caché y comportamiento
- Protección de rutas específicas
- Disponible en: Dashboard → Rules

### Pasos para Contactar Soporte Premium

Si necesitas soporte prioritario:

1. **Planes pagos**: Accede a Dashboard → Support → Upgrade to get 24/7 support
2. **Enterprise**: Contacta a sales@cloudflare.com
3. **Emergencias**: +1-650-319-8930 (números de emergencia)

---

## 🔧 Integración Completa en tu Portafolio

### Backend (Node.js/Express)

Tu servidor ya verifica Turnstile:

```javascript
// server.js línea 37-50
async function verifyCloudflareTurnstile(token) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: JSON.stringify({
      secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
      response: token,
    })
  })
  const data = await response.json()
  return data.success && data.score > 0.5
}
```

### Frontend (React)

El componente ContactForm.tsx:
- Carga el script de Turnstile automáticamente
- Renderiza el widget
- Captura el token
- Envía al backend para verificación

---

## 🚀 Mejores Prácticas de Seguridad

### Implementado en tu proyecto:

✅ **Verificación Turnstile**
- Bloquea bots automáticamente
- No requiere CAPTCHA visual para humanos reales

✅ **Rate Limiting**
- 5 contactos por usuario cada 15 minutos
- Previene spam masivo

✅ **Validación del Lado del Servidor**
- Sanitización de entrada
- Validación de email
- Límites de longitud

✅ **Honeypot Field**
- Campo invisible "website"
- Los bots lo llenan, humanos no

✅ **Variables de Entorno**
- Secrets no en código fuente
- SMTP protegido
- API keys protegidas

### Recomendaciones Adicionales:

1. **Usar Cloudflare como DNS**
   - Registra tus dominios en Cloudflare
   - Aprovecha protecciones automáticas
   - Dashboard: https://dash.cloudflare.com

2. **Habilitar Security Headers**
   - En Dashboard → Rules → Transform Rules
   - Agrega headers como X-Frame-Options, CSP

3. **Monitorear Intentos Fallidos**
   - Dashboard → Analytics & Logs
   - Identifica patrones de ataque

4. **Backup de Emails de Contacto**
   - Implementar base de datos para histórico
   - Permite auditoria posterior

---

## 📋 Checklist de Configuración

- [ ] Crear cuenta en https://dash.cloudflare.com
- [ ] Ir a Security → Turnstile → Create Site
- [ ] Copiar Site Key y Secret Key
- [ ] Crear archivo `.env` con las claves
- [ ] Configurar variables SMTP en `.env`
- [ ] Ejecutar `npm install` para instalar dependencias
- [ ] Ejecutar `npm run dev` (inicia server.js + vite)
- [ ] Probar formulario en http://localhost:20414
- [ ] Verificar widget de Turnstile aparece
- [ ] Enviar mensaje de prueba
- [ ] Verificar email recibido

---

## 🆘 Troubleshooting

### El widget de Turnstile no aparece
**Solución:**
```bash
# Verificar que VITE_CLOUDFLARE_TURNSTILE_SITEKEY está en .env
echo $VITE_CLOUDFLARE_TURNSTILE_SITEKEY

# Reiniciar servidor
npm run dev
```

### Error: "Verificación de seguridad fallida"
**Solución:**
1. Verificar que CLOUDFLARE_TURNSTILE_SECRET es correcto en `.env`
2. Verificar que el dominio está configurado en Turnstile dashboard
3. Revisar logs del servidor: `node server.js`

### No recibo emails
**Solución:**
1. Verificar SMTP_HOST, SMTP_USER, SMTP_PASS en `.env`
2. Si usas Gmail: Necesitas "App Password" no contraseña normal
3. Verificar que CONTACT_EMAIL es correcto
4. Revisar carpeta de spam

### Rate limit rechaza todos los mensajes
**Solución:**
- Esperar 15 minutos (ventana de rate limiting)
- O cambiar IP de prueba

---

## 📚 Recursos

- [Documentación Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [Dashboard Cloudflare](https://dash.cloudflare.com)
- [Blog de Seguridad](https://blog.cloudflare.com/security/)
- [Community](https://community.cloudflare.com/)

---

**Última actualización:** 2026-07-04
**Versión:** 1.0
