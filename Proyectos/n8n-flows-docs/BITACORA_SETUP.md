# Bitácora WhatsApp - Guía de Configuración

Sistema de logging y registro de eventos en tiempo real.

## Requisitos

- WhatsApp API Key o Telegram Bot Token
- Webhook URL para recibir eventos

## Setup Básico

1. Configura Webhook en n8n
2. Obtén la URL del webhook
3. Integra con tus aplicaciones
4. Personaliza los mensajes

## Casos de Uso

- Notificaciones de pagos
- Alertas de errores
- Registro de cambios
- Auditoría de accesos

## Formato de Evento

```json
{
  "event": "payment_received",
  "user": "Cliente A",
  "amount": 500,
  "severity": "info"
}
```

Versión: 1.0
Última actualización: Junio 2026
