from PIL import Image
import numpy as np

src_path = "/home/pancho/.gemini/antigravity/brain/5a1a26ac-eab9-4e0a-8609-5f3d9f7c9e79/.user_uploaded/media_1791139987481.jpg"

# Open reference image
img = Image.open(src_path).convert('RGB')

# Canvas Dimensions: 15 cm x 8 cm at 300 DPI (1772 x 945)
dpi = 300
canvas_w = int(round(15 / 2.54 * dpi))  # 1772 px
canvas_h = int(round(8 / 2.54 * dpi))   # 945 px

# Crop logo tight to bounds
gray = img.convert('L')
gray_np = np.array(gray)
logo_mask = (gray_np > 35).astype(np.uint8) * 255

coords = np.argwhere(logo_mask > 0)
y_min, x_min = coords.min(axis=0)
y_max, x_max = coords.max(axis=0) + 1

cropped_logo = img.crop((x_min, y_min, x_max, y_max))

# Calculate scale for 86% height
target_h = int(canvas_h * 0.86)
aspect = cropped_logo.width / cropped_logo.height
target_w = int(round(target_h * aspect))

resized_logo = cropped_logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

# COLOR INTERMEDIATE OPTIMIZATION:
# First (too dark): #060F1B -> RGB (6, 15, 27)
# Second (too light): #1A2B4C -> RGB (26, 43, 76)
# Intermediate balanced Navy: RGB (14, 26, 48) / Hex: #0E1A30
intermediate_navy = np.array([14, 26, 48], dtype=float)

gray_resized = np.array(resized_logo.convert('L'), dtype=float)

bg_mask = np.clip((80.0 - gray_resized) / 60.0, 0.0, 1.0)[:, :, np.newaxis]
white_mask = np.clip((gray_resized - 100.0) / 100.0, 0.0, 1.0)[:, :, np.newaxis]

recolored = bg_mask * intermediate_navy + white_mask * np.array([255, 255, 255], dtype=float)

# Create uniform canvas
canvas = Image.new('RGB', (canvas_w, canvas_h), color=(14, 26, 48))

# Center logo
start_x = (canvas_w - target_w) // 2
start_y = (canvas_h - target_h) // 2

canvas.paste(Image.fromarray(recolored.astype(np.uint8)), (start_x, start_y))

out_path = "/home/pancho/tayruni-kashitsu/team_z_logo_navy.png"
canvas.save(out_path, dpi=(300, 300))
print("SUCCESS: Intermediate balanced navy logo generated.")
