# Automatización de Facturas - Guía de Instalación

Suite de flujos para generar y distribuir facturas automáticamente.

## Flujos Disponibles

### Facturas (Telegram)
- Distribución por Telegram Bot
- Requisitos: Telegram Bot Token, Chat IDs

### Facturas (WhatsApp)
- Distribución por WhatsApp Business API
- Requisitos: WhatsApp API Key, Números de teléfono

## Configuración Telegram

1. Chat con @BotFather en Telegram
2. Comando: `/newbot`
3. Sigue las instrucciones para crear el bot
4. Copia el Token proporcionado
5. En n8n: Credentials > Telegram Bot > Pega Token

## Configuración WhatsApp

1. Ve a https://developers.facebook.com
2. Crea una aplicación
3. Configura WhatsApp Business
4. Obtén el Access Token
5. En n8n: Credentials > WhatsApp > Pega Token

## Variables Necesarias

```json
{
  "client_name": "Nombre Cliente",
  "email": "cliente@example.com",
  "phone": "+1234567890",
  "invoice_number": "INV-001",
  "amount": 1000
}
```

## Seguridad

- Credenciales en n8n, no en archivos
- Números de teléfono encriptados
- PDFs temporales se eliminan
- Rate limiting habilitado

Versión: 1.0
Última actualización: Junio 2026
