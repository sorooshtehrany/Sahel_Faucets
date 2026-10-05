import cv2
import numpy as np
from PIL import Image, ImageDraw


def crop_and_round_image(
    image_path, crop_box, corner_radius=30, output_name="output.png"
):
  # باز کردن تصویر اصلی
  img = Image.open(image_path).convert("RGBA")

  # برش دادن بخش مورد نظر
  cropped = img.crop(crop_box)

  # ساخت ماسک برای گرد کردن گوشه‌ها
  width, height = cropped.size
  mask = Image.new("L", (width, height), 0)
  draw = ImageDraw.Draw(mask)
  draw.rounded_rectangle(
      (0, 0, width, height), radius=corner_radius, fill=255
  )

  # اعمال ماسک گرد روی تصویر برش خورده
  result = Image.new("RGBA", (width, height), (0, 0, 0, 0))
  result.paste(cropped, (0, 0), mask=mask)

  # ذخیره فایل خروجی
  result.save(output_name, "PNG")
  print(f"ذخیره شد: {output_name}")


# مسیر تصویر شما
image_path = "Screenshot from 2026-09-28 11-16-43.png"  # نام فایل عکست رو اینجا بگذار

# باز کردن برای گرفتن ابعاد
with Image.open(image_path) as img:
  w, h = img.size

# مختصات ۴ بخش اصلی (بر اساس تصویر شما)
# Format: (Left, Top, Right, Bottom)
sections = {
    "1_casting": (int(w * 0.50), int(h * 0.02), int(w * 0.98), int(h * 0.48)),
    "2_machining": (
        int(w * 0.02),
        int(h * 0.02),
        int(w * 0.48),
        int(h * 0.48),
    ),
    "3_assembly": (int(w * 0.02), int(h * 0.50), int(w * 0.48), int(h * 0.98)),
    "4_plating": (int(w * 0.50), int(h * 0.50), int(w * 0.98), int(h * 0.98)),
}

# اجرای برش و گرد کردن برای هر ۴ بخش
for name, box in sections.items():
  crop_and_round_image(
      image_path,
      box,
      corner_radius=40,
      output_name=f"section_{name}.png",
  )
