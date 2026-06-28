"""
Sistema de Organización Financiera Personal
Backend: FastAPI + SQLite
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import os
import shutil
import uuid
from datetime import date, datetime

app = FastAPI(title="Sistema Financiero Personal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

DB_PATH = "finanzas.db"


# ─── DB SETUP ───────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS tarjetas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            banco TEXT,
            limite_credito REAL DEFAULT 0,
            dia_corte INTEGER,
            dia_limite_pago INTEGER,
            color TEXT DEFAULT '#6366f1',
            creado_en TEXT DEFAULT (datetime('now'))
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS transacciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL CHECK(tipo IN ('ingreso','gasto','pago_tdc')),
            monto REAL NOT NULL,
            descripcion TEXT,
            categoria TEXT,
            fecha TEXT NOT NULL,
            tarjeta_id INTEGER REFERENCES tarjetas(id),
            comprobante_path TEXT,
            comprobante_nombre TEXT,
            notas TEXT,
            creado_en TEXT DEFAULT (datetime('now'))
        )
    """)

    conn.commit()
    conn.close()


init_db()


# ─── MODELS ─────────────────────────────────────────────────────────────────

class TarjetaIn(BaseModel):
    nombre: str
    banco: Optional[str] = None
    limite_credito: float = 0
    dia_corte: Optional[int] = None
    dia_limite_pago: Optional[int] = None
    color: str = "#6366f1"


class TransaccionIn(BaseModel):
    tipo: str  # ingreso | gasto | pago_tdc
    monto: float
    descripcion: Optional[str] = None
    categoria: Optional[str] = None
    fecha: str
    tarjeta_id: Optional[int] = None
    notas: Optional[str] = None


# ─── TARJETAS ────────────────────────────────────────────────────────────────

@app.get("/tarjetas")
def listar_tarjetas():
    conn = get_db()
    c = conn.cursor()
    tarjetas = c.execute("SELECT * FROM tarjetas ORDER BY id").fetchall()
    result = []
    for t in tarjetas:
        t = dict(t)
        # Calcular saldo usado: sum gastos - sum pagos para esta tarjeta
        gastos = c.execute(
            "SELECT COALESCE(SUM(monto),0) FROM transacciones WHERE tarjeta_id=? AND tipo='gasto'",
            (t["id"],)
        ).fetchone()[0]
        pagos = c.execute(
            "SELECT COALESCE(SUM(monto),0) FROM transacciones WHERE tarjeta_id=? AND tipo='pago_tdc'",
            (t["id"],)
        ).fetchone()[0]
        t["saldo_usado"] = round(gastos - pagos, 2)
        t["saldo_disponible"] = round(t["limite_credito"] - t["saldo_usado"], 2)

        # Próximas fechas basadas en día de corte / límite
        hoy = date.today()
        if t["dia_corte"]:
            try:
                corte = date(hoy.year, hoy.month, t["dia_corte"])
                if corte < hoy:
                    # Ya pasó este mes, calcular próximo mes
                    if hoy.month == 12:
                        corte = date(hoy.year + 1, 1, t["dia_corte"])
                    else:
                        corte = date(hoy.year, hoy.month + 1, t["dia_corte"])
                t["proxima_fecha_corte"] = corte.isoformat()
                t["dias_para_corte"] = (corte - hoy).days
            except ValueError:
                t["proxima_fecha_corte"] = None
                t["dias_para_corte"] = None
        else:
            t["proxima_fecha_corte"] = None
            t["dias_para_corte"] = None

        if t["dia_limite_pago"]:
            try:
                limite = date(hoy.year, hoy.month, t["dia_limite_pago"])
                if limite < hoy:
                    if hoy.month == 12:
                        limite = date(hoy.year + 1, 1, t["dia_limite_pago"])
                    else:
                        limite = date(hoy.year, hoy.month + 1, t["dia_limite_pago"])
                t["proxima_fecha_limite"] = limite.isoformat()
                t["dias_para_limite"] = (limite - hoy).days
            except ValueError:
                t["proxima_fecha_limite"] = None
                t["dias_para_limite"] = None
        else:
            t["proxima_fecha_limite"] = None
            t["dias_para_limite"] = None

        result.append(t)
    conn.close()
    return result


@app.post("/tarjetas")
def crear_tarjeta(data: TarjetaIn):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO tarjetas (nombre, banco, limite_credito, dia_corte, dia_limite_pago, color)
        VALUES (?,?,?,?,?,?)
    """, (data.nombre, data.banco, data.limite_credito,
          data.dia_corte, data.dia_limite_pago, data.color))
    conn.commit()
    tid = c.lastrowid
    conn.close()
    return {"id": tid, "mensaje": "Tarjeta creada"}


@app.put("/tarjetas/{tid}")
def actualizar_tarjeta(tid: int, data: TarjetaIn):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        UPDATE tarjetas SET nombre=?, banco=?, limite_credito=?,
        dia_corte=?, dia_limite_pago=?, color=? WHERE id=?
    """, (data.nombre, data.banco, data.limite_credito,
          data.dia_corte, data.dia_limite_pago, data.color, tid))
    conn.commit()
    conn.close()
    return {"mensaje": "Actualizada"}


@app.delete("/tarjetas/{tid}")
def eliminar_tarjeta(tid: int):
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM tarjetas WHERE id=?", (tid,))
    conn.commit()
    conn.close()
    return {"mensaje": "Eliminada"}


# ─── TRANSACCIONES ───────────────────────────────────────────────────────────

