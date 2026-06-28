#!/bin/bash
#
# Script de compilación automatizado para kernel-hardened
# Target: Dell Latitude 7490
# Usage: ./build-kernel.sh [action]
#
# Actions:
#   prep         - Preparar entorno (instalar dependencias)
#   fetch        - Obtener PKGBUILD de linux-hardened
#   config       - Abrir menuconfig
#   build        - Compilar el kernel
#   install      - Instalar paquetes compilados
#   grub         - Actualizar configuración GRUB
#   all          - Ejecutar todo (fetch → build → install → grub)
#   clean        - Limpiar archivos de compilación
#

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
KERNEL_VERSION="linux-hardened"
BUILD_DIR="$HOME/kernel-build"
JOBS=$(nproc)
MAKE_FLAGS="-j$JOBS"

# Funciones
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

check_dependencies() {
    log_info "Verificando dependencias..."

    local deps=("git" "asp" "base-devel" "grub")

    for cmd in "${deps[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "Falta instalar: $cmd"
        fi
    done

    log_info "✓ Todas las dependencias están instaladas"
}

prep() {
    log_info "Instalando herramientas de compilación..."

    sudo pacman -S --needed base-devel git asp grub efibootmgr ccache

    log_info "✓ Instalación completa"
}

fetch() {
    log_info "Creando directorio de trabajo: $BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    cd "$BUILD_DIR"

    if [ -d "linux-hardened" ]; then
        log_warn "Directorio linux-hardened ya existe. Actualizando..."
        cd linux-hardened
        git pull
    else
        log_info "Descargando PKGBUILD de linux-hardened..."
        asp export linux-hardened
    fi

    log_info "✓ Fuentes obtenidas"
}

config() {
    cd "$BUILD_DIR/linux-hardened"

    log_info "Preparando archivos de compilación (puede tomar unos minutos)..."
    makepkg -o

    cd src/linux

    log_info "Abriendo menuconfig..."
    log_warn "REMEMBER: Configurar para Dell Latitude 7490"
    log_warn "  - CPU: Intel i5-8350U"
    log_warn "  - GPU: Intel UHD 620 (i915)"
    log_warn "  - Soporte: Docker, Ollama, Niri/Wayland, teclado responsivo"

    make menuconfig

    log_info "✓ Configuración completada"
    log_warn "La .config modificada está en src/linux/.config"
}

build() {
    cd "$BUILD_DIR/linux-hardened"

    if [ ! -d "src/linux" ]; then
        log_error "Primero ejecuta: ./build-kernel.sh fetch"
    fi

    log_info "Compilando kernel con $JOBS jobs..."
    log_warn "Esto puede tomar 1-3 horas..."

    # Usar ccache si está disponible
    if command -v ccache &> /dev/null; then
        export CC="ccache gcc"
        export CXX="ccache g++"
        log_info "✓ Usando ccache para acelerar compilación"
    fi

    makepkg -e -f --skipinteg

    log_info "✓ Compilación completada"
    log_info "Paquetes generados:"
    ls -lh "$BUILD_DIR/linux-hardened"/*.pkg.tar.zst
}

install() {
    cd "$BUILD_DIR/linux-hardened"

    log_info "Instalando paquetes del kernel..."

    # Encontrar e instalar todos los .pkg.tar.zst
    local packages=$(ls *.pkg.tar.zst 2>/dev/null)

    if [ -z "$packages" ]; then
        log_error "No se encontraron paquetes. Ejecuta: ./build-kernel.sh build"
    fi

    for pkg in $packages; do
        log_info "Instalando $pkg..."
        sudo pacman -U "$pkg"
    done

    log_info "✓ Kernel instalado"
}

update_grub() {
    log_info "Actualizando configuración GRUB..."

    sudo grub-mkconfig -o /boot/grub/grub.cfg

    log_info "✓ GRUB actualizado"
    log_warn "El nuevo kernel aparecerá en el menú GRUB en el próximo reinicio"
}

verify() {
    log_info "Verificando instalación..."

    local kernel=$(uname -r)
    log_info "Kernel actual: $kernel"

    if [ -f /boot/vmlinuz-linux-hardened ]; then
        log_info "✓ vmlinuz-linux-hardened encontrado en /boot"
    else
        log_warn "No se encontró vmlinuz en /boot (verificar después de reiniciar)"
    fi

    log_info "✓ Verificación completada"
}

clean() {
    log_warn "Limpiando archivos de compilación..."

    cd "$BUILD_DIR/linux-hardened"
    makepkg --clean

    log_info "✓ Limpieza completada"
}

# Main
if [ $# -eq 0 ]; then
    action="all"
else
    action="$1"
fi

case "$action" in
    prep)
        check_dependencies
        prep
        ;;
    fetch)
        fetch
        ;;
    config)
        fetch
        config
        ;;
    build)
        build
        ;;
    install)
        install
        update_grub
        verify
        ;;
    grub)
        update_grub
        ;;
    all)
        check_dependencies
        fetch
        log_warn "=== Abriendo menuconfig para personalización ==="
        config
        log_warn "=== Iniciando compilación (1-3 horas) ==="
        build
        log_warn "=== Instalando kernel ==="
        install
        log_warn "=== Actualizando GRUB ==="
        update_grub
        log_info "========================================="
        log_info "✓ ¡Compilación completada exitosamente!"
        log_info "========================================="
        log_warn "Próximos pasos:"
        log_warn "1. Reinicia: sudo reboot"
        log_warn "2. Selecciona el nuevo kernel en GRUB"
        log_warn "3. Verifica: uname -r"
        log_warn "4. Si el teclado no responde, prueba:"
        log_warn "   sudo nano /etc/default/grub"
        log_warn "   (Agregar: i8042.direct=1 a GRUB_CMDLINE_LINUX_DEFAULT)"
        ;;
    clean)
        clean
        ;;
    verify)
        verify
        ;;
    *)
        log_error "Acción desconocida: $action"
        echo "Acciones disponibles:"
        echo "  prep    - Instalar dependencias"
        echo "  fetch   - Descargar PKGBUILD"
        echo "  config  - Abrir menuconfig"
        echo "  build   - Compilar kernel"
        echo "  install - Instalar paquetes"
        echo "  grub    - Actualizar GRUB"
        echo "  all     - Todo (por defecto)"
        echo "  clean   - Limpiar archivos"
        echo "  verify  - Verificar instalación"
        ;;
esac
