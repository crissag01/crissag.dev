from pathlib import Path
import os 

def list_directory(path: str) -> str:
    """
    Lista archivos y carpetas.
    """

    try:
        p = Path(path)

        if not p.exists():
            return f"Error: la ruta no existe: {path}"

        if not p.is_dir():
            return f"Error: la ruta no es una carpeta: {path}"

        items = []

        for item in sorted(p.iterdir()):
            if item.is_dir():
                items.append(f"[DIR]  {item.name}")
            else:
                size_kb = item.stat().st_size / 1024
                items.append(
                    f"[FILE] {item.name} ({size_kb:.1f} KB)"
                )

        if not items:
            return "La carpeta está vacía."

        return "\n".join(items)

    except Exception as e:
        return f"Error: {e}"

def read_file(filepath: str) -> str:
    """
    Lee archivos de texto.
    """

    try:
        p = Path(filepath)

        if not p.exists():
            return f"Error: no existe: {filepath}"

        if p.is_dir():
            return (
                "Error: es una carpeta. "
                "Usa list_directory primero."
            )

        # limitar tamaño
        max_size = 1024 * 1024  # 1 MB

        if p.stat().st_size > max_size:
            return (
                f"Error: archivo demasiado grande "
                f"({p.stat().st_size} bytes)"
            )

        try:
            content = p.read_text(
                encoding="utf-8",
                errors="ignore"
            )
        except Exception:
            content = p.read_text(
                encoding="latin-1",
                errors="ignore"
            )

        return content[:10000]

    except Exception as e:
        return f"Error: {e}"