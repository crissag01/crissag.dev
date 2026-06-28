# 🐧 Kernel Hardened Compilado para Dell Latitude 7490

**Objetivo:** Compilar y personalizar un kernel Linux hardened para Dell Latitude 7490 con soporte optimizado para Docker, Ollama, Niri/Wayland y corrección del problema del teclado.

---

## 📁 Archivos de Documentación

Este proyecto contiene 4 archivos principales de guía:

### 1. 📚 **GUIA_COMPILACION_KERNEL.md** ← EMPEZAR AQUÍ
Guía completa paso a paso con:
- Instalación base de Arch Linux
- Descarga del código fuente (dos opciones)
- Personalización menuconfig por sección
- Compilación y instalación
- Troubleshooting general

**Duración estimada:** 3-4 horas (incluyendo compilación)

---

### 2. ⚙️ **CONFIG_CRITICAL_OPTIONS.md**
Lista de opciones exactas de configuración:
- `CONFIG_*` específicos para cada hardware
- Búsquedas rápidas para menuconfig
- Verificación post-compilación
- Recomendaciones por caso de uso

**Usar:** Consultar durante `make menuconfig` para asegurar habilitados los drivers críticos.

---

### 3. 🔧 **SOLUCION_TECLADO_NO_RESPONDE.md**
Diagnóstico y solución específica para problema del teclado:
- 3 tipos de problemas y sus soluciones
- Parámetros de boot: `i8042.direct=1`, etc.
- Configuración de kernel necesaria
- Tests post-instalación
- Plan B con teclado USB

**Usar:** Si después de compilar el teclado no responde.

---

### 4. ⚡ **build-kernel.sh**
Script bash para automatizar compilación:
- Instalación de dependencias
- Descarga automática de fuentes
- Compilación con manejo de errores
- Instalación y configuración GRUB

**Uso:**
```bash
chmod +x build-kernel.sh
./build-kernel.sh all          # Ejecutar todo
./build-kernel.sh prep         # Solo instalar dependencias
./build-kernel.sh fetch        # Solo descargar fuentes
./build-kernel.sh config       # Abrir menuconfig
./build-kernel.sh build        # Compilar
```

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Instalar herramientas
sudo pacman -S --needed base-devel git asp grub

# 2. Clonar este proyecto
git clone [repo] && cd Arch-hardened-v1

# 3. Automatizar todo
chmod +x build-kernel.sh
./build-kernel.sh all

# 4. Reiniciar y seleccionar nuevo kernel en GRUB
sudo reboot

# 5. Verificar
uname -r
```

---

## 📋 Checklist Pre-Compilación

Antes de empezar, verificar:

- [ ] Instalación base de Arch Linux completa
- [ ] Internet funcionando
- [ ] Al menos 40GB libres en SSD
- [ ] 3-4 horas disponibles para compilación
- [ ] Backup de datos importantes
- [ ] Archivo CLAUDE.md actualizado con hardware

---

## 🛠️ Proceso Detallado (Paso a Paso)

### Opción A: Automático (Recomendado)

```bash
./build-kernel.sh all
```

Esto ejecuta automáticamente:
1. ✅ Validar dependencias
2. ✅ Descargar PKGBUILD de linux-hardened
3. ✅ Abrir menuconfig (revisar CONFIG_CRITICAL_OPTIONS.md)
4. ✅ Compilar (1-3 horas)
5. ✅ Instalar paquetes
6. ✅ Actualizar GRUB

### Opción B: Manual (Más control)

```bash
# 1. Preparar entorno
sudo pacman -S --needed base-devel git asp grub
mkdir -p ~/kernel-build && cd ~/kernel-build

# 2. Descargar fuentes
asp export linux-hardened
cd linux-hardened

# 3. Preparar
makepkg -o

# 4. Configurar (revisar CONFIG_CRITICAL_OPTIONS.md)
cd src/linux
make menuconfig

# 5. Compilar (usa todos los cores)
make -j$(nproc)
make modules -j$(nproc)

# 6. Instalar
sudo make install
sudo make modules_install

# 7. Actualizar GRUB
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

---

## ⚙️ Opciones Críticas en menuconfig

**MÍNIMO REQUERIDO para tu hardware:**

```
✓ Processor: Intel Core 2/newer Xeon
✓ CPU Frequency: Intel P-State driver
✓ Graphics: DRM + Intel i915 (para UHD 620)
✓ Input: Keyboard (ATKBD) + PS/2 (SERIO_I8042)
✓ Containers: Namespaces + Cgroups + OverlayFS
✓ Networking: Netfilter + raw sockets (para nmap/tcpdump)
✓ Wireless: WiFi drivers (según modelo)
```

**Consultar CONFIG_CRITICAL_OPTIONS.md para lista completa.**

---

## 🔍 Solución Rápida para Teclado

Si después de compilar el teclado no responde:

**Opción 1: Parámetros de boot (rápido)**
```bash
sudo nano /etc/default/grub

# Cambiar línea:
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet i8042.direct=1 i8042.dumbkbd=0"

sudo grub-mkconfig -o /boot/grub/grub.cfg
sudo reboot
```

