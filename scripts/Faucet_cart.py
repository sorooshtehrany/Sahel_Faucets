#!/usr/bin/env python3
"""
faucet_card.py
حذف پس‌زمینه‌ی عکس شیرآلات و قرار دادن آن روی کارت آبی با گوشه‌های گرد و سایه.

نصب:
    pip install rembg onnxruntime pillow

نمونه استفاده:
    python faucet_card.py image1.png image2.png
    python faucet_card.py ./photos -o ./out
    python faucet_card.py ./photos --top "#7CC4F5" --bottom "#3E8EDE" --size 1400
"""
import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter
from rembg import new_session, remove

EXTS = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}
SS = 4  # supersampling for smooth rounded corners


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rounded_mask(size, radius):
    w, h = size
    big = Image.new("L", (w * SS, h * SS), 0)
    ImageDraw.Draw(big).rounded_rectangle(
        (0, 0, w * SS - 1, h * SS - 1), radius * SS, fill=255
    )
    return big.resize((w, h), Image.LANCZOS)


def gradient(size, top, bottom):
    w, h = size
    col = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        col.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return col.resize((w, h))


def make_card(size, radius, top, bottom):
    card = gradient(size, top, bottom).convert("RGBA")
    card.putalpha(rounded_mask(size, radius))
    return card


def cut_out(img, session, matting):
    cut = remove(
        img,
        session=session,
        alpha_matting=matting,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
    ).convert("RGBA")
    bbox = cut.getchannel("A").point(lambda a: 255 if a > 10 else 0).getbbox()
    return cut.crop(bbox) if bbox else cut


def process(path, out_dir, session, a):
    img = Image.open(path).convert("RGBA")
    product = cut_out(img, session, a.matting)

    W = H = a.size
    margin = int(W * 0.09)
    card_w, card_h = W - 2 * margin, H - 2 * margin
    radius = int(min(card_w, card_h) * a.radius)

    bg = (0, 0, 0, 0) if a.transparent else (255, 255, 255, 255)
    canvas = Image.new("RGBA", (W, H), bg)

    # --- card shadow ---
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh_mask = Image.new("L", (W, H), 0)
    sh_mask.paste(rounded_mask((card_w, card_h), radius), (margin, margin + int(W * 0.025)))
    shadow.putalpha(sh_mask.point(lambda v: int(v * 0.40)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(W * 0.025))
    canvas = Image.alpha_composite(canvas, shadow)

    # --- card ---
    card = make_card((card_w, card_h), radius, hex2rgb(a.top), hex2rgb(a.bottom))
    canvas.alpha_composite(card, (margin, margin))

    # --- product (fit inside card) ---
    scale = min(card_w * a.fill / product.width, card_h * a.fill / product.height)
    new_size = (max(1, int(product.width * scale)), max(1, int(product.height * scale)))
    product = product.resize(new_size, Image.LANCZOS)
    px = (W - product.width) // 2
    py = (H - product.height) // 2

    # soft shadow under the product
    p_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    p_alpha = Image.new("L", (W, H), 0)
    p_alpha.paste(product.getchannel("A").point(lambda v: int(v * 0.35)), (px, py + int(W * 0.012)))
    p_shadow.putalpha(p_alpha)
    p_shadow = p_shadow.filter(ImageFilter.GaussianBlur(W * 0.012))
    canvas = Image.alpha_composite(canvas, p_shadow)

    canvas.alpha_composite(product, (px, py))

    out = out_dir / f"{Path(path).stem}_card.png"
    canvas.save(out)
    print("saved:", out)


def collect(inputs):
    files = []
    for p in map(Path, inputs):
        if p.is_dir():
            files += sorted(f for f in p.iterdir() if f.suffix.lower() in EXTS)
        elif p.is_file():
            files.append(p)
        else:
            print("not found:", p, file=sys.stderr)
    return files


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("inputs", nargs="+", help="image files or folders")
    ap.add_argument("-o", "--out", default="output", help="output folder")
    ap.add_argument("--size", type=int, default=1200, help="square output size in px")
    ap.add_argument("--top", default="#8FD0F7", help="card top color")
    ap.add_argument("--bottom", default="#4A9BE0", help="card bottom color")
    ap.add_argument("--radius", type=float, default=0.10, help="corner radius as fraction of card size")
    ap.add_argument("--fill", type=float, default=0.72, help="how much of the card the product fills")
    ap.add_argument("--transparent", action="store_true", help="transparent outside the card (instead of white)")
    ap.add_argument("--matting", action="store_true", help="smoother edges (slower)")
    ap.add_argument("--model", default="isnet-general-use", help="rembg model (u2net, isnet-general-use, ...)")
    a = ap.parse_args()

    out_dir = Path(a.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    files = collect(a.inputs)
    if not files:
        sys.exit("no images found")

    session = new_session(a.model)
    for f in files:
        process(f, out_dir, session, a)


if __name__ == "__main__":
    main()
