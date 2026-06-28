# ⚙️ Opciones de Configuración Críticas para Dell Latitude 7490

**Hardware:**
- CPU: Intel Core i5-8350U (Kaby Lake)
- GPU: Intel UHD Graphics 620 (i915)
- RAM: 8 GB DDR4
- SSD: 239 GB

**Casos de Uso:**
- Docker + contenedores
- Ollama (IA local)
- Niri/Qtile + Wayland
- Network scanning (pen testing)
- Desarrollo general

---

## 📋 Búsqueda Rápida en menuconfig

**En menuconfig, presiona "/" para buscar. Estos son los valores críticos:**

### CPU & Frecuencia (IMPRESCINDIBLE)

```
CONFIG_M=y                              # Build kernel
CONFIG_X86_INTEL_LPAE=y                 # Intel LPAE (si aplica)
CONFIG_INTEL_SPEEDSTEP=y                # Intel SpeedStep
CONFIG_INTEL_PSTATE=y                   # Intel P-State driver (recomendado sobre acpi-cpufreq)
CONFIG_CPUFREQ=y
CONFIG_CPU_FREQ_DEFAULT_GOV_ONDEMAND=y  # O: POWERSAVE para batería
CONFIG_INTEL_IDLE=y                     # Idle power management
CONFIG_IDLE_INTEL=y
```

### GPU - Intel i915 (CRÍTICO para Wayland)

```
CONFIG_DRM=y                            # Direct Rendering Manager
CONFIG_DRM_I915=y                       # Intel GPU driver
CONFIG_DRM_LOAD_I915_MODULE=y           # Cargar como módulo
CONFIG_DRM_I915_GVT=n                   # No necesario (para VMs)
CONFIG_DRM_I915_ENABLE_HANGCHECK=y      # Detect GPU hangs
CONFIG_DRM_I915_PRELIMINARY_HW_SUPPORT=y # Support para GPUs futuras
CONFIG_DRM_I915_FORCE_PROBE=""          # Dejar en blanco
CONFIG_DRM_KMS_HELPER=y                 # Kernel Mode Setting
```

### Entrada - Teclado/Mouse (CRÍTICO)

```
CONFIG_INPUT=y
CONFIG_INPUT_KEYBOARD=y
CONFIG_KEYBOARD_ATKBD=y                 # AT keyboard support
CONFIG_HID=y
CONFIG_HID_GENERIC=y
CONFIG_USB_HID=y
CONFIG_HID_SUPPORT=y
CONFIG_I8042_NOMUX=n                    # Permite múltiples dispositivos PS/2
CONFIG_SERIO=y
CONFIG_SERIO_I8042=y                    # 8042 PS/2 controller
CONFIG_SERIO_LIBPS2=y
```

**Parámetros de Boot (si el teclado no responde):**
```
# En GRUB: i8042.direct=1 i8042.dumbkbd=0
```

### Red (Docker networking, network scanning)

```
CONFIG_NET=y
CONFIG_PACKET=y                         # AF_PACKET (tcpdump, Wireshark)
CONFIG_NETFILTER=y
CONFIG_NETFILTER_XTABLES=y
CONFIG_NETFILTER_XT_MATCH_CGROUP=y      # Necesario para Docker
CONFIG_NETFILTER_XT_TARGET_LOG=y        # iptables logging
CONFIG_BRIDGE=y                         # Para docker0 bridge
CONFIG_VLAN_8021Q=y                     # VLAN support
CONFIG_BRIDGE_NETFILTER=y
```

### Contenedores - Docker (CRÍTICO)