@app.get("/transacciones")
def listar_transacciones(mes: Optional[int] = None, anio: Optional[int] = None,
                          tipo: Optional[str] = None, tarjeta_id: Optional[int] = None):
    conn = get_db()
    c = conn.cursor()

    query = """
        SELECT t.*, ta.nombre as tarjeta_nombre, ta.color as tarjeta_color
        FROM transacciones t
        LEFT JOIN tarjetas ta ON t.tarjeta_id = ta.id
        WHERE 1=1
    """
    params = []

    if mes and anio:
        query += " AND strftime('%m', t.fecha) = ? AND strftime('%Y', t.fecha) = ?"
        params += [f"{mes:02d}", str(anio)]
    if tipo:
        query += " AND t.tipo = ?"
        params.append(tipo)
    if tarjeta_id:
        query += " AND t.tarjeta_id = ?"
        params.append(tarjeta_id)

    query += " ORDER BY t.fecha DESC, t.id DESC"

    rows = c.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.post("/transacciones")
def crear_transaccion(data: TransaccionIn):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO transacciones (tipo, monto, descripcion, categoria, fecha, tarjeta_id, notas)
        VALUES (?,?,?,?,?,?,?)
    """, (data.tipo, data.monto, data.descripcion, data.categoria,
          data.fecha, data.tarjeta_id, data.notas))
    conn.commit()
    tid = c.lastrowid
    conn.close()
    return {"id": tid, "mensaje": "Transacción creada"}


@app.delete("/transacciones/{tid}")
def eliminar_transaccion(tid: int):
    conn = get_db()
    c = conn.cursor()
    # Borrar archivo si existe
    row = c.execute("SELECT comprobante_path FROM transacciones WHERE id=?", (tid,)).fetchone()
    if row and row["comprobante_path"] and os.path.exists(row["comprobante_path"]):
        os.remove(row["comprobante_path"])
    c.execute("DELETE FROM transacciones WHERE id=?", (tid,))
    conn.commit()
    conn.close()
    return {"mensaje": "Eliminada"}


# ─── COMPROBANTES ────────────────────────────────────────────────────────────

@app.post("/transacciones/{tid}/comprobante")
async def subir_comprobante(tid: int, archivo: UploadFile = File(...)):
    ext = os.path.splitext(archivo.filename)[1]
    nombre_unico = f"{uuid.uuid4()}{ext}"
    ruta = os.path.join(UPLOAD_DIR, nombre_unico)

    with open(ruta, "wb") as f:
        shutil.copyfileobj(archivo.file, f)

    conn = get_db()
    c = conn.cursor()
    c.execute("""
        UPDATE transacciones SET comprobante_path=?, comprobante_nombre=? WHERE id=?
    """, (ruta, archivo.filename, tid))
    conn.commit()
    conn.close()
    return {"ruta": ruta, "nombre": archivo.filename}


@app.get("/comprobante/{tid}")
def descargar_comprobante(tid: int):
    conn = get_db()
    c = conn.cursor()
    row = c.execute(
        "SELECT comprobante_path, comprobante_nombre FROM transacciones WHERE id=?", (tid,)
    ).fetchone()
    conn.close()
    if not row or not row["comprobante_path"]:
        raise HTTPException(404, "Sin comprobante")
    return FileResponse(row["comprobante_path"], filename=row["comprobante_nombre"])


# ─── RESUMEN ─────────────────────────────────────────────────────────────────

@app.get("/resumen")
def resumen(mes: Optional[int] = None, anio: Optional[int] = None):
    conn = get_db()
    c = conn.cursor()

    hoy = date.today()
    m = mes or hoy.month
    a = anio or hoy.year
    filtro_fecha = f"strftime('%m', fecha) = '{m:02d}' AND strftime('%Y', fecha) = '{a}'"

    ingresos = c.execute(
        f"SELECT COALESCE(SUM(monto),0) FROM transacciones WHERE tipo='ingreso' AND {filtro_fecha}"
    ).fetchone()[0]

    gastos = c.execute(
        f"SELECT COALESCE(SUM(monto),0) FROM transacciones WHERE tipo='gasto' AND {filtro_fecha}"
    ).fetchone()[0]

    pagos_tdc = c.execute(
        f"SELECT COALESCE(SUM(monto),0) FROM transacciones WHERE tipo='pago_tdc' AND {filtro_fecha}"
    ).fetchone()[0]

    # Gastos por categoría
    cats = c.execute(f"""
        SELECT categoria, SUM(monto) as total FROM transacciones
        WHERE tipo='gasto' AND {filtro_fecha} AND categoria IS NOT NULL
        GROUP BY categoria ORDER BY total DESC
    """).fetchall()

    # Total deuda en todas las TDC
    deuda_total = c.execute("""
        SELECT COALESCE(SUM(monto),0) FROM transacciones WHERE tipo='gasto' AND tarjeta_id IS NOT NULL
    """).fetchone()[0]
    pagos_total = c.execute("""
        SELECT COALESCE(SUM(monto),0) FROM transacciones WHERE tipo='pago_tdc'
    """).fetchone()[0]

    conn.close()
    return {
        "mes": m,
        "anio": a,
        "ingresos": round(ingresos, 2),
        "gastos": round(gastos, 2),
        "pagos_tdc": round(pagos_tdc, 2),
        "balance": round(ingresos - gastos - pagos_tdc, 2),
        "deuda_tdc_total": round(deuda_total - pagos_total, 2),
        "categorias": [dict(r) for r in cats],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
