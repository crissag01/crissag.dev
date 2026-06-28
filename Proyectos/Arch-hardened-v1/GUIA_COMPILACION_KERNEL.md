# 🔧 Guía de Compilación: Kernel Linux Hardened para Dell Latitude 7490

**Hardware Target:** Dell Latitude 7490 | Intel i5-8350U | Intel UHD 620 | 8GB RAM | SSD 239GB

**Objetivo:** Compilar kernel hardened personalizado en Arch Linux con soporte Docker, Ollama, Niri+Wayland, y corrección del problema del teclado.

---

## 📋 Índice
1. [Preparación del Sistema](#preparación-del-sistema)
2. [Obtener el Código Fuente](#obtener-el-código-fuente)
3. [Personalizar Configuración .config](#personalizar-configuración-config)
4. [Compilar el Kernel](#compilar-el-kernel)
5. [Instalar y Bootear](#instalar-y-bootear)
6. [Solucionar Problema del Teclado](#solucionar-problema-del-teclado)

---

## 1. Preparación del Sistema

### Instalación Base de Arch Linux
Si aún no tienes Arch instalado:

```bash
# Conectar a internet
iwctl
# (dentro del prompt de iwd):
# > device list
# > station wlan0 connect "SSID"
# > exit

# Obtener las mirrors más rápidas
reflector --country MX,US --age 12 --sort rate --protocol https --save /etc/pacman.d/mirrorlist

# Instalar base del sistema
pacstrap /mnt base linux linux-firmware base-devel git grub efibootmgr
```

### Instalar Herramientas de Compilación

```bash
sudo pacman -S --needed base-devel git asp

# asp = Arch Source Packages (herramienta oficial para obtener PKGBUILD)
```

---

## 2. Obtener el Código Fuente

### Opción A: Usar PKGBUILD Oficial de Arch (Recomendado)

```bash
# Crear directorio de trabajo
mkdir -p ~/kernel-build
cd ~/kernel-build

# Clonar el PKGBUILD de linux-hardened
asp export linux-hardened

cd linux-hardened

# Estructura que obtendrás:
# ├── PKGBUILD           (instrucciones de compilación)
# ├── config             (configuración base de Arch)
# ├── config.x86_64      (config específica de x86_64)
# ├── linux-hardened.install
# ├── sphinx.patch       (opcional)
# └── .
```

### Opción B: Descargar Directo desde kernel.org (Si prefières más control)

```bash
cd ~/kernel-build
wget https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.8.10.tar.xz
tar xf linux-6.8.10.tar.xz
cd linux-6.8.10
```

---

## 3. Personalizar Configuración .config

### Paso 1: Generar .config Base

**Si usas PKGBUILD (opción A):**
```bash
cd ~/kernel-build/linux-hardened
makepkg -o    # Descarga fuentes y prepara entorno (sin compilar aún)

# Copia la configuración
cp config.x86_64 src/linux/.config
cd src/linux
```

**Si usas kernel directo (opción B):**
```bash
cd ~/kernel-build/linux-6.8.10
cp /boot/config-$(uname -r) .config  # Usar config existente como base
```

### Paso 2: Abrir menuconfig

```bash
make menuconfig
```

### Configuración Específica para tu Hardware

#### **CPU (Intel i5-8350U)**

```
Processor type and features
  → Processor family: Core 2/newer Xeon
  → [*] Kaby Lake support
  
Power management and ACPI options
  → CPU Frequency scaling
    → [*] CPU Frequency scaling
    → Default CPUFreq governor: ondemand (o powersave para batería)
    → Intel P-State cpufreq driver
      → [*] Intel P-State CPU frequency driver
      → [*] Intel P-State use ACPI _PPC methods
```

#### **GPU (Intel UHD 620 - Kaby Lake iGPU)**

```
Device Drivers
  → Graphics support
    → [*] Direct Rendering Manager (DRM)
    → [*] Intel 8xx/9xx/G3x/G4x/HD Graphics
      → [*] Enable preliminary support for future Intel GPUs
      → [*] Enable GuC submission
      → [*] Enable HuC loading
```

#### **Entrada (TECLADO - Crítico)**

```
Device Drivers
  → Input device support
    → [*] Keyboard support
    → PS/2 mice
      → [*] PS/2 mouse protocol extension (IMPS/2)
    
  → HID support
    → [*] Generic HID device support
    → [*] USB HID support
      → [*] HID support
```

#### **Contenedores Docker & Virtualización**

```
General setup
  → [*] Namespaces support
    → [*] PID namespace support
    → [*] IPC namespace support
    → [*] UTS namespace support
    → [*] Network namespace support
    → [*] User namespace support
  → [*] Cgroups support
    → [*] CPU accounting
    → [*] CPUsets support
    → [*] Memory controller

File systems
  → [*] Overlay filesystem support (OVERLAY_FS)
  
Networking support
  → Networking options
    → [*] Netfilter support
      → [*] Netfilter connection tracking
      → Network Packet filtering framework
        → [*] Netfilter Xtables support
          → [*] "cgroup" match support
```

#### **Wayland + Compositor (Niri/Qtile)**

```
Device Drivers
  → Graphics support
    → [*] DRM DP AUX Interface (para monitors)
    → Framebuffer
      → [*] Simple framebuffer support
```

#### **Audio (si planeas usar audio)**

```
Device Drivers
  → Sound
    → [*] Sound card support
    → Advanced Linux Sound Architecture
      → [*] Intel HD Audio
```

#### **Networking**

```
Device Drivers
  → Network device support
    → Intel Ethernet
      → [*] Intel(R) PRO/1000 PCI-Express Gigabit Ethernet support (si aplica)

Wireless LAN
  → [*] cfg80211 wireless extensions support
  → [*] Intel Wireless WiFi
```

#### **USB (para teclado/mouse USB)**

```
Device Drivers
  → USB support
    → [*] Support for Host-side USB
    → [*] XHCI HCD (USB 3.0) support
    → [*] EHCI HCD support
```

### Paso 3: Búsquedas Importantes (usar "/" en menuconfig)

```
/ HARDENING      → Asegurar que está todo habilitado
/ STACK_GUARD    → [*] Stack canary support
/ CFI             → [*] Control flow integrity
/ DEBUG_LIST      → Debug list corruptions
```

### Paso 4: Guardar y Salir

```
<Save>     → Enter
<Exit>     → Escape hasta salir
```

---

## 4. Compilar el Kernel

### Opción A: Compilar con PKGBUILD (Recomendado - Maneja todo automáticamente)

```bash
cd ~/kernel-build/linux-hardened

# Editar PKGBUILD para cambiar el nombre (opcional)
nano PKGBUILD

# Cambiar la línea:
# pkgbase=linux-hardened
# a:
# pkgbase=linux-hardened-dell

# Compilar (esto puede tomar 1-3 horas)
makepkg -s

# -s: Instala dependencias automáticamente
```

### Opción B: Compilar Manualmente (Más control)

```bash
cd ~/kernel-build/linux-6.8.10

# Compilar kernel (usa todos los cores: -j$(nproc))
make -j$(nproc)

# Compilar módulos
make modules -j$(nproc)

# Instalar
sudo make install
sudo make modules_install
```

### Monitorear Compilación

```bash
# En otra terminal, monitorear progreso
watch -n 2 'ps aux | grep -E "gcc|ld" | wc -l'

# O ver consumo de RAM
watch -n 2 'free -h'
```

---

## 5. Instalar y Bootear

### Instalación GRUB (si usas PKGBUILD)

```bash
cd ~/kernel-build/linux-hardened

# Los .pkg.tar.zst se generarán en el directorio actual
ls -lh *.pkg.tar.zst

# Instalar el paquete
sudo pacman -U linux-hardened-dell-*.pkg.tar.zst
sudo pacman -U linux-hardened-dell-headers-*.pkg.tar.zst

# Regenerar initramfs (automático si usas pacman)
```

### Actualizar GRUB

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

### Bootear con el Nuevo Kernel

```bash
# Reiniciar
sudo reboot

# En GRUB, seleccionar el nuevo kernel
# Verificar que booteó correctamente:
uname -r          # Debería mostrar 6.8.10-arch1-1 (o tu versión)
uname -a

# Verificar módulos cargados
lsmod | head -20
```

---

## 6. Solucionar Problema del Teclado

Si después de bootear el teclado responde lentamente o no responde:

### Opción A: Parámetros del Kernel (RÁPIDO)

Editar `/etc/default/grub`:

```bash
sudo nano /etc/default/grub

# Encontrar esta línea:
# GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet"

# Cambiar a:
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet i8042.direct=1 i8042.dumbkbd=0"

# Guardar (Ctrl+O, Enter, Ctrl+X)

# Regenerar GRUB
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Reiniciar
sudo reboot
```

**Explicación de parámetros:**
- `i8042.direct=1` → Bypass BIOS SMM (System Management Mode)
- `i8042.dumbkbd=0` → No dejar el teclado en modo "tonto"

### Opción B: Reconfigurar Kernel .config (más exhaustivo)

Si los parámetros no funcionan:

```bash
cd ~/kernel-build/linux-hardened/src/linux

make menuconfig
```

Buscar y cambiar:

```
Device Drivers
  → Input device support
    → Keyboard
      → [*] AT keyboard
        → [*] AT keyboard debugging
        → Use previous polling mode (legacy)
```

Recompilar:

```bash
make -j$(nproc)
sudo make install
sudo make modules_install
sudo grub-mkconfig -o /boot/grub/grub.cfg
sudo reboot
```

### Opción C: Aumentar Debug Info (para diagnosticar)

```bash
# Durante boot, antes de apagar:
dmesg | grep -i "i8042\|keyboard\|input"

# Si hay errores, buscar en logs:
sudo journalctl -b | grep -i keyboard
```

---

## 📊 Estimación de Tiempos

| Fase | Tiempo |
|------|--------|
| Instalación base Arch | 30-45 min |
| Descargar fuentes | 10-15 min |
| make menuconfig | 15-30 min |
| Compilación kernel | 1-2.5 horas (según CPU) |
| Compilación módulos | 20-40 min |
| Instalación + GRUB | 5-10 min |
| **Total estimado** | **2.5-4.5 horas** |

---

## ⚡ Optimizaciones de Compilación (Avanzado)

Si quieres acelerar compilación:

```bash
# En PKGBUILD, cambiar:
# MAKEFLAGS="-j$(nproc) -l$(nproc)"

# O usar ccache:
sudo pacman -S ccache
export CC="ccache gcc"
export CXX="ccache g++"
```

---

## 🐛 Troubleshooting

### Compilación falla con "error: array subscript..."
→ Es problema conocido en algunos kernels. Usar GCC actualizado:
```bash
sudo pacman -S --needed gcc base-devel
gcc --version  # Debe ser 14.x o superior
```

### Módulos no se encuentran
→ Regenerar initramfs:
```bash
sudo mkinitcpio -p linux-hardened-dell
```

### GRUB no bootea el kernel
→ Verificar que los archivos están en `/boot`:
```bash
ls -l /boot/vmlinuz* /boot/initramfs*
```

---

## ✅ Verificación Post-Instalación

```bash
# Verificar kernel
uname -r

# Verificar hardening está activo
cat /proc/cmdline | grep -i hardened

# Verificar GPU
lspci | grep -i vga
glxinfo | grep "OpenGL version"

# Verificar Docker preparado
docker ps  # Si Docker está instalado

# Verificar teclado responsivo
# Probar en terminal:
cat > /dev/null  # Tipear algo, debe responder inmediatamente
```

---

## 📚 Referencias

- [Arch Wiki: Kernel Compilation](https://wiki.archlinux.org/title/Kernel/Arch_build_system)
- [Linux Kernel Kconfig Documentation](https://www.kernel.org/doc/html/latest/kbuild/kconfig.html)
- [i915 DRM Documentation](https://www.kernel.org/doc/html/latest/gpu/i915.html)
- [i8042 Controller Documentation](https://www.kernel.org/doc/html/latest/input/devices/atkbd.html)

---

**Última actualización:** 2026-05-04
**Kernel Target:** 6.8.x (actual)
**Hardware:** Dell Latitude 7490