```
CONFIG_NAMESPACES=y
CONFIG_UTS_NS=y                         # Hostname namespaces
CONFIG_IPC_NS=y                         # IPC namespaces
CONFIG_PID_NS=y                         # PID namespaces
CONFIG_NET_NS=y                         # Network namespaces
CONFIG_USER_NS=y                        # User namespaces (para rootless Docker)
CONFIG_CGROUPS=y
CONFIG_CGROUP_CPUACCT=y
CONFIG_CGROUP_DEVICE=y
CONFIG_CGROUP_FREEZER=y
CONFIG_CGROUP_MEMORY=y
CONFIG_CGROUP_MEMCG=y                   # Memory cgroup v2
CONFIG_CGROUP_PIDS=y
CONFIG_CPUSETS=y
CONFIG_MEMCG=y
CONFIG_MEMCG_SWAP=y
CONFIG_OVERLAY_FS=y                     # OverlayFS (Docker storage driver)
CONFIG_VFIO=m                           # Para GPU passthrough (si necesitas VMs)
```

### Wayland & Compositor

```
CONFIG_DRM_FBDEV_EMULATION=y            # Framebuffer emulation
CONFIG_FRAMEBUFFER_CONSOLE=y
CONFIG_FRAMEBUFFER_CONSOLE_DETECT_PRIMARY=y
CONFIG_HIDRAW=y                         # HID raw API (para libinput)
CONFIG_INOTIFY_USER=y                   # File monitoring (para compositors)
CONFIG_EPOLL=y                          # Efficient polling
```

### Almacenamiento SSD

```
CONFIG_SATA_AHCI=y                      # AHCI driver (modernos SSDs)
CONFIG_SATA_INTEL_CHATCHROOM=y          # Si necesitas
CONFIG_BLK_DEV_SD=y                     # SCSI disk support
CONFIG_EXT4_FS=y                        # Ext4 filesystem (o tu FS elegido)
CONFIG_EXT4_FS_POSIX_ACL=y              # ACLs
CONFIG_EXT4_FS_SECURITY=y
CONFIG_NVMe=y                           # Si es NVMe (generalmente sí en laptops modernas)
CONFIG_NVM_ADMIN_MICRO=20               # Microcode updates para NVMe
```

### Seguridad & Hardening (POR DEFECTO en linux-hardened)

```
CONFIG_SECURITY=y
CONFIG_SECURITY_APPARMOR=y              # AppArmor (o SELinux)
CONFIG_SECURITY_SELINUX=n               # Deshabilitar si usas AppArmor
CONFIG_FORTIFY_SOURCE=y
CONFIG_STACK_PROTECTOR=y
CONFIG_STACK_PROTECTOR_STRONG=y
CONFIG_CFI_CLANG=y                      # Control Flow Integrity
CONFIG_SHADOW_CALL_STACK=y              # Shadow call stack (ARM, pero verificar)
CONFIG_KASAN=n                          # Kernel Address Sanitizer (overhead)
CONFIG_UBSAN=n                          # Undefined Behavior Sanitizer (overhead)
CONFIG_HARDENED_USERCOPY=y
CONFIG_DEBUG_LIST=y
CONFIG_DEBUG_CREDENTIALS=y
CONFIG_INIT_STACK_ALL=y
CONFIG_GCC_PLUGIN_LATENT_ENTROPY=y
CONFIG_GCC_PLUGIN_STRUCTLEAK=y
```

### Depuración & Kernel Logging

```
CONFIG_EARLY_PRINTK=y                   # Diagnóstico de boot temprano
CONFIG_MAGIC_SYSRQ=y                    # Para emergencias (Alt+SysRq)
CONFIG_DEBUG_INFO=y                     # Debug symbols
CONFIG_DEBUG_KERNEL=y
CONFIG_PRINTK=y
CONFIG_PRINTK_TIME=y                    # Timestamps en logs
```

### Audio (si lo necesitas)

```
CONFIG_SOUND=y
CONFIG_SND=y
CONFIG_SND_HDA=y                        # Intel HD Audio
CONFIG_SND_HDA_INTEL=y
CONFIG_SND_HDA_REALTEK=y                # Si tienes Realtek codec
CONFIG_SND_HDA_CODEC_HDMI=y
CONFIG_SND_HDA_POWER_SAVE=y
```

### USB (Teclado/Mouse/Periféricos)

