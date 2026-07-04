# 📞 Guía de Contacto Cloudflare

## Métodos de Contacto Directo

### 1️⃣ **Dashboard Support** (RECOMENDADO)
**Para qué**: Soporte técnico, problemas con Turnstile, configuración  
**Cómo acceder**:
1. Inicia sesión en https://dash.cloudflare.com
2. Esquina inferior derecha → **?** (signo de interrogación)
3. Click en **"Contact Support"**
4. Selecciona el tipo de problema
5. Describe tu caso detalladamente

**Tiempo de respuesta**: 24-48 horas (según plan)

---

### 2️⃣ **Email de Soporte General**
```
support@cloudflare.com
```

**Asunto recomendado**:
```
[URGENT] Problema con Turnstile en crissag.dev
o
[SECURITY] Consulta sobre integración de Cloudflare
```

**Información a incluir**:
- Tu Zone ID (en Dashboard → Overview)
- Descripción del problema
- Pasos para reproducir
- Screenshots/logs si aplica

---

### 3️⃣ **Contacto de Ventas**
**Para qué**: Planes pagos, servicios enterprise, WAF personalizado  
**Link**: https://www.cloudflare.com/en-gb/contact-sales/

**Servicios disponibles**:
- Cloudflare Pro/Business/Enterprise
- DDoS Protection avanzado
- WAF (Web Application Firewall)
- Bot Management
- Page Rules
- Workers (Serverless)

---

### 4️⃣ **Community Forum**
**Para qué**: Preguntas generales, tips, aprender de otros usuarios  
**Link**: https://community.cloudflare.com/

**Beneficios**:
- Respuestas de comunidad experta
- Gratis
- Búsqueda de problemas comunes
- Tips y mejores prácticas

---

### 5️⃣ **Slack Support** (Planes Pagos)
**Requisito**: Plan Business o superior

**Cómo acceder**:
1. Dashboard → Support
2. Si tienes plan pagado: opción de "Slack channel"
3. Conecta tu workspace de Slack

**Ventaja**: Soporte 24/7 directo en Slack

---

