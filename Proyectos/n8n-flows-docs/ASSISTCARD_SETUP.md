# ASSIST CARD - Guía de Instalación

Sistema automatizado para procesar cotizaciones de ASSIST CARD.

## Configuración Paso a Paso

### 1. Google Sheets
- Obtén el ID de tu Google Sheet (en la URL)
- Configura OAuth2 en n8n
- Especifica la hoja de trabajo y evento "rowAdded"

### 2. Gmail
- Usa las mismas credenciales OAuth2 que Google Sheets
- Configura la dirección de envío
- Personaliza la plantilla del email

### 3. Variables
- SHEET_ID: ID del Google Sheet
- SENDER_EMAIL: Tu email de envío
- LOGO_IMAGE_ID: ID de la imagen en Google Drive

### 4. Pruebas
1. Click en "Execute Workflow"
2. Agrega una fila de prueba al Google Sheet
3. Verifica que se procese correctamente
4. Revisa logs si hay errores

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Credenciales inválidas | Revalida OAuth2 en Settings |
| Sheet no encontrado | Verifica que el ID sea correcto |
| Email no enviado | Habilita Gmail API |

Versión: 2.0
Última actualización: Junio 2026
