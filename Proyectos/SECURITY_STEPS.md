# 🔒 Pasos para Arreglar Seguridad en n8n

## TL;DR
Tu flujo de Facturas tiene un token de API expuesto. Necesitas:
1. Crear una variable de entorno en n8n
2. Actualizar 6 nodos (3 en Telegram, 3 en WhatsApp)
3. Guardar y hacer test

**Tiempo estimado:** 10 minutos

---

## PASO 1: Crear Variable de Entorno en n8n

1. **Abre n8n** → Ve a **Settings** (⚙️)
2. **Selecciona "Environment Variables"**
3. Haz clic en **"Add Variable"**
4. Completa:
   - **Name:** `LLAMAINDEX_API_KEY`
   - **Value:** `llx-Ot21EmLRuAytVXAld3PB8yTGYYKVFGIGoKOW3hFp2GQ7JnQI`
5. **Save**

**Nota:** Después de esto, regenera el token en LlamaIndex para máxima seguridad.

---

## PASO 2A: Actualizar Flujo "Facturas (Telegram)"

1. Abre el flujo **"Facturas (Telegram)"**
2. Busca y abre estos 3 nodos:
   - ✏️ **"Subir archivo"** (POST request)
   - ✏️ **"Obtener info"** (GET request)
   - ✏️ **"Descargar info"** (GET result)

3. **En cada nodo:**
   - Click en **"Headers"** (parte superior)
   - Busca el campo **Authorization**
   - **ANTES:** `Bearer llx-Ot21EmLRuAytVXAld3PB8yTGYYKVFGIGoKOW3hFp2GQ7JnQI`
   - **DESPUÉS:** `Bearer {{ $env.LLAMAINDEX_API_KEY }}`
   - **Save** (Ctrl+S)

---

## PASO 2B: Actualizar Flujo "Facturas (Whatsapp)"

Repite el **PASO 2A** pero en el flujo **"Facturas (Whatsapp)"**
- 3 nodos para actualizar (mismo que Telegram)
- Mismo token a reemplazar

---

## PASO 3: Verificar que Funciona

1. En **Facturas (Telegram)**:
   - Click en **"Listen for webhook"** o **"Execute workflow"**
   - Envía un PDF de prueba por Telegram
   - Verifica que se procese correctamente

2. En **Facturas (Whatsapp)**:
   - Envía un PDF de prueba por WhatsApp
   - Verifica que se procese correctamente

---

## PASO 4: Exportar Flujos Corregidos

Ahora que están arreglados en n8n:

1. Abre **Facturas (Telegram)**
2. Click en **⋯ (menu)** → **Download**
3. Guarda como `Facturas (Telegram).json` (sobrescribiendo el viejo)
4. Repite para **Facturas (Whatsapp)**

---

## ✅ CHECKLIST FINAL

- [ ] Variable de entorno `LLAMAINDEX_API_KEY` creada en n8n
- [ ] 3 nodos en Telegram actualizados con `{{ $env.LLAMAINDEX_API_KEY }}`
- [ ] 3 nodos en WhatsApp actualizados con `{{ $env.LLAMAINDEX_API_KEY }}`
- [ ] Test run exitoso en ambos flujos
- [ ] Flujos guardados/exportados nuevamente
- [ ] Token LlamaIndex regenerado (opcional pero recomendado)

---

## 🚨 IMPORTANTE

**No uses los archivos JSON originales en GitHub/Portafolio si todavía tienen el token visible.**

**Ya hay dos archivos preparados:**
- `Facturas (Telegram) - FIXED.json`
- `Facturas (Whatsapp) - FIXED.json`

Estos ya tienen `{{ $env.LLAMAINDEX_API_KEY }}` en lugar del token real.

Puedes usarlos como referencia si algo no sale bien.

---

## ¿Preguntas?

Si algo no funciona:
1. Verifica que la variable de entorno esté creada
2. Verifica que escribiste exactamente: `{{ $env.LLAMAINDEX_API_KEY }}`
3. Reinicia el navegador/n8n
4. Intenta hacer test nuevamente
