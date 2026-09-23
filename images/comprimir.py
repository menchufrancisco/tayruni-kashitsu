#!/usr/bin/env python3

from PIL import Image
from pathlib import Path
import os

# Comprimir solamente imágenes mayores a este tamaño
MIN_SIZE_MB = 1.0

# Calidad JPEG
JPEG_QUALITY = 88

# Archivos de imagen
EXTENSIONS = {".jpg", ".jpeg", ".png"}

for path in Path(".").iterdir():

    if path.suffix.lower() not in EXTENSIONS:
        continue

    size_mb = path.stat().st_size / (1024 * 1024)

    if size_mb < MIN_SIZE_MB:
        print(f"SKIP  {path.name:25} {size_mb:.2f} MB")
        continue

    print(f"\nProcesando: {path.name} ({size_mb:.2f} MB)")

    try:
        img = Image.open(path)

        # Convertir a RGB para JPEG
        if img.mode in ("RGBA", "LA", "P"):
            background = Image.new("RGB", img.size, "white")
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.getchannel("A") if img.mode == "RGBA" else None)
            img = background
        else:
            img = img.convert("RGB")

        # Guardar temporalmente
        temp = path.with_name(path.stem + "_compressed.jpg")

        img.save(
            temp,
            "JPEG",
            quality=JPEG_QUALITY,
            optimize=True,
            progressive=True
        )

        new_size = temp.stat().st_size / (1024 * 1024)

        print(f"       Nuevo: {new_size:.2f} MB")
        print(f"       Reducción: {(1 - new_size / size_mb) * 100:.1f}%")

        # Solo reemplazar si realmente quedó más pequeño
        if temp.stat().st_size < path.stat().st_size:
            os.replace(temp, path)
            print("       OK → reemplazado")
        else:
            temp.unlink()
            print("       SKIP → original era más pequeño")

    except Exception as e:
        print(f"       ERROR: {e}")