### 6️⃣ **Twitter/X**
**Cuenta**: [@Cloudflare](https://twitter.com/Cloudflare)

**Para qué**: Problemas urgentes, bugs reportados públicamente  
**Cómo**:
1. Tweet describiendo tu problema
2. Mención a @Cloudflare
3. Proporciona zona ID y detalles
4. Team de Cloudflare responde (a veces rápido)

---

### 7️⃣ **Teléfono** (Enterprise)
```
+1-650-319-8930 (EE.UU.)
+44-20-3319-0000 (UK)
```

**Nota**: Solo para cuentas Enterprise con contrato

---

## 🆘 ¿Qué Contactar a Cloudflare?

### ✅ Casos donde SÍ contactar:

1. **Problemas de Seguridad**
   - Sospecha de ataque DDoS
   - Comportamiento anómalo en Turnstile
   - Acceso no autorizado

2. **Problemas Técnicos**
   - Turnstile no funciona
   - Errores 5xx
   - Certificados SSL rotos

3. **Configuración**
   - No entiendo cómo configurar WAF
   - Necesito Custom Rules
   - Rate limiting personalizado

4. **Upgrade/Planes**
   - Necesito características enterprise
   - Consulta sobre precios
   - Cambio de plan

---

### ❌ Casos donde NO contactar (Usar Docs)

1. Preguntas básicas: Ver [Docs de Turnstile](https://developers.cloudflare.com/turnstile/)
2. Errores comunes: Buscar en [Community](https://community.cloudflare.com/)
3. API usage: Ver [API Docs](https://api.cloudflare.com/)
4. Troubleshooting: Revisar [Status Page](https://www.cloudflarestatus.com/)

---

## 📋 Template de Email para Contacto

```
Asunto: [Turnstile] Problema con verificación en crissag.dev

Cuerpo:

Hola equipo de Cloudflare,

Soy Cristofer Aguilar, desarrollador de crissag.dev.

PROBLEMA:
[Descripción clara del problema]

ZONA ID:
[Tu zone ID]

PASOS PARA REPRODUCIR:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

INFORMACIÓN TÉCNICA:
- Navegador: Chrome 126
- OS: Windows 11
- Turnstile Status: [Working/Error]
- Error en Console: [Error message si aplica]

CONTEXTO ADICIONAL:
[Logs, screenshots, información adicional]

URGENCIA:
[ ] Baja - Es un problema menor
[ ] Media - Afecta algunos usuarios
[x] Alta - Formulario de contacto está roto
[ ] Crítica - Sitio completamente inoperante

Gracias,
Cristofer Aguilar
crissag@proton.me
https://crissag.dev
```

---

## 🔍 Servicios de Seguridad Específicos

### Si necesitas más seguridad:

#### 1. **DDoS Protection**
- **Qué es**: Protección contra ataques distribuidos
- **Contacto**: Dashboard → Security → DDoS
- **Costo**: Incluido en todos los planes
- **Configuración**: Automática (con ajustes manuales)

#### 2. **Web Application Firewall (WAF)**
- **Qué es**: Reglas para bloquear malware, SQL injection, etc.
- **Contacto**: Dashboard → Security → WAF
- **Costo**: Pro plan ($20/mes) o superior
- **Configuración**: Pre-built rules o custom

#### 3. **Bot Management**
- **Qué es**: Identifica y bloquea bots maliciosos
- **Contacto**: Sales → bot-management@cloudflare.com
- **Costo**: Enterprise plan
- **Complementa**: Turnstile para formularios

#### 4. **Page Rules**
- **Qué es**: Control granular de caché y comportamiento
- **Contacto**: Dashboard → Rules → Page Rules
- **Costo**: Gratis (limitado) o pagado (ilimitado)
- **Ejemplo**: Cache agresivo, bloquear IPs específicas

#### 5. **Email Routing**
- **Qué es**: Redirige emails usando tu dominio
- **Contacto**: Dashboard → Email → Email Routing
- **Costo**: Gratis hasta 100/mes
- **Útil para**: Recibir contactos en email protegido

---

## 🎯 Servicio Específico para tu Caso: Turnstile

### ¿Por qué Turnstile?
✅ No es intrusivo (no requiere CAPTCHA visual siempre)  
✅ Mantiene a bots alejados  
✅ Amigable con usuarios reales  
✅ Funciona offline  

### Si necesitas Turnstile avanzado:
- **Contacto**: [Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- **Soporte técnico**: support@cloudflare.com
- **Plan**: Gratuito con uso razonable

---

## 📊 Matriz de Contacto

| Problema | Mejor Método | Tiempo | Requiere Plan |
|----------|-------------|--------|---------------|
| Pregunta técnica | Community | 1-24h | No |
| Bugge técnico | Dashboard Support | 24-48h | Sí* |
| Problema urgente | Email/Twitter | 1-4h | No |
| Necesito features | Sales | 1-3 días | Sí |
| Enterprise | Phone | 24h | Sí |
| Seguridad crítica | support@cloudflare.com | ASAP | No |

*Plan gratuito tiene soporte limitado

---

## 🚀 Escalación

Si tu problema no se resuelve:

1. **Recopilar evidencia**
   - Logs completos
   - Screenshots
   - Pasos exactos
   - Frequency (¿siempre pasa?)

2. **Contactar de nuevo**
   - Referencia a ticket anterior
   - Información adicional
   - Urgencia claramente marcada

3. **Escalación**
   - Si es crítico: mention @Cloudflare en Twitter
   - Comunidad: preguntar a mods
   - Email: CC a otros contactos (si aplica)

---

## 💡 Consejos

✅ **Siempre incluye**:
- Zone ID
- Dominio
- Descripción clara
- Pasos exactos
- Información técnica

❌ **Nunca incluyas**:
- Secret keys (nunca)
- Contraseñas
- Datos sensibles de usuarios

🔐 **Protección**:
- Si compartir información sensible: Usa ticket privado
- No postees secrets en Community
- Use encrypted email si es muy importante

---

**Última actualización**: 2026-07-04  
**URL de referencia**: https://support.cloudflare.com/
