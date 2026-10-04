from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
DESIGN = ROOT / "design"
ASSETS.mkdir(exist_ok=True)
DESIGN.mkdir(exist_ok=True)

REGULAR = r"C:\Windows\Fonts\segoeui.ttf"
SEMIBOLD = r"C:\Windows\Fonts\seguisb.ttf"
BOLD = r"C:\Windows\Fonts\segoeuib.ttf"


def font(size, weight="regular"):
    path = {"regular": REGULAR, "semibold": SEMIBOLD, "bold": BOLD}[weight]
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default(size=size)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_icon():
    image = Image.new("RGB", (1024, 1024), "#F8F6F0")
    draw = ImageDraw.Draw(image)
    draw.ellipse((166, 166, 858, 858), fill="#F4CE14")
    draw.ellipse((502, 118, 647, 265), fill="#495E57")
    draw.polygon([(521, 215), (662, 151), (642, 285)], fill="#495E57")
    draw.text((512, 543), "L", font=font(430, "bold"), fill="#34443E", anchor="mm", stroke_width=4)
    image.save(ASSETS / "icon.png", optimize=True)
    image.resize((432, 432), Image.Resampling.LANCZOS).save(ASSETS / "android-icon-foreground.png", optimize=True)
    mono = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    md = ImageDraw.Draw(mono)
    md.ellipse((71, 71, 361, 361), fill="#FFFFFF")
    md.text((216, 215), "L", font=font(216, "bold"), fill="#000000", anchor="mm")
    mono.save(ASSETS / "android-icon-monochrome.png", optimize=True)
    Image.new("RGB", (432, 432), "#F4CE14").save(ASSETS / "android-icon-background.png", optimize=True)


def draw_phone(draw, x, y, w, h, title):
    rounded(draw, (x, y, x + w, y + h), 40, "#FFFFFF", "#24312C", 4)
    rounded(draw, (x + w * 0.34, y + 12, x + w * 0.66, y + 23), 8, "#D8DCD8")
    draw.text((x + 27, y + 37), "9:41", font=font(13, "semibold"), fill="#34443E")
    draw.text((x + w - 28, y + 37), "●  ▮", font=font(11, "semibold"), fill="#34443E", anchor="ra")
    draw.text((x + 26, y + 68), title, font=font(16, "bold"), fill="#495E57")


def draw_onboarding(draw, x, y, w):
    draw_phone(draw, x, y, w, 810, "LITTLE LEMON")
    sx = x + 28
    inner = w - 56
    draw.text((sx, y + 123), "A SEAT AT OUR TABLE", font=font(11, "bold"), fill="#495E57")
    draw.text((sx, y + 160), "Your table is", font=font(33, "bold"), fill="#1D252C")
    draw.text((sx, y + 202), "waiting.", font=font(33, "bold"), fill="#1D252C")
    draw.text((sx, y + 252), "A few details help us make your", font=font(13), fill="#667078")
    draw.text((sx, y + 273), "experience feel like yours.", font=font(13), fill="#667078")
    rounded(draw, (sx, y + 321, sx + inner, y + 569), 18, "#FFFFFF", "#E4E2DB", 2)
    for label, value, top in [("FIRST NAME", "Alex Morgan", 343), ("LAST NAME", "Morgan", 412), ("EMAIL ADDRESS", "alex@example.com", 481)]:
        draw.text((sx + 15, y + top), label, font=font(10, "bold"), fill="#495E57")
        draw.text((sx + 15, y + top + 23), value, font=font(15), fill="#1D252C")
    for dy in (401, 470):
        draw.line((sx + 14, y + dy, sx + inner - 14, y + dy), fill="#E4E2DB", width=2)
    draw.text((sx, y + 596), "▣  Your details stay on this device.", font=font(11), fill="#667078")
    rounded(draw, (sx, y + 634, sx + inner, y + 688), 15, "#F4CE14")
    draw.text((sx + 18, y + 661), "Next", font=font(14, "bold"), fill="#34443E", anchor="lm")
    draw.text((sx + inner - 18, y + 661), "→", font=font(21, "bold"), fill="#34443E", anchor="rm")


