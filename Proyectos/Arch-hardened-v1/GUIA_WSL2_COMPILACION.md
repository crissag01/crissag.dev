# 🐧 Compilar Kernel Hardened en WSL2 + Instalar en Dell Latitude 7490

**Estrategia:** Compilar el kernel en WSL2 (desde Windows), luego instalar en Dell Latitude 7490 con Arch Linux limpio.

**Ventajas:**
- Compilas sin reinstalar Windows
- Compilación potencialmente más rápida (tu PC vs i5-8350U)
- Reversible: puedes desinstalar WSL2
- Los binarios funcionan igual en hardware real x86_64

---

## 📋 Índice

1. [Preparar WSL2](#preparar-wsl2)
2. [Instalar Arch en WSL2](#instalar-arch-en-wsl2)
3. [Compilar Kernel en WSL2](#compilar-kernel-en-wsl2)
4. [Preparar USB para Dell](#preparar-usb-para-dell)
5. [Instalar Arch + Kernel en Dell](#instalar-arch--kernel-en-dell)

---

## 1. Preparar WSL2

### Verificar que WSL2 está instalado

En PowerShell (como Admin):

```powershell
wsl --list --verbose

# Debería mostrar algo como:
# NAME      STATE      VERSION
# Ubuntu    Running    2
```

Si no está instalado:

```powershell
wsl --install

# Esto instala WSL2 + Ubuntu por defecto
```

### Aumentar recursos para WSL2

Crear/editar `C:\Users\criss\.wslconfig`:

```ini
[wsl2]
memory=6GB
processors=6
swap=2GB
localhostForwarding=true
guiApplications=false
```

Aplicar cambios:

```powershell
wsl --shutdown
# Esperar 5 segundos
wsl
```

---

## 2. Instalar Arch en WSL2

### Opción A: Instalar Arch desde Microsoft Store (Más fácil)

```powershell
# En Microsoft Store, buscar "Arch"
# Instalar "Arch Linux" (por Whitewaterfoundry)
```

### Opción B: Instalar Arch Manualmente (Más control)

```powershell
# Descargar imagen de Arch para WSL2
cd $env:USERPROFILE\Downloads

# Descargar rootfs
$ProgressPreference = 'SilentlyContinue'
wget https://github.com/yuk7/ArchWSL/releases/download/20.2.0.0/Arch.zip -O Arch.zip

# Extraer
Expand-Archive Arch.zip -DestinationPath Arch

cd Arch

# Registrar en WSL2
.\Arch.exe

# Esto abre una terminal de Arch. Verificar:
uname -a  # Debería mostrar "x86_64"
```

### Inicializar Arch

```bash
# Una vez dentro de Arch en WSL2

# Actualizar sistema
pacman -Syu

# Instalar herramientas de compilación
sudo pacman -S --needed base-devel git asp grub

# Crear usuario (opcional pero recomendado)
useradd -m -G wheel criss
passwd criss

# Habilitar sudo para wheel group
sed -i 's/# %wheel ALL=(ALL:ALL) ALL/%wheel ALL=(ALL:ALL) ALL/' /etc/sudoers

# Cambiar a nuevo usuario
su - criss
```

---

## 3. Compilar Kernel en WSL2

### Paso 1: Preparar Entorno

```bash
# En WSL2 Arch como usuario regular (criss)

mkdir -p ~/kernel-build
cd ~/kernel-build

# Instalar asp (Arch Source Package tool)
sudo pacman -S asp

# Descargar PKGBUILD de linux-hardened
asp export linux-hardened
cd linux-hardened
```

### Paso 2: Preparar Compilación

```bash
# Preparar archivos (descarga fuentes)
makepkg -o

# Esto puede tardar 10-15 minutos
# Verás algo como: "linux-6.8.x.tar.xz"
```

### Paso 3: Abrir menuconfig

```bash
cd src/linux

make menuconfig
```

**Aquí debes configurar según CONFIG_CRITICAL_OPTIONS.md**

**IMPORTANTE:** Las opciones clave para tu Dell Latitude 7490:

```
✅ CPU: Processor family → Core 2/newer Xeon
✅ CPU Freq: Intel P-State driver habilitado
✅ GPU: DRM + Intel i915
✅ Input: Keyboard (ATKBD) + PS/2 (SERIO_I8042)
✅ Containers: Namespaces + Cgroups + OverlayFS
✅ Network: Netfilter + raw sockets
```

Guardar y salir (Save → Exit)

### Paso 4: Compilar

```bash
# Desde ~/kernel-build/linux-hardened

# Compilar (usará todos los procesadores)
makepkg -s

# Esto tarda 1-3 horas dependiendo de tu CPU
```

**Monitorear progreso** (en otra terminal WSL2):

```bash
watch -n 2 'ps aux | grep gcc | wc -l'
free -h
```

### Paso 5: Resultado

Los paquetes compilados estarán aquí:

```bash
ls -lh ~/kernel-build/linux-hardened/*.pkg.tar.zst

# Deberías ver:
# linux-hardened-6.8.x-x.pkg.tar.zst
# linux-hardened-headers-6.8.x-x.pkg.tar.zst
# linux-hardened-docs-6.8.x-x.pkg.tar.zst
```

---

## 4. Preparar USB para Dell

### Paso 1: Descargar Arch ISO desde Windows

```powershell
# En PowerShell como Admin

cd $env:USERPROFILE\Downloads

# Descargar ISO de Arch Linux
$ProgressPreference = 'SilentlyContinue'
wget https://mirror.rackspace.com/archlinux/iso/2026.05.04/archlinux-2026.05.04-x86_64.iso -O arch.iso

# Verificar descarga
ls -l arch.iso  # ~800 MB
```

### Paso 2: Crear USB Booteable

**Opción A: Usar Rufus (Interfaz gráfica)**

1. Descargar Rufus: https://rufus.ie/
2. Conectar USB (mínimo 2GB)
3. Abrir Rufus
4. Seleccionar:
   - Device: tu USB
   - Boot selection: arch.iso
   - Partition scheme: GPT
   - File system: FAT32
5. Presionar START

**Opción B: Usar PowerShell (Línea de comandos)**

```powershell
# Listar USBs disponibles
Get-Disk | Where {$_.BusType -eq "USB"}

# Reemplazar X con el número del disco USB
$usb = "\\.\PhysicalDriveX"

# Escribir ISO
dd if=arch.iso of=$usb bs=4M status=progress

# Desconectar USB
eject $usb
```

---

## 5. Instalar Arch + Kernel en Dell

### Paso 1: Preparar USB con Kernel Compilado

Antes de crear la instalación en Dell, copiar los .pkg.tar.zst a la USB:

```bash
# En WSL2, copiar paquetes compilados a una carpeta compartida

mkdir -p /mnt/c/Users/criss/Desktop/arch-kernel

cp ~/kernel-build/linux-hardened/*.pkg.tar.zst \
   /mnt/c/Users/criss/Desktop/arch-kernel/
```

Luego desde Windows:
- Conectar USB Arch
- Copiar archivos de `Desktop/arch-kernel/` a la USB en carpeta `kernel-packages/`

### Paso 2: Boot desde USB en Dell Latitude 7490

1. Insertar USB en Dell
2. Reiniciar Dell (F12 o DEL para entrar a boot menu)
3. Seleccionar USB como dispositivo de boot
4. Esperar a prompt de Arch installer

### Paso 3: Instalar Arch Linux Base

```bash
# En el installer de Arch desde USB

# 1. Conectar a WiFi
iwctl
# device list
# station wlan0 connect "SSID"
# exit

# 2. Obtener mirrors rápidos
reflector --country MX,US --age 12 --sort rate --save /etc/pacman.d/mirrorlist

# 3. Particionar disco (ejemplo para SSD 239GB)
lsblk  # Identificar tu disco (probablemente /dev/nvme0n1 o /dev/sda)

# Usar cfdisk para particionar interactivamente
cfdisk /dev/nvme0n1

# Crear particiones:
# 550M  - EFI Boot (/boot)
# 8G    - Swap
# 230G  - Root (/)

# Formatear
mkfs.fat -F 32 /dev/nvme0n1p1      # EFI
mkswap /dev/nvme0n1p2               # Swap
mkfs.ext4 /dev/nvme0n1p3            # Root

# 4. Montar particiones
mount /dev/nvme0n1p3 /mnt
mkdir -p /mnt/boot
mount /dev/nvme0n1p1 /mnt/boot
swapon /dev/nvme0n1p2

# 5. Instalar base del sistema
pacstrap /mnt base linux linux-firmware base-devel git grub efibootmgr

# 6. Generar fstab
genfstab -U /mnt >> /mnt/etc/fstab

# 7. Entrar en chroot
arch-chroot /mnt
```

### Paso 4: Configuración Post-Instalación

```bash
# Ya dentro del chroot en /mnt

# Zona horaria
ln -sf /usr/share/zoneinfo/America/Mexico_City /etc/localtime
hwclock --systohc

# Locales
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf

# Hostname
echo "archlinux-dell" > /etc/hostname

# Contraseña root
passwd

# Crear usuario
useradd -m -G wheel criss
passwd criss

# Habilitar sudo
sed -i 's/# %wheel ALL=(ALL:ALL) ALL/%wheel ALL=(ALL:ALL) ALL/' /etc/sudoers

# Instalar GRUB
pacman -S grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg
```

### Paso 5: Instalar Kernel Compilado

```bash
# Aún en chroot

# Montar la USB (si la conectaste)
mkdir -p /mnt-usb
mount /dev/sdX1 /mnt-usb  # Reemplazar X con tu USB

# Copiar paquetes kernel
cp /mnt-usb/kernel-packages/*.pkg.tar.zst /tmp/

# Instalar
pacman -U /tmp/linux-hardened-*.pkg.tar.zst

# Si faltan dependencias, instalar primero:
pacman -S kmod mkinitcpio
```

### Paso 6: Configurar Teclado (Si Necesitas)

```bash
# En /etc/default/grub

nano /etc/default/grub

# Cambiar:
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet"

# A:
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet i8042.direct=1 i8042.dumbkbd=0"

# Guardar y regenerar GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Salir del chroot
exit

# Desmontar todo
umount -R /mnt
```

### Paso 7: Boot en Dell con Nuevo Kernel

```bash
# Reiniciar Dell
reboot

# Debería bootear con el kernel hardened compilado
# Verificar:
uname -r  # Debería mostrar "6.8.x-x-arch1-1" o similar
```

---

## ✅ Verificación Final

```bash
# Después de instalar en Dell

# 1. Verificar kernel
uname -r
uname -a

# 2. Verificar drivers
lsmod | grep i915       # GPU
lsmod | grep atkbd      # Teclado
lsmod | grep overlay    # Docker

# 3. Verificar hardware
lspci | grep -i vga     # GPU
cat /proc/cpuinfo       # CPU

# 4. Test de teclado
cat > /dev/null  # Tipear algo, debe responder al instante
```

---

## 🎯 Timeline Estimado

| Fase | Tiempo |
|------|--------|
| Preparar WSL2 | 10 min |
| Instalar Arch en WSL2 | 15 min |
| Compilación en WSL2 | 1-3 horas |
| Preparar USB e ISO | 20 min |
| Instalación Arch en Dell | 30-45 min |
| **Total** | **2.5-4.5 horas** |

---

## 🚨 Troubleshooting

### "WSL2 compilación muy lenta"
→ Revisar recursos asignados: `C:\Users\criss\.wslconfig`
→ Cerrar otras aplicaciones en Windows

### "Kernel compilado no bootea en Dell"
→ Verificar que menuconfig incluye soporte para tu hardware
→ Ver SOLUCION_TECLADO_NO_RESPONDE.md

### "Falta partición EFI en Dell"
→ Asegurar que BIOS está en modo UEFI (no Legacy)
→ Verificar con: `ls /sys/firmware/efi`

### "USB no es reconocido en Dell"
→ Probar con otro puerto USB
→ Recrear USB con Rufus en modo ISO (no DD)

---

## 📚 Documentación Relacionada

- **CONFIG_CRITICAL_OPTIONS.md** — Opciones exactas para menuconfig
- **SOLUCION_TECLADO_NO_RESPONDE.md** — Si teclado no responde
- **GUIA_COMPILACION_KERNEL.md** — Guía detallada (alternativa)

---

**Creado:** 2026-05-04
**Target:** Dell Latitude 7490 vía WSL2
**Kernel:** linux-hardened 6.8.x

