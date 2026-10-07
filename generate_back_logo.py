from PIL import Image
import numpy as np

src_path = "/home/pancho/Descargas/Blue-Lock-Anime-Logo-Soccer-Series-jpg-removebg-preview.png"

# Load transparent PNG
img = Image.open(src_path).convert('RGBA')

# Canvas Dimensions: 9 cm x 9 cm at 300 DPI (1063 x 1063 px)
dpi = 300
canvas_w = int(round(9 / 2.54 * dpi))  # 1063 px
canvas_h = int(round(9 / 2.54 * dpi))  # 1063 px

# Balanced intermediate navy background: #0E1A30 (RGB: 14, 26, 48)
navy_color = (14, 26, 48)

# Get bounding box of non-transparent pixels
alpha_channel = np.array(img.getchannel('A'))
non_zero = np.argwhere(alpha_channel > 10)

y_min, x_min = non_zero.min(axis=0)
y_max, x_max = non_zero.max(axis=0) + 1

cropped_logo = img.crop((x_min, y_min, x_max, y_max))

# Scale logo to fit 88% of square canvas height/width
target_h = int(canvas_h * 0.88)
aspect = cropped_logo.width / cropped_logo.height
target_w = int(round(target_h * aspect))

if target_w > int(canvas_w * 0.88):
    target_w = int(canvas_w * 0.88)
    target_h = int(round(target_w / aspect))

resized_logo = cropped_logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Create 9cm x 9cm Navy Canvas
canvas = Image.new('RGB', (canvas_w, canvas_h), color=navy_color)

# Center positions
start_x = (canvas_w - target_w) // 2
start_y = (canvas_h - target_h) // 2

# Paste transparent PNG logo directly onto navy canvas
canvas.paste(resized_logo, (start_x, start_y), resized_logo)

out_path = "/home/pancho/tayruni-kashitsu/bluelock_back_logo_navy.png"
canvas.save(out_path, dpi=(300, 300))
print("SUCCESS: Generated 9cm x 9cm Blue Lock logo image.")