def draw_home(draw, x, y, w):
    draw_phone(draw, x, y, w, 810, "HOME")
    sx = x + 23
    inner = w - 46
    rounded(draw, (sx, y + 112, sx + inner, y + 280), 19, "#495E57")
    draw.text((sx + 17, y + 133), "A LITTLE SUNSHINE IN", font=font(9, "bold"), fill="#F4CE14")
    draw.text((sx + 17, y + 160), "Little Lemon", font=font(24, "bold"), fill="#FFFFFF")
    draw.text((sx + 17, y + 196), "Mediterranean favorites, made fresh", font=font(10), fill="#E2E9E4")
    draw.text((sx + 17, y + 215), "and shared with love.", font=font(10), fill="#E2E9E4")
    draw.text((sx + 17, y + 257), "⌖  Chicago, Illinois", font=font(10, "semibold"), fill="#E4EBE7")
    rounded(draw, (sx, y + 294, sx + inner, y + 340), 14, "#FFFFFF", "#E4E2DB", 2)
    draw.text((sx + 15, y + 317), "⌕   Find something delicious", font=font(12), fill="#8C9690", anchor="lm")
    draw.text((sx, y + 370), "Order for delivery", font=font(17, "bold"), fill="#1D252C")
    chips = [("All", 43), ("Starters", 67), ("Mains", 52), ("Desserts", 66)]
    cx = sx
    for i, (label, cw) in enumerate(chips):
        rounded(draw, (cx, y + 403, cx + cw, y + 433), 15, "#495E57" if i == 0 else "#ECEAE2")
        draw.text((cx + cw / 2, y + 418), label, font=font(10, "bold"), fill="#FFFFFF" if i == 0 else "#1D252C", anchor="mm")
        cx += cw + 5
    rows = [("Greek Salad", "$12.99"), ("Bruschetta", "$7.99"), ("Grilled Fish", "$20.00")]
    for i, (name, price) in enumerate(rows):
        top = y + 456 + i * 100
        draw.text((sx, top), name, font=font(13, "bold"), fill="#1D252C")
        draw.text((sx, top + 23), "Fresh, bright and full of flavor", font=font(9), fill="#667078")
        draw.text((sx, top + 52), price, font=font(11, "bold"), fill="#495E57")
        rounded(draw, (sx + inner - 63, top - 2, sx + inner, top + 65), 13, ["#E7EEE9", "#F5E2D8", "#F4EBC5"][i])
        draw.ellipse((sx + inner - 48, top + 12, sx + inner - 16, top + 44), fill="#F4CE14")
        draw.line((sx, top + 83, sx + inner, top + 83), fill="#E4E2DB", width=1)


def draw_profile(draw, x, y, w):
    draw_phone(draw, x, y, w, 810, "PROFILE")
    sx = x + 25
    inner = w - 50
    draw.ellipse((sx, y + 112, sx + 64, y + 176), fill="#F4CE14")
    draw.text((sx + 32, y + 144), "AM", font=font(18, "bold"), fill="#34443E", anchor="mm")
    draw.text((sx + 78, y + 117), "ALEX MORGAN", font=font(9, "bold"), fill="#495E57")
    draw.text((sx + 78, y + 137), "Alex Morgan", font=font(17, "bold"), fill="#1D252C")
    draw.text((sx + 78, y + 160), "alex@example.com", font=font(10), fill="#667078")
    draw.text((sx, y + 207), "Personal details", font=font(15, "bold"), fill="#1D252C")
    rounded(draw, (sx, y + 233, sx + inner, y + 440), 17, "#FFFFFF", "#E4E2DB", 2)
    for label, value, top in [("FIRST NAME", "Alex", 251), ("LAST NAME", "Morgan", 316), ("EMAIL ADDRESS", "alex@example.com", 381)]:
        draw.text((sx + 14, y + top), label, font=font(9, "bold"), fill="#495E57")
        draw.text((sx + 14, y + top + 22), value, font=font(13), fill="#1D252C")
    for dy in (309, 374):
        draw.line((sx + 13, y + dy, sx + inner - 13, y + dy), fill="#E4E2DB", width=1)
    draw.text((sx, y + 469), "Keep me in the loop", font=font(15, "bold"), fill="#1D252C")
    for top, label, on in [(502, "Order updates", True), (558, "Special offers", False)]:
        draw.text((sx + 1, y + top), label, font=font(11, "semibold"), fill="#1D252C")
        rounded(draw, (sx + inner - 42, y + top - 3, sx + inner, y + top + 19), 11, "#495E57" if on else "#DADDD9")
        draw.ellipse((sx + inner - (21 if on else 39), y + top - 1, sx + inner - (3 if on else 21), y + top + 17), fill="#FFFFFF")
    rounded(draw, (sx, y + 613, sx + inner, y + 661), 14, "#F4CE14")
    draw.text((sx + inner / 2, y + 637), "Save changes", font=font(12, "bold"), fill="#34443E", anchor="mm")
    draw.text((sx + inner / 2, y + 704), "LOG OUT", font=font(10, "bold"), fill="#B84E36", anchor="mm")


def draw_wireframe():
    width, height = 1920, 1230
    image = Image.new("RGB", (width, height), "#F8F6F0")
    draw = ImageDraw.Draw(image)
    draw.text((90, 68), "LITTLE LEMON", font=font(14, "bold"), fill="#495E57")
    draw.text((90, 105), "The guest journey", font=font(46, "bold"), fill="#1D252C")
    draw.text((91, 170), "A simple welcome, a bright menu and a profile that remembers your preferences.", font=font(18), fill="#667078")
    draw.line((90, 220, 1830, 220), fill="#D8D8D0", width=2)
    phone_w, phone_y = 420, 285
    xs = [110, 750, 1390]
    draw_onboarding(draw, xs[0], phone_y, phone_w)
    draw_home(draw, xs[1], phone_y, phone_w)
    draw_profile(draw, xs[2], phone_y, phone_w)
    labels = ["01   ONBOARDING", "02   HOME & MENU", "03   PROFILE"]
    captions = ["Required details unlock the next step.", "Search and category chips narrow the menu.", "Edits persist; log out clears local details."]
    for x, label, caption in zip(xs, labels, captions):
        draw.text((x, 1126), label, font=font(13, "bold"), fill="#495E57")
        draw.text((x, 1152), caption, font=font(12), fill="#667078")
    draw.text((1830, 1187), "LITTLE LEMON · CAPSTONE WIREFRAME", font=font(9, "bold"), fill="#88918C", anchor="ra")
    image.save(DESIGN / "wireframe.jpg", quality=94, optimize=True, subsampling=0)


draw_icon()
draw_wireframe()
