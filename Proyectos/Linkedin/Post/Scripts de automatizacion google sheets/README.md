# 📊 Cotizaciones Automáticas con Tipo de Cambio FIX — Google Sheets Script

Automatiza tus cotizaciones en Google Sheets: consulta el **tipo de cambio FIX de Banxico** en tiempo real y calcula días, precio USD y total MXN con un solo clic.

---

## ¿Qué hace este script?

| Columna | Qué calcula |
|---|---|
| **P** | Tipo de cambio FIX del día (directo de Banxico) |
| **O** | Días del periodo (fecha inicio → fecha fin, inclusive) |
| **Q** | Precio en USD (`días × tarifa diaria`) |
| **R** | Total en MXN (`precio USD × tipo de cambio`) |

---

## Requisitos

- Cuenta de Google (Google Sheets)
- Token gratuito de la API de Banxico → [Obtener aquí](https://www.banxico.org.mx/SieAPIRest/service/v1/token)

---

## Instalación (5 pasos)

### Paso 1 — Abre el editor de scripts
En tu hoja de Google Sheets, ve al menú:
**Extensiones → Apps Script**

### Paso 2 — Pega el código
Borra cualquier contenido que haya en el editor y pega el contenido del archivo `.gs` que descargaste.

### Paso 3 — Configura tus parámetros
Al inicio del script, ajusta estos valores según tu hoja:

```javascript
const SHEET_NAME         = 'Cotizaciones 2026-2027'; // Nombre exacto de tu hoja
const ROW_START          = 2;                         // Fila donde empiezan tus datos
const TOKEN_BANXICO      = 'TU_TOKEN_AQUI';           // Tu token de Banxico
const TARIFA_USD_POR_DIA = 2.9;                       // Tu tarifa diaria en USD
const DIAS_NO_COBRABLES  = 0;                         // Días de cortesía (si aplica)
```

### Paso 4 — Configura las columnas
Más abajo en la sección de configuración, verifica que las columnas correspondan a tu hoja:

```javascript
const COL_FECHA_INICIO = 11; // K — Fecha de inicio
const COL_FECHA_FIN    = 12; // L — Fecha de fin
const COL_TIPO_CAMBIO  = 16; // P — Tipo de cambio (salida)
const COL_DIAS         = 15; // O — Días (salida)
const COL_PRECIO_USD   = 17; // Q — Precio USD (salida)
const COL_TOTAL_MXN    = 18; // R — Total MXN (salida)
```

> **Referencia rápida de columnas:** A=1, B=2, C=3 ... K=11, L=12 ... P=16, Q=17, R=18

### Paso 5 — Guarda y autoriza
1. Presiona **Ctrl+S** (o el ícono de guardar)
2. Al ejecutar por primera vez, Google pedirá que autorices el script → acepta los permisos
3. Recarga tu hoja de Sheets — aparecerá el menú **"Cotizaciones"** en la barra superior

---

## Uso

Desde el menú **Cotizaciones** en tu hoja:

| Opción | Qué hace |
|---|---|
| **▶ Ejecutar proceso completo** | Actualiza TC + calcula todo en un paso |
| Solo actualizar tipo de cambio | Solo escribe el FIX en columna P |
| Solo calcular días, precio y total | Recalcula con el TC que ya está en P |

---

## Automatización con trigger (opcional)

Para que el proceso corra automáticamente cada día sin que hagas clic:

1. En Apps Script, ve a **Triggers** (ícono de reloj en el panel izquierdo)
2. Haz clic en **"+ Agregar trigger"**
3. Configura:
   - Función: `ejecutarProcesoCompleto`
   - Origen del evento: **Tiempo**
   - Tipo: **Temporizador por día**
   - Hora: la que prefieras (ej. 9:00–10:00 am)

---

## Personalización frecuente

**¿Quiero que no sobreescriba tipos de cambio que ya capturé manualmente?**
Cambia a `false`:
```javascript
const SOBRESCRIBIR_TC = false;
```

**¿Mis fechas están en formato distinto?**
El script acepta automáticamente: `DD/MM/YYYY`, `YYYY-MM-DD`, `DD-MM-YY`, fechas nativas de Sheets y números seriales.

---

## Preguntas frecuentes

**¿El token de Banxico tiene costo?**
No, es completamente gratuito. Solo necesitas registrarte en su portal.

**¿Cada cuánto se actualiza el tipo de cambio FIX?**
Banxico publica el FIX una vez por día hábil (generalmente antes del mediodía). El script siempre trae el valor más reciente disponible.

**¿Funciona con nombres de hojas en español con acentos?**
Sí, el nombre de la hoja se usa tal cual. Solo asegúrate de copiarlo exactamente igual, incluyendo mayúsculas y espacios.

---

## Soporte

¿Necesitas adaptar el script a una estructura de columnas diferente o agregar funcionalidades?
Contáctame para una cotización de personalización.
