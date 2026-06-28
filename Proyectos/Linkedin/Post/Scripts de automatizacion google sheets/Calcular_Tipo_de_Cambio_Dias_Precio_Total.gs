// ============================================================================
// SCRIPT: Cotizaciones Automáticas con Tipo de Cambio FIX (Banxico)
// Versión: 1.0
// Autor: [Tu nombre o marca]
// ----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE SCRIPT?
//   1. Consulta el tipo de cambio FIX más reciente directamente desde Banxico
//   2. Lo escribe en la columna P de tu hoja de cotizaciones
//   3. Calcula automáticamente los días del periodo (columna O)
//   4. Calcula el precio en USD (columna Q) con base en una tarifa diaria
//   5. Convierte el total a MXN (columna R) usando el tipo de cambio del día
//
// REQUISITOS PREVIOS
//   - Tener un token gratuito de la API de Banxico (SIE)
//   - Obtenerlo en: https://www.banxico.org.mx/SieAPIRest/service/v1/token
// ============================================================================


// ============================================================================
// SECCIÓN 1: CONFIGURACIÓN — Ajusta estos valores a tu hoja
// ============================================================================

const SHEET_NAME         = 'Cotizaciones 2026-2027'; // Nombre exacto de tu hoja (sensible a mayúsculas)
const ROW_START          = 2;                         // Primera fila de datos (la fila 1 se asume como encabezado)
const TOKEN_BANXICO      = 'TU_TOKEN_AQUI';           // Reemplaza con tu token de Banxico
const SOBRESCRIBIR_TC    = true;                      // true = actualiza TC en todas las filas
                                                      // false = solo rellena celdas vacías
const TARIFA_USD_POR_DIA = 2.9;                       // Tu tarifa diaria en USD
const DIAS_NO_COBRABLES  = 0;                         // Días de cortesía (se restan del total)

// Columnas de entrada (no se modifican)
const COL_FECHA_INICIO = 11; // K — Fecha de inicio del periodo
const COL_FECHA_FIN    = 12; // L — Fecha de fin del periodo
const COL_TIPO_CAMBIO  = 16; // P — Tipo de cambio FIX (se actualiza automáticamente)

// Columnas de salida (se escriben con los resultados)
const COL_DIAS         = 15; // O — Días calculados
const COL_PRECIO_USD   = 17; // Q — Precio en USD
const COL_TOTAL_MXN    = 18; // R — Total en MXN


// ============================================================================
// SECCIÓN 2: MENÚ — Se agrega automáticamente al abrir el archivo
// ============================================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Cotizaciones')
    .addItem('▶ Ejecutar proceso completo', 'ejecutarProcesoCompleto')
    .addSeparator()
    .addItem('Solo actualizar tipo de cambio', 'soloActualizarTipoCambio')
    .addItem('Solo calcular días, precio y total', 'soloCalcularDiasPrecioTotal')
    .addToUi();
}


// ============================================================================
// SECCIÓN 3: FUNCIÓN PRINCIPAL
// ============================================================================

/**
 * Ejecuta el proceso completo:
 * 1) Actualiza el tipo de cambio FIX en columna P
 * 2) Calcula días, precio USD y total MXN
 */
function ejecutarProcesoCompleto() {
  try {
    Logger.log('=== INICIANDO PROCESO COMPLETO ===');

    Logger.log('Paso 1: Actualizando tipo de cambio desde Banxico...');
    actualizarTipoCambioEnColumnaP();

    Logger.log('Paso 2: Calculando días, precio y total...');
    calcularDiasPrecioTotal();

    Logger.log('=== PROCESO COMPLETADO ===');
    _alert('✅ Proceso completado.\n\nSe actualizó:\n- Tipo de cambio FIX (columna P)\n- Días (columna O)\n- Precio USD (columna Q)\n- Total MXN (columna R)');

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    _alert('❌ Error al ejecutar el proceso:\n\n' + error.toString());
  }
}


