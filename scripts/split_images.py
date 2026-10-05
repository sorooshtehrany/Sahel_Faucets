from PIL import Image, ImageDraw
import numpy as np
import os
import sys


# =========================================================
# SETTINGS
# =========================================================

WHITE_THRESHOLD = 235

# چند پیکسل از لبه‌ی کارت حذف شود
BORDER_CROP = 8

# شعاع گوشه‌های گرد
CORNER_RADIUS = 28

# کمی بیشتر از لبه داخل شویم
ALPHA_SHRINK = 2


# =========================================================
# Find cards
# =========================================================

def find_cards(image):

    img = np.array(image.convert("RGB"))

    # Detect white areas
    white = np.all(img >= 245, axis=2)

    non_white = ~white

    height, width = non_white.shape

    # Column detection
    column_score = np.sum(non_white, axis=0)

    threshold = height * 0.15

    inside = column_score > threshold

    ranges = []

    start = None

    for x, value in enumerate(inside):

        if value and start is None:
            start = x

        elif not value and start is not None:

            ranges.append((start, x - 1))
            start = None

    if start is not None:
        ranges.append((start, width - 1))

    # Remove small areas
    ranges = [
        (x1, x2)
        for x1, x2 in ranges
        if x2 - x1 > 50
    ]

    cards = []

    # Find Y range for every card
    for x1, x2 in ranges:

        area = non_white[:, x1:x2 + 1]

        row_score = np.sum(area, axis=1)

        y_threshold = (x2 - x1 + 1) * 0.15

        rows = row_score > y_threshold

        y_start = None
        y_ranges = []

        for y, value in enumerate(rows):

            if value and y_start is None:
                y_start = y

            elif not value and y_start is not None:

                y_ranges.append((y_start, y - 1))
                y_start = None

        if y_start is not None:
            y_ranges.append((y_start, height - 1))

        y_ranges = [
            (y1, y2)
            for y1, y2 in y_ranges
            if y2 - y1 > 50
        ]

        if y_ranges:

            y1, y2 = max(
                y_ranges,
                key=lambda r: r[1] - r[0]
            )

            cards.append((x1, y1, x2, y2))

    return cards


# =========================================================
# Remove white pixels
# =========================================================

def remove_white_pixels(image):

    img = np.array(image.convert("RGBA"))

    r = img[:, :, 0].astype(int)
    g = img[:, :, 1].astype(int)
    b = img[:, :, 2].astype(int)

    # Brightness
    brightness = (r + g + b) / 3

    # How neutral the color is
    color_difference = (
        np.maximum.reduce([r, g, b])
        - np.minimum.reduce([r, g, b])
    )

    # Almost white + almost gray
    white_mask = (
        (brightness > WHITE_THRESHOLD)
        &
        (color_difference < 25)
    )

    # Make white pixels transparent
    img[white_mask, 3] = 0

    return Image.fromarray(img)


# =========================================================
# Rounded transparent corners
# =========================================================

def rounded_corners(image, radius):

    image = image.convert("RGBA")

    width, height = image.size

    alpha = Image.new(
        "L",
        (width, height),
        0
    )

    draw = ImageDraw.Draw(alpha)

    draw.rounded_rectangle(
        (
            ALPHA_SHRINK,
            ALPHA_SHRINK,
            width - 1 - ALPHA_SHRINK,
            height - 1 - ALPHA_SHRINK
        ),
        radius=radius,
        fill=255
    )

    image.putalpha(alpha)

    return image


# =========================================================
# Main
# =========================================================

def main():

    if len(sys.argv) < 2:

        print(
            "Usage:\n"
            "python3 split_images.py input.jpg"
        )

        return

    input_file = sys.argv[1]

    if not os.path.exists(input_file):

        print("File not found:", input_file)

        return

    image = Image.open(input_file)

    print("Original image:", image.size)

    cards = find_cards(image)

    print("Detected cards:", len(cards))

    if len(cards) == 0:

        print("No cards detected.")

        return

    output_folder = "output"

    os.makedirs(
        output_folder,
        exist_ok=True
    )

    for index, (x1, y1, x2, y2) in enumerate(
        cards,
        start=1
    ):

        # ---------------------------------------------
        # IMPORTANT:
        # Move inside the card to remove white border
        # ---------------------------------------------

        x1 += BORDER_CROP
        y1 += BORDER_CROP

        x2 -= BORDER_CROP
        y2 -= BORDER_CROP

        # Safety
        if x2 <= x1 or y2 <= y1:

            print(
                f"Skipping image {index}: "
                "invalid crop"
            )

            continue

        # Crop
        cropped = image.crop(
            (
                x1,
                y1,
                x2 + 1,
                y2 + 1
            )
        )

        # ---------------------------------------------
        # Remove white pixels
        # ---------------------------------------------

        cropped = remove_white_pixels(cropped)

        # ---------------------------------------------
        # Rounded corners
        # ---------------------------------------------

        cropped = rounded_corners(
            cropped,
            CORNER_RADIUS
        )

        # ---------------------------------------------
        # Save PNG with transparency
        # ---------------------------------------------

        output_file = os.path.join(
            output_folder,
            f"image_{index:02d}.png"
        )

        cropped.save(
            output_file,
            "PNG"
        )

        print(
            f"[{index}] -> {output_file}"
        )

    print()
    print("================================")
    print("Done!")
    print("Output:", output_folder)
    print("================================")


if __name__ == "__main__":
    main()
