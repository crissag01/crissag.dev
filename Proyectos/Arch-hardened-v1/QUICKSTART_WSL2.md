# ⚡ Quick Start: Compilar Kernel en WSL2 (5 pasos)

**Objetivo:** Compilar kernel hardened en WSL2 desde Windows, instalar en Dell Latitude 7490.

**Tiempo total:** ~3-4 horas (compilación automática)

---

## 📋 Checklist Pre-Requisitos

- ✅ WSL2 instalado (verificar: `wsl --list --verbose`)
- ✅ 4+ GB RAM disponible
- ✅ 40+ GB SSD libre en Windows
- ✅ Arch Linux en WSL2 (o Ubuntu con base-devel)

---

## 🚀 5 Pasos Rápidos

### 1️⃣ Abrir Terminal WSL2

Desde Windows, abrir PowerShell:

```powershell
wsl
```

Entrarás a una terminal Linux.

---

### 2️⃣ Descargar el Script

```bash
# En WSL2

# Si no tienes el repositorio, clonar:
git clone https://github.com/tu-repo/Arch-hardened-v1.git
cd Arch-hardened-v1

# O si ya lo tienes:
cd /path/to/Arch-hardened-v1

# Hacer el script ejecutable
chmod +x build-kernel-wsl2.sh
```

---

### 3️⃣ Ejecutar Compilación Automática

```bash
./build-kernel-wsl2.sh all
```

Esto hará automáticamente:

1. Verificar WSL2 ✅
2. Descargar código fuente ✅
3. **Abrir menuconfig** (aquí configuras el kernel)
4. Compilar en background ✅
5. Exportar a Windows ✅

---

### 4️⃣ Responder a menuconfig

Cuando se abra `menuconfig`, revisar opciones clave:

```
/ KEYBOARD_ATKBD      → debe estar [*]
/ SERIO_I8042         → debe estar [*]
/ OVERLAY_FS          → debe estar [*]
/ DRM_I915            → debe estar [*]
```

Guardar (Save) y salir (Exit).

**Si no sabes qué cambiar:** Simplemente guardar sin cambios (los defaults funcionan).

---

### 5️⃣ Esperarás 1-3 Horas

Verás algo como:

```
[INFO] Compilando kernel (esto puede tardar 1-3 horas)
[INFO] Usando 8 jobs paralelos...
[INFO] Inicio: 2026-05-04 10:30:00
```

Mientras compila, puedes usar tu PC normal (en Windows).

Cuando termine:

```
[INFO] Fin: 2026-05-04 12:45:00
✓ Compilación completada exitosamente
```

Los archivos compilados estarán aquí:

```
C:\Users\criss\Desktop\kernel-compiled\
├── linux-hardened-6.8.x-x.pkg.tar.zst
├── linux-hardened-headers-6.8.x-x.pkg.tar.zst
└── linux-hardened-docs-6.8.x-x.pkg.tar.zst
```

---

## 📦 Próximo Paso: Instalar en Dell

Una vez compilado, sigue estos pasos **en Windows**:

### Paso A: Crear USB Booteable

Descargar Rufus: https://rufus.ie/

```
1. Conectar USB (2GB+)
2. Abrir Rufus
3. Seleccionar arch.iso (descargar: https://archlinux.org/download/)
4. Presionar START
5. Esperar a "READY"
6. Eyectar USB
```

### Paso B: Copiar Kernel a USB

```powershell
# En PowerShell como Admin

# Mostrar discos
Get-Disk | Where {$_.BusType -eq "USB"}

# Montaremos la USB después de crear la partición Arch
```

### Paso C: Instalar en Dell

1. Insertar USB en Dell Latitude 7490
2. Reiniciar y presionar **F12** (boot menu)
3. Seleccionar USB
4. Seguir: **GUIA_WSL2_COMPILACION.md** sección 5

---

## 🎯 Alternativa: Si Algo Sale Mal

Si la compilación falla:

```bash
# Limpiar y reintentar
./build-kernel-wsl2.sh cleanup

# Ver logs de error
dmesg | tail -50

# Consultar la guía completa
less GUIA_WSL2_COMPILACION.md
```

---

## 📚 Documentación Disponible

| Archivo | Propósito |
|---------|-----------|
| **QUICKSTART_WSL2.md** | Este (paso rápido) |
| **GUIA_WSL2_COMPILACION.md** | Guía detallada con explicaciones |
| **CONFIG_CRITICAL_OPTIONS.md** | Referencia de opciones CONFIG_ |
| **SOLUCION_TECLADO_NO_RESPONDE.md** | Si teclado no responde |
| **build-kernel-wsl2.sh** | Script de automatización |

---

## 💡 Tips

**Para acelerar compilación en WSL2:**

```bash
# Aumentar recursos en C:\Users\criss\.wslconfig

[wsl2]
memory=6GB
processors=6
swap=2GB
```

**Para ver progreso:**

```bash
# En otra terminal WSL2, mientras compila:
watch -n 2 'ps aux | grep gcc | wc -l'
watch -n 2 'free -h'
```

---

## ❓ FAQ Rápida

**P: ¿Puedo apagar Windows mientras compila?**
R: No. WSL2 necesita Windows ejecutándose.

**P: ¿Cuánto tarda la compilación?**
R: 1-3 horas (depende de tu CPU. Más cores = más rápido).

**P: ¿Los binarios compilados funcionan en Dell?**
R: Sí. Son x86_64 en ambos casos.

**P: ¿Si fallo durante menuconfig?**
R: Solo guarda y sale. Reintentas después: `./build-kernel-wsl2.sh build`

**P: ¿Puedo usar la compilación en WSL2 permanentemente?**
R: Sí, pero la guía es para instalar Arch limpio en Dell.

---

## 🚀 RESUMEN DE COMANDOS

```bash
# En WSL2, dentro del directorio del proyecto:

chmod +x build-kernel-wsl2.sh        # Hacer ejecutable

./build-kernel-wsl2.sh all           # COMANDO PRINCIPAL
                                      # (compila automáticamente)

# Si solo quieres un paso:
./build-kernel-wsl2.sh fetch         # Descargar fuentes
./build-kernel-wsl2.sh config        # menuconfig
./build-kernel-wsl2.sh build         # Compilar
./build-kernel-wsl2.sh export        # Exportar a Windows
./build-kernel-wsl2.sh cleanup       # Limpiar archivos
```

---

## ✅ Checklist Final

Después de compilar, verificar:

- [ ] Archivos .pkg.tar.zst en `C:\Users\criss\Desktop\kernel-compiled\`
- [ ] USB Arch booteable creada
- [ ] Kernel .pkg copiados a USB
- [ ] Ready para instalar en Dell

---

**¡Ahora ejecuta: `./build-kernel-wsl2.sh all` en WSL2** 🚀

