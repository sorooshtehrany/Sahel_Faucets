import tkinter as tk
from PIL import Image, ImageTk
import subprocess
import tempfile
import os


# ---------------------------------------------------------
# Take screenshot
# ---------------------------------------------------------

screenshot_file = os.path.join(
    tempfile.gettempdir(),
    "rgb_picker_screen.png"
)

subprocess.run([
    "gnome-screenshot",
    "-f",
    screenshot_file
])


# ---------------------------------------------------------
# Load screenshot
# ---------------------------------------------------------

image = Image.open(screenshot_file).convert("RGB")

width, height = image.size


# ---------------------------------------------------------
# Tkinter window
# ---------------------------------------------------------

root = tk.Tk()

root.attributes("-fullscreen", True)
root.attributes("-topmost", True)

root.configure(cursor="crosshair")


# ---------------------------------------------------------
# Display screenshot
# ---------------------------------------------------------

photo = ImageTk.PhotoImage(image)

label = tk.Label(
    root,
    image=photo,
    borderwidth=0
)

label.pack()


# ---------------------------------------------------------
# Mouse click
# ---------------------------------------------------------

def get_color(event):

    x = event.x
    y = event.y

    if 0 <= x < width and 0 <= y < height:

        r, g, b = image.getpixel((x, y))

        print()
        print("==============================")
        print(f"RGB: ({r}, {g}, {b})")
        print("==============================")
        print()

    root.destroy()


# ---------------------------------------------------------
# Escape
# ---------------------------------------------------------

def cancel(event):

    root.destroy()


root.bind("<Button-1>", get_color)
root.bind("<Escape>", cancel)


# ---------------------------------------------------------
# Start
# ---------------------------------------------------------

root.mainloop()


# Cleanup

try:
    os.remove(screenshot_file)
except:
    pass
