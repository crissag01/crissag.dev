# 🔒 Arreglo de Seguridad - Tokens Expuestos

## Problema
Los flujos de n8n `Facturas (Telegram)` y `Facturas (Whatsapp)` tienen el token de LlamaIndex hardcodeado en plain text.

**Tokens encontrados:**
- LlamaIndex: `llx-Ot21EmLRuAytVXAld3PB8yTGYYKVFGIGoKOW3hFp2GQ7JnQI` (3 instancias por archivo)

---

## ✅ Solución en n8n

### Paso 1: Crear Variables de Entorno en n8n

1. Ve a **Settings > Environment Variables**
2. Haz clic en **Add Environment Variable**
3. Crea estas variables:

```
LLAMAINDEX_API_KEY = llx-Ot21EmLRuAytVXAld3PB8yTGYYKVFGIGoKOW3hFp2GQ7JnQI
```

### Paso 2: Reemplazar en cada nodo HTTP

En `Facturas (Telegram)` y `Facturas (Whatsapp)`:

**Nodos a modificar:**
1. "Subir archivo" (POST upload)
2. "Obtener info" (GET job status)
3. "Obtener resultado" (GET result/markdown)

**En cada nodo:**

**ANTES:**
```json
{
  "name": "Authorization",
  "value": "Bearer llx-Ot21EmLRuAytVXAld3PB8yTGYYKVFGIGoKOW3hFp2GQ7JnQI"
}
```

**DESPUÉS:**
```json
{
  "name": "Authorization",
  "value": "Bearer {{ $env.LLAMAINDEX_API_KEY }}"
}
```

### Paso 3: Verificar y Guardar

1. Haz un test run de cada flujo
2. Verifica que siga funcionando
3. Guarda los cambios

---

## 🔐 Mejora Adicional: Credenciales de n8n

Si es posible, crea credenciales en n8n en lugar de usar HTTP directo:

1. **Settings > Credentials**
2. **Add Credential > Generic Credential Type**
3. Configure como:
   - **Name:** `LlamaIndex API`
   - **Body:** `Authorization: Bearer {{ env.LLAMAINDEX_API_KEY }}`

---

## ⚠️ Importante

- **NO** incluyas el archivo JSON en GitHub sin arreglarlo primero
- Si el token ya está expuesto en el historio de git, **regenera el token en LlamaIndex**
- En producción, considera usar un Vault (HashiCorp, AWS Secrets Manager) para mayor seguridad

---

## 📋 Checklist

- [ ] Crear variable de entorno LLAMAINDEX_API_KEY en n8n
- [ ] Actualizar 6 nodos HTTP (3 en Telegram, 3 en WhatsApp)
- [ ] Hacer test run de ambos flujos
- [ ] Guardar cambios
- [ ] Regenerar token en LlamaIndex si fue público
- [ ] Exportar JSONs nuevamente (sin tokens)
