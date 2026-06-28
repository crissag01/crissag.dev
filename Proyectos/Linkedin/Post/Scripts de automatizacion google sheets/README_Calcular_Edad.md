# 🎂 Calcular Edad Automáticamente — Google Sheets Script

Escribe la edad actual en años de cada persona en tu hoja de Sheets con un solo clic. Funciona con fechas en cualquier formato, incluso datos "sucios" exportados de otros sistemas.

---

## ¿Qué hace este script?

Lee una columna con fechas de nacimiento y escribe la edad en años en otra columna, calculada al día de hoy. Si una celda tiene una fecha inválida o está vacía, escribe `INVÁLIDO` para que puedas identificarla fácilmente.

**Formatos de fecha que acepta automáticamente:**

| Formato | Ejemplo |
|---|---|
| DD/MM/YYYY | 15/03/1985 |
| DD-MM-YYYY | 15-03-1985 |
| DD.MM.YYYY | 15.03.1985 |
| YYYY-MM-DD | 1985-03-15 |
| Fecha nativa de Sheets | (celda con formato fecha) |
| 8 dígitos seguidos | 15031985 |

---

## Requisitos

- Cuenta de Google (Google Sheets)
- No requiere APIs externas ni tokens adicionales

---

## Instalación (4 pasos)

### Paso 1 — Abre el editor de scripts
En tu hoja de Google Sheets, ve al menú:
**Extensiones → Apps Script**

### Paso 2 — Pega el código
Borra cualquier contenido que haya en el editor y pega el contenido del archivo `.gs` que descargaste.

### Paso 3 — Configura tus columnas
Al inicio del script, ajusta estas tres líneas:

```javascript
const DOB_COL_LETTER    = 'G'; // Letra de la columna con Fecha de Nacimiento
const OUTPUT_COL_LETTER = 'S'; // Letra de la columna donde se escribirá la edad
const FIRST_DATA_ROW    = 2;   // Fila donde empiezan tus datos (encabezado en fila 1)
```

**Ejemplos:**
- Si tus fechas de nacimiento están en la columna **B** → `DOB_COL_LETTER = 'B'`
- Si quieres la edad en la columna **E** → `OUTPUT_COL_LETTER = 'E'`
- Si tus datos empiezan en la fila **3** → `FIRST_DATA_ROW = 3`

### Paso 4 — Guarda y autoriza
1. Presiona **Ctrl+S** para guardar
2. Al ejecutar por primera vez, Google pedirá que autorices el script → acepta los permisos
3. Recarga tu hoja de Sheets — aparecerá el menú **"Automatización"** en la barra superior

---

## Uso

Desde el menú **Automatización** en tu hoja:

| Opción | Qué hace |
|---|---|
| **▶ Calcular edades** | Procesa todas las filas y escribe la edad actualizada |

> Las edades se calculan al día en que ejecutas el script. Si quieres mantenerlas actualizadas, puedes configurar un trigger diario (ver sección siguiente).

---

## Automatización con trigger (opcional)

Para que las edades se actualicen solos cada día sin que hagas clic:

1. En Apps Script, ve a **Triggers** (ícono de reloj en el panel izquierdo)
2. Haz clic en **"+ Agregar trigger"**
3. Configura:
   - Función: `procesarEdades`
   - Origen del evento: **Tiempo**
   - Tipo: **Temporizador por día**
   - Hora: la que prefieras (ej. 8:00–9:00 am)

---

## Casos de uso comunes

- **Seguros:** edad del asegurado al momento de cotizar o renovar
- **Recursos Humanos:** reportes de plantilla con edad actual de cada colaborador
- **Bases de datos de clientes:** segmentación por rango de edad
- **Gestión médica o educativa:** edad de pacientes o alumnos siempre actualizada

---

## Preguntas frecuentes

**¿Qué aparece si la fecha está vacía o en un formato que no reconoce?**
La celda de salida mostrará `INVÁLIDO`, para que puedas identificar y corregir esas filas fácilmente.

**¿Sobreescribe datos que ya había en la columna de salida?**
Sí, cada vez que ejecutas el script se recalculan todas las edades. Si solo quieres actualizar filas nuevas, contáctame para una versión personalizada.

**¿Funciona con más de 1,000 filas?**
Sí. El script lee y escribe en bloque (no celda por celda), por lo que es eficiente incluso con bases de datos grandes.

---

## Soporte

¿Necesitas adaptar el script a una estructura diferente, agregar columnas adicionales o integrar con otros procesos?
Contáctame para una cotización de personalización.
