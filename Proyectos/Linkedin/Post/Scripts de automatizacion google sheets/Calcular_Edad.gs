// ============================================================================
// SCRIPT: Calcular Edad Automáticamente — Google Sheets
// Versión: 1.0
// Autor: [Tu nombre o marca]
// ----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE SCRIPT?
//   Lee una columna con fechas de nacimiento (en cualquier formato común)
//   y escribe la edad actual en años en otra columna, de forma automática.
//
//   Funciona incluso con fechas "sucias": DD/MM/YYYY, YYYY-MM-DD, DD.MM.YYYY,
//   números seriales de Sheets, cadenas con guiones, puntos o espacios.
//
// CASOS DE USO COMUNES
//   - Seguros: calcular edad del asegurado al momento de cotizar
//   - RRHH: reportes de plantilla con edad actual de cada empleado
//   - Bases de datos médicas, educativas o de clientes
// ============================================================================


// ============================================================================
// SECCIÓN 1: CONFIGURACIÓN — Ajusta estos valores a tu hoja
// ============================================================================

const DOB_COL_LETTER    = 'G'; // Letra de la columna con Fecha de Nacimiento
const OUTPUT_COL_LETTER = 'S'; // Letra de la columna donde se escribirá la edad
const FIRST_DATA_ROW    = 2;   // Primera fila de datos (la fila 1 se asume como encabezado)


// ============================================================================
// SECCIÓN 2: MENÚ — Se agrega automáticamente al abrir el archivo
// ============================================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Automatización')
    .addItem('▶ Calcular edades', 'procesarEdades')
    .addToUi();
}


// ============================================================================
// SECCIÓN 3: FUNCIÓN PRINCIPAL
// ============================================================================

/**
 * Recorre todas las filas con datos, lee la fecha de nacimiento de cada una
 * y escribe la edad en años en la columna de salida.
 * Las celdas con fecha inválida o vacía muestran "INVÁLIDO".
 */
function procesarEdades() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  const dobCol = _letterToColumn(DOB_COL_LETTER);
  const outCol = _letterToColumn(OUTPUT_COL_LETTER);

  const lastRow = sheet.getLastRow();
  if (lastRow < FIRST_DATA_ROW) {
    SpreadsheetApp.getUi().alert('No hay datos para procesar.');
    return;
  }

  // Leer el bloque de columnas necesario en un solo llamado (más eficiente)
  const width   = Math.max(dobCol, outCol);
  const numRows = lastRow - FIRST_DATA_ROW + 1;
  const range   = sheet.getRange(FIRST_DATA_ROW, 1, numRows, width);
  const values  = range.getValues();

  const hoy = new Date();

  for (let i = 0; i < values.length; i++) {
    const rawDob = values[i][dobCol - 1];
    const dob    = _parseFlexibleDate(rawDob);
    const edad   = dob ? _calcularEdad(dob, hoy) : 'INVÁLIDO';

    // Asegurar que la fila tenga suficientes columnas antes de escribir
    while (values[i].length < outCol) values[i].push('');
    values[i][outCol - 1] = edad;
  }

  range.setValues(values);

  try {
    SpreadsheetApp.getUi().alert('✅ Edades calculadas correctamente para ' + numRows + ' filas.');
  } catch (e) { /* silencioso si no hay contexto UI */ }
}


// ============================================================================
// SECCIÓN 4: UTILIDADES INTERNAS
// ============================================================================

/**
 * Convierte una letra de columna (A–Z) a su número correspondiente.
 * Ejemplo: A→1, B→2, ... Z→26
 * @param {string} letter
 * @returns {number}
 */
function _letterToColumn(letter) {
  return letter.toUpperCase().charCodeAt(0) - 64;
}

/**
 * Intenta interpretar un valor de celda como fecha, aceptando múltiples formatos:
 *   - Objeto Date nativo de Apps Script
 *   - Cadenas: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD
 *   - Cadenas ambiguas con 8 dígitos seguidos (DDMMYYYY)
 *   - Números seriales de Sheets (días desde 30/12/1899)
 *
 * @param {*} value  Valor crudo de la celda
 * @returns {Date|null}  Objeto Date si pudo interpretarse, null si no
 */
function _parseFlexibleDate(value) {
  // Vacío o nulo
  if (value === null || value === undefined || value === '') return null;

  // Ya es un Date válido
  if (value instanceof Date && !isNaN(value)) return value;

  // Número serial de Sheets
  if (typeof value === 'number') {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const d = new Date(epoch.getTime() + value * 86400000);
    return isNaN(d) ? null : d;
  }

  // Normalizar cadena: reemplazar puntos y guiones por barras, colapsar espacios
  let s = String(value).trim()
    .replace(/\./g, '/')
    .replace(/-/g, '/')
    .replace(/\s+/g, ' ');

  // Intento directo con el constructor de Date
  let d = new Date(s);
  if (!isNaN(d)) return d;

  // Formato DD/MM/YYYY
  const parts = s.split('/');
  if (parts.length === 3) {
    const cleaned = parts.map(p => p.replace(/\D/g, ''));
    if (cleaned[2] && cleaned[2].length === 4) {
      d = new Date(Number(cleaned[2]), Number(cleaned[1]) - 1, Number(cleaned[0]));
      if (!isNaN(d)) return d;
    }
  }

  // Último intento: extraer dígitos y asumir DDMMYYYY si hay exactamente 8
  const digits = (s.match(/\d+/g) || []).join('');
  if (digits.length === 8) {
    d = new Date(
      Number(digits.slice(4, 8)),
      Number(digits.slice(2, 4)) - 1,
      Number(digits.slice(0, 2))
    );
    if (!isNaN(d)) return d;
  }

  return null;
}

/**
 * Calcula la edad en años cumplidos entre una fecha de nacimiento y una fecha de referencia.
 * Tiene en cuenta si el cumpleaños ya pasó en el año de referencia.
 *
 * @param {Date} fechaNacimiento
 * @param {Date} fechaReferencia   Normalmente la fecha de hoy
 * @returns {number|string}  Edad en años, o '' si alguna fecha es inválida
 */
function _calcularEdad(fechaNacimiento, fechaReferencia) {
  if (!fechaNacimiento || !fechaReferencia) return '';
  const dob = new Date(fechaNacimiento);
  const ref = new Date(fechaReferencia);
  if (isNaN(dob) || isNaN(ref)) return '';

  let edad = ref.getFullYear() - dob.getFullYear();
  const meses = ref.getMonth() - dob.getMonth();
  if (meses < 0 || (meses === 0 && ref.getDate() < dob.getDate())) {
    edad--; // El cumpleaños aún no ha pasado este año
  }
  return edad;
}
