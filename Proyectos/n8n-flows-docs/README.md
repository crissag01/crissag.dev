# n8n Workflows - Automatizaciones Profesionales

Colección de flujos n8n listos para producción y altamente personalizables.

## 📋 Flujos Disponibles

### 1. ASSIST CARD - Automatización de Cotizaciones
- **Descripción:** Sistema completo para procesar cotizaciones de ASSIST CARD
- **Características:** Lectura automática, validación, generación de PDFs, envío por email
- **Archivo:** `ASSISTCARD 1 (Recepcion) v2 optimizado.json`

### 2. Automatización de Facturas
- **Telegram:** `Facturas (Telegram).json`
- **WhatsApp:** `Facturas (Whatsapp).json`

### 3. Bitácora WhatsApp
- **Archivo:** `Bitacora (Whatsapp).json`

### 4. Organizador de Métricas
- **Archivo:** `Organizador de metricas y respuestas (Apr 8 at 20_57_20).json`

## 🚀 Requisitos

- n8n v1.0+
- Google Sheets OAuth2
- Gmail OAuth2
- Telegram Bot Token (opcional)
- WhatsApp API Key (opcional)

## 📝 Instalación

1. Importa el archivo JSON en n8n Dashboard
2. Configura las credenciales en Settings
3. Actualiza IDs de documentos y variables
4. Testea con datos de prueba
5. Activa el flujo

## 🔐 Seguridad

- Credenciales se configuran en n8n, NO en archivos JSON
- Rota tokens cada 90 días
- Usa contraseñas fuertes
- Revisa logs regularmente

## 📊 Monitoreo

- Verifica tab "Executions" para historial
- Los errores se capturan automáticamente
- Performance optimizado para 100-1000 registros/ejecución

---

**Versión:** 2.0 (Optimizado)
**Autor:** Cristofer Aguilar
**Email:** crissag@proton.me
**Última actualización:** Junio 2026