```
CONFIG_USB=y
CONFIG_USB_XHCI_HCD=y                   # USB 3.0 host controller
CONFIG_USB_EHCI_HCD=y                   # USB 2.0 EHCI
CONFIG_USB_UHCI_HCD=y                   # USB 2.0 UHCI
CONFIG_USB_STORAGE=y                    # USB storage
CONFIG_USB_HID=y                        # USB HID (teclado/mouse)
CONFIG_USB_ACM=y
```

### Batería & Energía (Laptop)

```
CONFIG_BATTERY=y
CONFIG_ACPI=y
CONFIG_ACPI_AC=y                        # AC adapter
CONFIG_ACPI_BATTERY=y                   # Battery support
CONFIG_ACPI_BUTTON=y                    # Power button
CONFIG_ACPI_THERMAL=y                   # Thermal management
CONFIG_ACPI_FAN=y
CONFIG_ACPI_PROCESSOR=y
CONFIG_PROCESSOR_THERMAL=y
CONFIG_THINKPAD_ACPI=n                  # No es ThinkPad
CONFIG_DELL_SMBIOS=y                    # Dell SMBIOS (para tu laptop!)
CONFIG_DELL_RBTN=y                      # Dell radio button
```

### WiFi (Si tiene WiFi integrado)

```
CONFIG_WLAN=y
CONFIG_CFG80211=y
CONFIG_NL80211=y
CONFIG_MAC80211=y
# Y según tu modelo:
# CONFIG_INTEL_WIFI=y                   # Intel WiFi 
# CONFIG_BROADCOM_WIFI=y                # Broadcom
# O lo que tengas...
```

---

## ✅ Verificación Post-Compilación

Después de compilar, verifica que las opciones críticas estén presentes:

```bash
# En /boot/config-[tu-kernel]:
grep "^CONFIG_OVERLAY_FS" /boot/config-*
grep "^CONFIG_NAMESPACES" /boot/config-*
grep "^CONFIG_DRM_I915" /boot/config-*
grep "^CONFIG_KEYBOARD_ATKBD" /boot/config-*
grep "^CONFIG_NETFILTER_XT_MATCH_CGROUP" /boot/config-*
```

Todos deberían mostrar `=y` (módulo compilado) o `=m` (módulo).

---

## 🎯 Recomendaciones por Caso de Uso

### Solo Docker
✓ Obligatorio: namespaces, cgroups, overlay_fs, netfilter
✓ Opcional: user_ns (para rootless)

### Ollama + IA Local
✓ Obligatorio: GPU i915, tensores CPU optimizados
✓ Opcional: AVX2, SSE4.2 (verificar tu CPU soporta)

### Network Scanning (Nmap, Wireshark)
✓ Obligatorio: packet AF, netfilter, raw sockets
✓ Verificar: CONFIG_PACKET=y, CONFIG_INET_RAW_DIAG=y

### Niri/Qtile + Wayland
✓ Obligatorio: i915 DRM, framebuffer, libinput support
✓ Verificar: CONFIG_DRM_I915=y, CONFIG_HID=y, CONFIG_INOTIFY_USER=y

---

## 🔧 Automatización en Arch

Si no quieres hacer menuconfig manualmente, Arch almacena configuraciones conocidas:

```bash
# Ver opciones recomendadas por defecto
grep CONFIG_OVERLAY_FS /proc/config.gz | gunzip

# Comparar con kernel actual
diff <(zcat /proc/config.gz) <(cat /boot/config-linux-hardened)
```

---

## 📚 Referencias de Documentación del Kernel

- [Kconfig en linux-hardened](https://github.com/torvalds/linux/tree/master/Documentation/kbuild)
- [i915 DRM Configuration](https://www.kernel.org/doc/html/latest/gpu/i915.html)
- [Namespaces & Cgroups](https://www.kernel.org/doc/html/latest/userspace-api/landlock.html)
- [Docker Kernel Requerimientos](https://docs.docker.com/engine/install/binaries/#prerequisites)

---

**Generado:** 2026-05-04
**Kernel:** linux-hardened 6.8.x
**Target:** Dell Latitude 7490

