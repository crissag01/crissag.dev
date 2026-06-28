# 🔧 Solución: Teclado No Responde en Instalación/Boot

Este es un problema común en laptops Dell, especialmente durante la instalación de Linux o en los primeros boots. La causa suele ser la **falta de drivers PS/2 o conflictos con el SMM (System Management Mode) del BIOS**.

---

## 🚀 Solución Rápida (Antes de Compilar)

### Paso 1: Parámetros de Boot Temporales

Cuando el teclado no responde, agregar parámetros en el prompt de GRUB:

1. En el menú GRUB, seleccionar tu kernel
2. Presionar `E` para editar
3. Encontrar la línea que comienza con `linux` y al final agregar:

```
i8042.direct=1 i8042.dumbkbd=0 i8042.reset=1
```

Debería verse así:
```
linux /vmlinuz-linux-hardened root=/dev/sdX rw loglevel=3 quiet i8042.direct=1 i8042.dumbkbd=0 i8042.reset=1
```

4. Presionar `Ctrl+X` para bootear con estos parámetros

---

## ⚙️ Solución Permanente (GRUB)

Si los parámetros funcionan, hacerlos permanentes:

```bash
sudo nano /etc/default/grub
```

Encontrar esta línea:
```
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet"
```

Cambiar a:
```
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet i8042.direct=1 i8042.dumbkbd=0"
```

Guardar y salir (`Ctrl+O`, Enter, `Ctrl+X`)

Regenerar GRUB:
```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
sudo reboot
```

---

## 🔍 Diagnóstico: ¿Cuál es el Problema Real?

Antes de compilar el kernel, identifica exactamente cuál es el problema:

### Tipo 1: Teclado No Responde Completamente (Congelado)

**Síntomas:**
- Teclado completamente muerto durante boot
- Ni siquiera responde a Caps Lock
- Sin luces de feedback

**Causa:** Controlador 8042 no inicializado correctamente, SMM interfiere

**Solución:**
```
i8042.direct=1           # Bypass BIOS SMM
i8042.reset=1            # Forzar reset del controlador
```

### Tipo 2: Teclado Lento o Intermitente

**Síntomas:**
- Teclado funciona pero con lag
- Algunas teclas no responden
- Funciona mejor después de esperar

**Causa:** Polling en lugar de interrupciones, o timeout de inicialización

**Solución:**
```
i8042.dumbkbd=0          # No confundir teclado
i8042.noacpi=1           # Ignorar ACPI PS/2
```

### Tipo 3: Teclado No Responde SOLO Durante Instalación

**Síntomas:**
- Funciona bien en BIOS/UEFI
- Se congela apenas inicia el instalador
- Funciona después de instalar

**Causa:** Instaladores (Arch, Ubuntu) no cargan drivers PS/2 en initramfs

**Solución:**
```
# En el instalador, presionar Tab y agregar:
atkbd.reset=1 i8042.direct=1

# O agregar a /etc/mkinitcpio.conf después de instalar:
MODULES=(atkbd i8042)
```

---

## 🛠️ Configuración del Kernel (Revisión Checklist)

Si los parámetros de boot no funcionan, estos DEBEN estar habilitados en el kernel:

### En menuconfig, verificar:

```
Device Drivers
  → Input device support
    ☑ [*] Keyboard support
    ☑ [*] AT keyboard
       ☑ [*] AT keyboard debugging          ← CRÍTICO
    ☑ [*] PS/2 mice
       ☑ [*] PS/2 mouse protocol extension  ← CRÍTICO

  → HID support
    ☑ [*] Generic HID device support
    ☑ [*] USB HID support
    ☑ [*] HID support

Drivers
  → I/O support
    ☑ [*] 8042 PS/2 controller
    ☑ [*] Serio devices
```

**Si alguno de estos está deshabilitado ([ ]), el teclado no funcionará.**

---

## 📋 Opciones de Kernel Exactas

Estas opciones DEBEN estar en tu `.config`:

```
CONFIG_INPUT=y
CONFIG_INPUT_KEYBOARD=y
CONFIG_KEYBOARD_ATKBD=y              ← OBLIGATORIO
CONFIG_KEYBOARD_ATKBD_HP_KEYCODES=y
CONFIG_SERIO=y                       ← OBLIGATORIO
CONFIG_SERIO_I8042=y                 ← OBLIGATORIO
CONFIG_SERIO_LIBPS2=y
CONFIG_SERIO_SERPORT=y
CONFIG_HID=y
CONFIG_HID_GENERIC=y
CONFIG_USB_HID=y
CONFIG_HID_SUPPORT=y

# Deshabilitar polling (usa interrupciones):
# CONFIG_I8042_POLL_EVERY_MS no debe existir o =0
```

Si compilas y aún no funciona, agregar:

```
CONFIG_EARLY_PRINTK=y          # Mensajes tempranos para debug
CONFIG_INPUT_DEBUG=y           # Debug de input
CONFIG_I8042_DEBUG=y           # Debug específico del controlador
```

