#!/bin/bash
#
# Script de compilación optimizado para WSL2
# Compilar kernel-hardened en Windows via WSL2
# Luego instalar en Dell Latitude 7490
#
# Usage: ./build-kernel-wsl2.sh [action]
#

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
KERNEL_VERSION="linux-hardened"
BUILD_DIR="$HOME/kernel-build"
JOBS=$(nproc)
EXPORT_DIR="/mnt/c/Users/criss/Desktop/kernel-compiled"
WINDOWS_USER="criss"

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

log_section() {
    echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

check_wsl2() {
    log_info "Verificando WSL2..."

    if ! grep -qi microsoft /proc/version; then
        log_error "No estás en WSL2. Este script debe ejecutarse en WSL2."
    fi

    if [ ! -d "/mnt/c" ]; then
        log_error "No se encuentra /mnt/c (Windows). Verificar instalación WSL2."
    fi

    log_info "✓ WSL2 detectado correctamente"
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
    log_section "INSTALANDO HERRAMIENTAS DE COMPILACIÓN"

    log_warn "Esto requiere permisos de sudo"
    sudo pacman -S --needed base-devel git asp grub

    log_info "✓ Instalación completa"
}

fetch() {
    log_section "DESCARGANDO CÓDIGO FUENTE"

    mkdir -p "$BUILD_DIR"
    cd "$BUILD_DIR"

    if [ -d "linux-hardened" ]; then
        log_warn "Directorio linux-hardened ya existe"
        read -p "¿Actualizar a versión más reciente? (s/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            cd linux-hardened
            git pull
        else
            log_info "Usando directorio existente"
        fi
    else
        log_info "Descargando PKGBUILD de linux-hardened (puede tardar unos minutos)..."
        asp export linux-hardened
    fi

    cd "$BUILD_DIR/linux-hardened"
    log_info "✓ Fuentes listas en: $BUILD_DIR/linux-hardened"
}

config() {
    log_section "CONFIGURACIÓN DEL KERNEL"

    cd "$BUILD_DIR/linux-hardened"

    log_info "Preparando archivos de compilación (5-10 minutos)..."
    makepkg -o

    cd src/linux

    log_warn "────────────────────────────────────────"
    log_warn "ABRIENDO MENUCONFIG"
    log_warn "────────────────────────────────────────"
    log_warn ""
    log_warn "RECORDAR: Configurar para Dell Latitude 7490"
    log_warn ""
    log_warn "CRÍTICOS (deben estar [*] habilitados):"
    log_warn "  ✓ CPU: Intel P-State driver"
    log_warn "  ✓ GPU: DRM + Intel i915"
    log_warn "  ✓ Input: Keyboard ATKBD + PS/2 i8042"
    log_warn "  ✓ Containers: Namespaces + Cgroups + OverlayFS"
    log_warn "  ✓ Network: Netfilter + raw sockets"
    log_warn ""
    log_warn "Ver: CONFIG_CRITICAL_OPTIONS.md para lista completa"
    log_warn "────────────────────────────────────────"
    log_warn ""
    log_warn "Presiona ENTER para continuar..."
    read

    make menuconfig

    log_info "✓ Configuración completada"
}

build() {
    log_section "COMPILANDO KERNEL (esto puede tardar 1-3 horas)"

    cd "$BUILD_DIR/linux-hardened"

    if [ ! -d "src/linux" ]; then
        log_error "Primero ejecuta: ./build-kernel-wsl2.sh config"
    fi

    log_info "Usando $JOBS jobs paralelos..."

    # Verificar si ccache está disponible
    if command -v ccache &> /dev/null; then
        export CC="ccache gcc"
        export CXX="ccache g++"
        log_info "✓ ccache habilitado (acelera recompilaciones)"
    fi

    # Mostrar timestamp
    log_info "Inicio: $(date '+%Y-%m-%d %H:%M:%S')"

    # Compilar
    makepkg -e -f --skipinteg

    log_info "Fin: $(date '+%Y-%m-%d %H:%M:%S')"
    log_info "✓ Compilación completada exitosamente"
    log_info ""
    log_info "Paquetes generados:"
    ls -lh "$BUILD_DIR/linux-hardened"/*.pkg.tar.zst | awk '{print "  " $9 " (" $5 ")"}'
}

export_to_windows() {
    log_section "EXPORTANDO A WINDOWS"

    mkdir -p "$EXPORT_DIR"

    log_info "Copiando paquetes compilados..."
    cp "$BUILD_DIR/linux-hardened"/*.pkg.tar.zst "$EXPORT_DIR/"

    log_info "✓ Archivos exportados a: $EXPORT_DIR"
    log_info ""
    log_info "Archivos disponibles:"
    ls -lh "$EXPORT_DIR"/*.pkg.tar.zst | awk '{print "  " $9 " (" $5 ")"}'
    log_info ""
    log_warn "PRÓXIMO PASO: Copiar estos archivos a USB Arch"
}

verify() {
    log_section "VERIFICACIÓN"

    cd "$BUILD_DIR/linux-hardened"

    log_info "Kernel compilado:"
    ls -lh *.pkg.tar.zst | head -1

    log_info ""
    log_info "Archivos disponibles para Dell Latitude 7490:"
    ls -lh *.pkg.tar.zst | awk '{print "  ✓ " $9}'

    log_info ""
    log_warn "Para instalar en Dell:"
    log_warn "1. Crear USB booteable con Arch ISO"
    log_warn "2. Copiar archivos de $EXPORT_DIR a USB"
    log_warn "3. Boot desde USB en Dell"
    log_warn "4. Instalar Arch base y luego estos paquetes"
}

cleanup() {
    log_section "LIMPIEZA"

    cd "$BUILD_DIR/linux-hardened"

    log_warn "Esto eliminará archivos de compilación (~5-10GB)"
    read -p "¿Continuar? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        makepkg --clean
        log_info "✓ Limpieza completada"
    else
        log_info "Limpieza cancelada"
    fi
}

usage() {
    cat << EOF
${BLUE}Script de Compilación - Kernel Hardened en WSL2${NC}

${GREEN}USAGE:${NC}
  ./build-kernel-wsl2.sh [action]

${GREEN}ACCIONES:${NC}
  prep       - Instalar dependencias de compilación
  fetch      - Descargar PKGBUILD de linux-hardened
  config     - Abrir menuconfig para personalización
  build      - Compilar kernel (1-3 horas)
  export     - Exportar paquetes a Windows
  verify     - Verificar compilación
  cleanup    - Limpiar archivos de compilación
  all        - Ejecutar: fetch → config → build → export → verify
  quick      - Ejecutar: fetch → config → build (sin export)

${GREEN}EJEMPLOS:${NC}
  ./build-kernel-wsl2.sh all      # Compilación completa
  ./build-kernel-wsl2.sh quick    # Compilación rápida
  ./build-kernel-wsl2.sh build    # Solo compilar (si ya configuraste)

${GREEN}NOTAS:${NC}
  • Este script debe ejecutarse EN WSL2 (no en PowerShell)
  • Requiere 40GB libres en tu disco
  • La compilación tarda 1-3 horas según CPU
  • El kernel compilado se exporta a Windows automáticamente

${BLUE}Documentación:${NC}
  • GUIA_WSL2_COMPILACION.md - Guía detallada
  • CONFIG_CRITICAL_OPTIONS.md - Opciones de configuración
  • SOLUCION_TECLADO_NO_RESPONDE.md - Soluciones de teclado

EOF
}

# Main
if [ $# -eq 0 ]; then
    usage
    exit 0
fi

action="$1"

case "$action" in
    prep)
        check_wsl2
        check_dependencies
        prep
        ;;
    fetch)
        check_wsl2
        fetch
        ;;
    config)
        check_wsl2
        fetch
        config
        ;;
    build)
        check_wsl2
        build
        ;;
    export)
        check_wsl2
        export_to_windows
        ;;
    verify)
        check_wsl2
        verify
        ;;
    cleanup)
        check_wsl2
        cleanup
        ;;
    all)
        log_section "COMPILACIÓN COMPLETA WSL2"
        check_wsl2
        check_dependencies
        fetch
        config
        build
        export_to_windows
        verify
        log_section "✓ ¡COMPILACIÓN COMPLETADA EXITOSAMENTE!"
        log_info ""
        log_info "Próximos pasos:"
        log_info "1. Los paquetes compilados están en: $EXPORT_DIR"
        log_info "2. Crear USB booteable con Arch ISO"
        log_info "3. Copiar archivos .pkg.tar.zst a la USB"
        log_info "4. Boot desde USB en Dell Latitude 7490"
        log_info "5. Seguir: GUIA_WSL2_COMPILACION.md sección 5"
        log_info ""
        ;;
    quick)
        log_section "COMPILACIÓN RÁPIDA (sin export a Windows)"
        check_wsl2
        check_dependencies
        fetch
        config
        build
        verify
        log_info ""
        log_warn "Para exportar a Windows después, ejecuta:"
        log_warn "  ./build-kernel-wsl2.sh export"
        ;;
    *)
        log_error "Acción desconocida: $action"
        usage
        ;;
esac