**Opción 2: Recompilar (si lo anterior no funciona)**
```bash
cd ~/kernel-build/linux-hardened/src/linux

make menuconfig
# Buscar: /KEYBOARD_ATKBD, /SERIO_I8042, /I8042_DEBUG
# Asegurar que estén [*] habilitados

make -j$(nproc)
sudo make install
sudo make modules_install
sudo grub-mkconfig -o /boot/grub/grub.cfg
sudo reboot
```

**Ver SOLUCION_TECLADO_NO_RESPONDE.md para diagnóstico completo.**

---

## 📊 Especificaciones Hardware

```
Dell Latitude 7490
├─ CPU: Intel Core i5-8350U @ 1.7GHz (4 cores, 8 threads)
├─ RAM: 8 GB DDR4 2400 MT/s (1 slot libre)
├─ GPU: Intel UHD Graphics 620 (Kaby Lake iGPU)
├─ SSD: 239 GB SK Hynix (SATA/NVMe)
├─ Wifi: (depende de modelo)
├─ Storage Controller: SATA/AHCI
└─ Keyboard: AT PS/2 (PS/2 Controller i8042)
```

---

## ✅ Verificación Post-Instalación

```bash
# Verificar kernel instalado
uname -r
uname -a

# Verificar drivers
lsmod | grep i915         # GPU
lsmod | grep atkbd        # Teclado
lsmod | grep overlay      # Docker

# Verificar features críticas
cat /proc/cmdline         # Ver parámetros de boot
grep CONFIG_DOCKER /boot/config-*  # Ver flags Docker
dmesg | grep -i "gpu\|drm\|i915"  # Logs de GPU

# Test de responsividad
cat > /dev/null           # Tipear texto, debe responder al instante
```

---

## 🐛 Troubleshooting

### "La compilación falla con error de sintaxis"
```bash
# Verificar GCC
gcc --version            # Debe ser 14.x+

# Actualizar si es necesario
sudo pacman -S --needed gcc base-devel
```

### "GRUB no encuent ra el kernel"
```bash
# Verificar archivos
ls -l /boot/vmlinuz*
ls -l /boot/initramfs*

# Regenerar
sudo mkinitcpio -p linux-hardened-dell
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

### "Docker no funciona correctamente"
```bash
# Verificar configuración
docker run hello-world

# Revisar logs
sudo journalctl -u docker -n 50
```

---

## 📚 Documentación Adicional

- **GUIA_COMPILACION_KERNEL.md** — Guía paso a paso completa
- **CONFIG_CRITICAL_OPTIONS.md** — Referencia de opciones CONFIG_*
- **SOLUCION_TECLADO_NO_RESPONDE.md** — Diagnóstico y soluciones teclado
- **build-kernel.sh** — Script de automatización

---

## 🎯 Casos de Uso Soportados

Con esta compilación tendrás optimizaciones para:

✅ **Docker & Contenedores**
- Namespaces (PID, NET, IPC, UTS, USER)
- Cgroups v2
- OverlayFS storage driver
- Netfilter para networking

✅ **Ollama & IA Local**
- GPU Intel UHD 620 optimizada (i915)
- CPU frequency scaling para eficiencia térmica
- Memoria: cgroups para limits

✅ **Niri/Qtile + Wayland**
- DRM + i915 drivers
- Framebuffer support
- Input device multiplexing

✅ **Network Scanning**
- Raw sockets (AF_PACKET)
- Netfilter logging
- Wireshark support

✅ **Desarrollo General**
- Compiladores optimizados
- Git, SSH, desarrollo tools
- Debugging symbols

---

## 🔐 Seguridad

Este kernel usa **linux-hardened** que incluye:
- Control Flow Integrity (CFI)
- Stack protectors
- Hardened allocators
- Address Space Layout Randomization (ASLR)
- SELinux/AppArmor ready

**No agrega overhead significativo en i5-8350U.**

---

## 📞 Soporte & Preguntas

Si tienes problemas durante compilación:

1. Revisar los 4 archivos de documentación
2. Ejecutar `./build-kernel.sh verify` para diagnosticar
3. Revisar logs: `dmesg | tail -100`
4. Reportar en kernel.org si es bug del kernel

---

## 📝 Changelog

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2026-05-04 | 1.0 | Versión inicial para Arch Linux + kernel 6.8.x |
| | | ├─ Guía completa de compilación |
| | | ├─ CONFIG_CRITICAL_OPTIONS para Dell Latitude 7490 |
| | | ├─ Script de automatización build-kernel.sh |
| | | └─ Solución específica para problema del teclado |

---

## 📄 Licencia

Esta documentación es software libre bajo licencia Creative Commons BY-SA 4.0.

El kernel Linux es bajo GNU GPL v2. Ver: https://www.kernel.org/doc/html/latest/process/license-rules.html

---

**Creado:** 2026-05-04
**Hardware Target:** Dell Latitude 7490
**Kernel:** linux-hardened 6.8.x
**Distribución:** Arch Linux

**¡Buena compilación!** 🔧🐧