// ============================================================================
// SECCIÓN 4: ACTUALIZAR TIPO DE CAMBIO (Banxico FIX)
// ============================================================================

/**
 * Consulta el tipo de cambio FIX del día desde la API de Banxico
 * y lo escribe en la columna P de todas las filas con datos.
 * Si SOBRESCRIBIR_TC = false, solo rellena las celdas que estén vacías.
 */
function actualizarTipoCambioEnColumnaP() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No se encontró la hoja: "' + SHEET_NAME + '". Verifica el nombre en CONFIGURACIÓN.');

  // 1. Consultar Banxico
  const url  = 'https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=' + TOKEN_BANXICO;
  const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

  if (resp.getResponseCode() !== 200) {
    throw new Error('Error al consultar Banxico (código ' + resp.getResponseCode() + ').\n' +
                    'Verifica que tu TOKEN_BANXICO sea válido.');
  }

  const data     = JSON.parse(resp.getContentText());
  const datoRaw  = data?.bmx?.series?.[0]?.datos?.[0]?.dato;
  if (!datoRaw)  throw new Error('Respuesta inesperada de Banxico. Intenta más tarde.');

  const tipoCambio = parseFloat(String(datoRaw).replace(',', '.'));
  if (isNaN(tipoCambio)) throw new Error('El tipo de cambio recibido no es un número válido: ' + datoRaw);
  Logger.log('Tipo de cambio FIX obtenido: ' + tipoCambio);

  // 2. Determinar rango de datos
  const lastRow = Math.max(sheet.getLastRow(), ROW_START);
  const numRows = lastRow - ROW_START + 1;

  // 3. Leer valores actuales de la columna P
  const rango            = sheet.getRange(ROW_START, COL_TIPO_CAMBIO, numRows, 1);
  const valoresExistentes = rango.getValues();

  // 4. Preparar nuevos valores (respetando SOBRESCRIBIR_TC)
  const nuevos = valoresExistentes.map(row => {
    if (!SOBRESCRIBIR_TC && row[0] !== '' && row[0] !== null) {
      return [row[0]]; // Conservar valor existente
    }
    return [tipoCambio];
  });

  // 5. Escribir en bloque
  rango.setValues(nuevos);
  Logger.log('Tipo de cambio actualizado en ' + numRows + ' filas de la columna P.');

  return tipoCambio;
}


// ============================================================================
// SECCIÓN 5: CALCULAR DÍAS, PRECIO USD Y TOTAL MXN
// ============================================================================

/**
 * Recorre todas las filas con datos y calcula:
 * - Días del periodo (fecha fin - fecha inicio + 1), escrito en columna O
 * - Precio USD = días cobrables × TARIFA_USD_POR_DIA, escrito en columna Q
 * - Total MXN  = precio USD × tipo de cambio,  escrito en columna R
 */
function calcularDiasPrecioTotal() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No se encontró la hoja: "' + SHEET_NAME + '".');

  const lastRow = sheet.getLastRow();
  if (lastRow < ROW_START) {
    Logger.log('No hay datos para calcular.');
    return;
  }

  const numRows = lastRow - ROW_START + 1;

  // Leer columnas K a P en un solo bloque (más eficiente)
  const range  = sheet.getRange(ROW_START, COL_FECHA_INICIO, numRows, COL_TIPO_CAMBIO - COL_FECHA_INICIO + 1);
  const values = range.getValues();

  const diasArr   = [];
  const precioArr = [];
  const totalArr  = [];

  for (let i = 0; i < values.length; i++) {
    const row        = values[i];
    const startRaw   = row[0];                                    // columna K
    const endRaw     = row[1];                                    // columna L
    const tcRaw      = row[COL_TIPO_CAMBIO - COL_FECHA_INICIO];  // columna P

    const dias          = _calcularDiasInclusive(startRaw, endRaw);
    const diasCobrables = (dias === null) ? null : Math.max(0, dias - DIAS_NO_COBRABLES);
    const tipoCambio    = _toNumber(tcRaw) || 1;

    const precioUSD = (diasCobrables === null) ? null : Math.round(TARIFA_USD_POR_DIA * diasCobrables * 100) / 100;
    const totalMXN  = (precioUSD  === null) ? null : Math.round(precioUSD * tipoCambio * 100) / 100;

    diasArr.push([  dias      === null ? '' : dias      ]);
    precioArr.push([precioUSD === null ? '' : precioUSD ]);
    totalArr.push([ totalMXN  === null ? '' : totalMXN  ]);
  }

  // Escribir resultados en bloque
  sheet.getRange(ROW_START, COL_DIAS,       numRows, 1).setValues(diasArr);
  sheet.getRange(ROW_START, COL_PRECIO_USD, numRows, 1).setValues(precioArr);
  sheet.getRange(ROW_START, COL_TOTAL_MXN,  numRows, 1).setValues(totalArr);

  Logger.log('Cálculo completado para ' + numRows + ' filas.');
}