Luego revisar:
```bash
dmesg | grep -i i8042
dmesg | grep -i keyboard
```

---

## 🔧 Pasos de Compilación CON Soporte Teclado

### 1. Editar archivo de compilación

```bash
cd ~/kernel-build/linux-hardened
```

### 2. Modificar PKGBUILD para agregar parámetro de boot por defecto

```bash
nano PKGBUILD

# Agregar esta línea antes de "pkgbase=":
# BOOT_PARAMS="i8042.direct=1 i8042.dumbkbd=0"
```

### 3. Durante menuconfig, asegurar configuración:

```bash
make menuconfig

# Buscar y verificar:
/KEYBOARD_ATKBD      → Debe estar [*] habilitado
/SERIO_I8042         → Debe estar [*] habilitado
/I8042_DEBUG         → Puede estar [*] para debugging
```

### 4. Compilar normalmente

```bash
makepkg -s
```

---

## 🧪 Test Post-Instalación

Después de instalar el kernel, hacer estas pruebas:

### Test 1: Verificar drivers cargados

```bash
# Debería mostrar "atkbd" y "i8042"
lsmod | grep -E "atkbd|i8042"

# Debería mostrar información del controlador
sudo dmesg | grep -i "i8042" | head -5
```

### Test 2: Información del teclado

```bash
# Listar dispositivos input
cat /proc/bus/input/devices

# Debería haber algo como:
# N: Name="AT Translated Set 2 keyboard"
# H: Handlers=sysrq kbd event...
```

### Test 3: Respuesta en vivo

```bash
# Presionar teclas y verificar que el sistema responde
# En otra terminal:
watch -n 0.1 'date +%s%N'

# El output debería actualizar con cada keypress (milisegundos)
```

---

## 🚨 Plan B: Si Nada Funciona

### Usar teclado USB externo

Si tienes un teclado USB a mano:

1. Durante boot, conectar teclado USB
2. El soporte USB HID debería funcionar automáticamente
3. Investigar problema del teclado interno más tarde

```bash
# Verificar dónde está el problema:
lsusb                           # ¿Se ve el teclado USB?
dmesg | grep -i usb            # ¿Hay errores USB?
```

### Usar BIOS/UEFI como referencia

En BIOS, el teclado funciona porque:
- Manejo nativo del hardware (SMM)
- Drivers completamente diferentes

**Esto confirma que es problema del driver de Linux, no hardware**.

---

## 📊 Tabla de Síntomas → Soluciones

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Congelado total | SMM interfiere | `i8042.direct=1` |
| Lento/intermitente | Polling en lugar de interrupciones | `i8042.dumbkbd=0` |
| Solo en instalador | initramfs sin drivers | Agregar `atkbd` a mkinitcpio |
| Funciona después de login | Driver cargado tarde | `EARLY_PRINTK=y` en kernel |
| USB funciona pero PS/2 no | Controlador i8042 deshabilitado | Recompilar con `I8042=y` |
| Parpadea pero no responde | BIOS SMM + kernel interfieren | Combo: `i8042.direct=1 reset=1` |

---

## 🎯 Plan de Acción Recomendado para Ti

1. **Primero:** Intenta los parámetros de boot:
   ```
   i8042.direct=1 i8042.dumbkbd=0
   ```

2. **Si funciona:** Hazlos permanentes en GRUB
   
3. **Si no funciona:** Recompila el kernel asegurando:
   - `KEYBOARD_ATKBD=y`
   - `SERIO_I8042=y`
   - Agregar `i8042.direct=1` a GRUB

4. **Si aún no funciona:** Agregar `I8042_DEBUG=y` y revisar:
   ```bash
   dmesg | grep -i i8042
   ```

5. **Última opción:** Usar teclado USB externo y reportar issue en kernel.org

---

## 📚 Referencias

- [Kernel.org i8042 Documentation](https://www.kernel.org/doc/html/latest/input/devices/i8042.html)
- [Arch Wiki: Keyboard Configuration](https://wiki.archlinux.org/title/Keyboard_configuration)
- [Linux Input Subsystem](https://www.kernel.org/doc/html/latest/input/)
- [Dell Latitude Quirks](https://wiki.debian.org/Dell) (para problemas específicos Dell)

---

## 💡 Extra: Verificar en BIOS/UEFI

A veces el problema viene de BIOS. Antes de compilar:

```
Boot to BIOS/UEFI Setup (F2 o F10 en Dell)

Buscar opciones como:
- Integrated Peripherals
  - Onboard Devices → [Enabled]
  - PS/2 Controller → [Enabled]
  - PS/2 Keyboard → [Enabled]
- System Management Mode (SMM) → [Enabled] o [Compatible]
- Internal Pointing Device → [Enabled]

Si alguna está deshabilitada, habilitar y guardar.
```

Esto es especialmente importante si vienes de Windows (que tiene drivers proprietary Dell).

---

**Última actualización:** 2026-05-04
**Dell Latitude:** 7490
**Kernel:** linux-hardened 6.8.x

