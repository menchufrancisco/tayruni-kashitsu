#!/usr/bin/env python3

from PIL import Image, ImageOps
from pathlib import Path
import os

# Comprimir solamente imágenes mayores a este tamaño
MIN_SIZE_MB = 1.0

# Calidad JPEG
JPEG_QUALITY = 88

# Lado más largo permitido, en píxeles. Nada en web necesita más que esto.
MAX_DIMENSION = 1600

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

        # Respeta la rotación real de la foto (EXIF) antes de tocarla
        img = ImageOps.exif_transpose(img)

        # Convertir a RGB para JPEG
        if img.mode in ("RGBA", "LA", "P"):
            background = Image.new("RGB", img.size, "white")
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.getchannel("A") if img.mode == "RGBA" else None)
            img = background
        else:
            img = img.convert("RGB")

        # Reducir dimensiones si la imagen es más grande de lo que la web necesita
        if max(img.size) > MAX_DIMENSION:
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

        # El resultado SIEMPRE es .jpg, sin importar la extensión original.
        # Evita repetir el bug de archivos .png que en realidad son JPEG.
        final_path = path.with_suffix(".jpg")
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
            os.replace(temp, final_path)
            if final_path != path:
                path.unlink()  # borra el .png original si el resultado es .jpg
            print(f"       OK → {final_path.name}")
        else:
            temp.unlink()
            print("       SKIP → original era más pequeño")

    except Exception as e:
        print(f"       ERROR: {e}")