// ============================================================================
// SECCIÓN 6: FUNCIONES INDEPENDIENTES (desde el menú o triggers)
// ============================================================================

/** Solo actualiza el tipo de cambio FIX en columna P. */
function soloActualizarTipoCambio() {
  try {
    actualizarTipoCambioEnColumnaP();
    _alert('✅ Tipo de cambio FIX actualizado en columna P.');
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    _alert('❌ Error: ' + error.toString());
  }
}

/** Solo calcula días, precio USD y total MXN (usa el TC que ya está en P). */
function soloCalcularDiasPrecioTotal() {
  try {
    calcularDiasPrecioTotal();
    _alert('✅ Días, precio USD y total MXN calculados correctamente.');
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    _alert('❌ Error: ' + error.toString());
  }
}


// ============================================================================
// SECCIÓN 7: UTILIDADES INTERNAS
// ============================================================================

/**
 * Convierte distintos formatos de fecha a un objeto Date sin zona horaria.
 * Acepta: objetos Date, números seriales de Sheets, cadenas DD/MM/YYYY, YYYY-MM-DD, etc.
 * @param {*} v  Valor a convertir
 * @returns {Date|null}
 */
function _parseToDate(v) {
  if (v === null || v === undefined || v === '') return null;
  if (v instanceof Date) return new Date(v.getFullYear(), v.getMonth(), v.getDate());
  if (typeof v === 'number') {
    // Número serial de Google Sheets (epoch = 30/12/1899)
    const epoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(epoch.getTime() + v * 86400000);
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/); // YYYY-MM-DD
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  m = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/);   // DD/MM/YYYY o DD-MM-YY
  if (m) {
    let y = Number(m[3]);
    if (y < 100) y += 2000;
    return new Date(y, Number(m[2]) - 1, Number(m[1]));
  }
  const d = new Date(s);
  return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Calcula los días entre dos fechas (inclusivo: fecha inicio y fin cuentan).
 * @param {*} start  Fecha de inicio
 * @param {*} end    Fecha de fin
 * @returns {number|null}
 */
function _calcularDiasInclusive(start, end) {
  const s = _parseToDate(start);
  const e = _parseToDate(end);
  if (!s || !e) return null;
  const diff = Math.floor((e.getTime() - s.getTime()) / 86400000);
  const dias = diff + 1;
  return (Number.isFinite(dias) && dias >= 0) ? dias : null;
}

/**
 * Convierte un valor de celda a número.
 * Elimina caracteres no numéricos (símbolos de moneda, espacios, etc.)
 * @param {*} v
 * @returns {number|null}
 */
function _toNumber(v) {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).replace(/[^0-9\-,.]/g, '').replace(',', '.');
  const n = Number(s);
  return isNaN(n) ? null : n;
}

/**
 * Muestra un alert de UI de forma segura (no lanza error si se ejecuta sin contexto UI).
 * @param {string} msg
 */
function _alert(msg) {
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { /* silencioso en ejecuciones sin UI */ }
}
