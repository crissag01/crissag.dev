# 💳 Sistema de Finanzas Personales

App web para gestionar ingresos, gastos, tarjetas de crédito y comprobantes.

## Requisitos

- Python 3.10+
- Navegador moderno (Chrome, Firefox, Edge)

---

## Instalación y arranque

### 1. Instalar dependencias del backend

```bash
cd backend
pip install -r requirements.txt
```

### 2. Iniciar el servidor backend

```bash
cd backend
python main.py
```

El servidor arranca en `http://localhost:8000`
Puedes ver la API documentada en `http://localhost:8000/docs`

### 3. Abrir el frontend

Abre el archivo `frontend/index.html` directamente en tu navegador.

> ⚠️ Si el navegador bloquea peticiones CORS al abrir el archivo local, usa una extensión como "Live Server" en VS Code o corre un servidor simple:
> ```bash
> cd frontend
> python -m http.server 3000
> ```
> Luego ve a `http://localhost:3000`

---

## Funcionalidades

### 💳 Tarjetas de crédito
- Registra cada TDC con su límite, banco y color
- Configura día de corte y día límite de pago
- Ve el saldo usado, disponible y la barra de uso
- Alertas de color: 🟡 >50% usado, 🔴 >80% usado
- Contador de días al próximo corte y límite de pago

### 📋 Transacciones
- **Ingreso**: dinero que entra (sueldo, transferencias, etc.)
- **Gasto**: puede vincularse a una TDC → actualiza el saldo automáticamente
- **Pago TDC**: registra el pago a tu tarjeta → reduce el saldo adeudado
- Filtros por mes, año, tipo y tarjeta
- Adjunta PDF o imagen como comprobante a cualquier transacción
- Añade notas adicionales por transacción

### 📊 Resumen mensual
- Totales de ingresos, gastos, pagos TDC y balance neto
- Deuda total acumulada en todas las TDC
- Gráfica de barras por categoría de gasto
- Estado de cada tarjeta con fechas de corte y pago

---

## Estructura del proyecto

```
finanzas/
├── backend/
│   ├── main.py          # API FastAPI
│   ├── requirements.txt
│   ├── finanzas.db      # Se crea automáticamente
│   └── uploads/         # Comprobantes adjuntos
└── frontend/
    └── index.html       # App React (sin build necesario)
```

---

## API REST disponible

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /tarjetas | Lista tarjetas con saldos calculados |
| POST | /tarjetas | Crear tarjeta |
| PUT | /tarjetas/{id} | Editar tarjeta |
| DELETE | /tarjetas/{id} | Eliminar tarjeta |
| GET | /transacciones | Listar con filtros (mes, año, tipo, tarjeta) |
| POST | /transacciones | Nueva transacción |
| DELETE | /transacciones/{id} | Eliminar transacción |
| POST | /transacciones/{id}/comprobante | Adjuntar archivo |
| GET | /comprobante/{id} | Descargar comprobante |
| GET | /resumen | Resumen financiero del mes |
