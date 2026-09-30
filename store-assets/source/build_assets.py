from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "store-assets" / "source"
STORE = ROOT / "store-assets"
ICONS = ROOT / "assets" / "icons"
MASTER_PATH = SOURCE / "icon-master.png"

BG = (22, 23, 24)
SURFACE = (32, 33, 34)
RAISED = (39, 41, 43)
HOVER = (48, 51, 53)
BORDER = (73, 76, 78)
TEXT = (227, 233, 241)
MUTED = (177, 185, 190)
ACCENT = (86, 180, 248)


def font(size, bold=False):
    filename = "segoeuib.ttf" if bold else "segoeui.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / filename), size)


def gradient(size, top=(18, 20, 24), bottom=(8, 10, 13)):
    image = Image.new("RGB", size, top)
    draw = ImageDraw.Draw(image)
    for y in range(size[1]):
        ratio = y / max(1, size[1] - 1)
        color = tuple(round(top[i] + (bottom[i] - top[i]) * ratio) for i in range(3))
        draw.line((0, y, size[0], y), fill=color)
    return image


def rounded(draw, box, radius=12, fill=SURFACE, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def paste_contained(canvas, source, box, padding=0):
    x0, y0, x1, y1 = box
    width = x1 - x0 - padding * 2
    height = y1 - y0 - padding * 2
    image = source.copy()
    image.thumbnail((width, height), Image.Resampling.LANCZOS)
    x = x0 + (x1 - x0 - image.width) // 2
    y = y0 + (y1 - y0 - image.height) // 2
    canvas.alpha_composite(image, (x, y))


def draw_header(image, title="Learning Portal"):
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, image.width, 72), fill=(27, 29, 31))
    draw.rectangle((0, 70, image.width, 72), fill=(47, 50, 52))
    rounded(draw, (28, 17, 66, 55), radius=9, fill=(28, 83, 126))
    draw.arc((38, 23, 58, 48), start=55, end=290, fill=ACCENT, width=5)
    draw.text((82, 22), title, font=font(22, True), fill=TEXT)
    draw.text((1010, 24), "Jump To", font=font(15), fill=MUTED)
    draw.text((1100, 24), "Help", font=font(15), fill=MUTED)
    rounded(draw, (1187, 15, 1248, 57), radius=8, fill=(46, 91, 181))
    draw.text((1206, 25), "ST", font=font(14, True), fill=(255, 255, 255))


def create_icons(master):
    bbox = master.getchannel("A").getbbox()
    cropped = master.crop(bbox) if bbox else master
    for size in (16, 32, 48, 128):
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        target = max(1, round(size * 0.875))
        icon = cropped.copy()
        icon.thumbnail((target, target), Image.Resampling.LANCZOS)
        canvas.alpha_composite(icon, ((size - icon.width) // 2, (size - icon.height) // 2))
        canvas.save(ICONS / f"icon{size}.png", optimize=True)


def create_promo(master):
    image = gradient((440, 280), (31, 37, 47), (12, 14, 18)).convert("RGBA")
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((5, 38, 230, 263), fill=(41, 166, 255, 80))
    glow = glow.filter(ImageFilter.GaussianBlur(42))
    image.alpha_composite(glow)
    paste_contained(image, master, (18, 42, 224, 258), padding=10)
    draw = ImageDraw.Draw(image)
    draw.text((220, 72), "Brightspace", font=font(30, True), fill=TEXT)
    draw.text((220, 110), "Dark+", font=font(38, True), fill=ACCENT)
    draw.text((222, 166), "A calmer way", font=font(17), fill=MUTED)
    draw.text((222, 190), "to study.", font=font(17), fill=MUTED)
    image.convert("RGB").save(STORE / "promo-small-440x280.jpg", quality=94, optimize=True)

    wide = gradient((1400, 560), (31, 37, 47), (10, 12, 15)).convert("RGBA")
    wide_glow = Image.new("RGBA", wide.size, (0, 0, 0, 0))
    wide_draw = ImageDraw.Draw(wide_glow)
    wide_draw.ellipse((45, 20, 625, 600), fill=(41, 166, 255, 72))
    wide.alpha_composite(wide_glow.filter(ImageFilter.GaussianBlur(80)))
    paste_contained(wide, master, (75, 25, 600, 550), padding=20)
    draw = ImageDraw.Draw(wide)
    draw.text((635, 150), "Brightspace Dark+", font=font(62, True), fill=TEXT)
    draw.text((640, 238), "A carefully tuned dark theme for learning.", font=font(29), fill=MUTED)
    rounded(draw, (640, 325, 1045, 395), radius=18, fill=(29, 111, 168), outline=ACCENT, width=2)
    draw.text((686, 342), "Readable. Calm. Consistent.", font=font(24, True), fill=(255, 255, 255))
    wide.convert("RGB").save(STORE / "promo-marquee-1400x560.jpg", quality=94, optimize=True)


def create_dashboard():
    image = Image.new("RGB", (1280, 800), BG)
    draw_header(image)
    draw = ImageDraw.Draw(image)
    rounded(draw, (48, 105, 870, 755), radius=14, fill=SURFACE, outline=(42, 44, 46))
    draw.text((72, 132), "My Courses", font=font(24, True), fill=TEXT)
    draw.text((72, 174), "All     Pinned     Resources     Fall Term", font=font(16), fill=MUTED)
    draw.line((72, 204, 846, 204), fill=BORDER, width=1)
    draw.line((72, 202, 180, 202), fill=ACCENT, width=4)

    courses = [
        ("Introduction to", "Programming", (40, 105, 150)),
        ("Linear Algebra II", "Fall Term", (48, 122, 88)),
        ("Planetary", "Astronomy", (88, 65, 140)),
        ("Statistics and", "Modelling", (119, 70, 56)),
        ("Co-op Preparation", "Workshop", (65, 94, 118)),
        ("Digital Systems", "Foundations", (84, 84, 104)),
    ]
    for index, (line1, line2, color) in enumerate(courses):
        col, row = index % 3, index // 3
        x = 72 + col * 255
        y = 232 + row * 244
        rounded(draw, (x, y, x + 226, y + 218), radius=10, fill=RAISED, outline=BORDER)
        draw.rounded_rectangle((x, y, x + 226, y + 83), radius=10, fill=color)
        draw.rectangle((x, y + 73, x + 226, y + 83), fill=color)
        draw.ellipse((x + 22, y + 20, x + 67, y + 65), fill=(255, 255, 255, 36), outline=(220, 235, 245))
        draw.text((x + 18, y + 104), line1, font=font(18, True), fill=TEXT)
        draw.text((x + 18, y + 133), line2, font=font(18, True), fill=TEXT)
        draw.text((x + 18, y + 181), "Open course", font=font(14), fill=ACCENT)

    rounded(draw, (900, 105, 1232, 380), radius=14, fill=SURFACE, outline=(42, 44, 46))
    draw.text((926, 132), "What changed?", font=font(22, True), fill=TEXT)
    bullets = ["Dark cards and menus", "Readable course colours", "No white loading flashes", "Legacy pages included"]
    for i, item in enumerate(bullets):
        y = 184 + i * 43
        draw.ellipse((929, y + 4, 941, y + 16), fill=ACCENT)
        draw.text((954, y), item, font=font(16), fill=MUTED)
    rounded(draw, (900, 408, 1232, 585), radius=14, fill=SURFACE, outline=(42, 44, 46))
    draw.text((926, 438), "Brightspace Calendar", font=font(19, True), fill=TEXT)
    rounded(draw, (926, 486, 1206, 543), radius=8, fill=(23, 25, 27), outline=BORDER)
    draw.text((946, 504), "Sunday, September 20", font=font(15), fill=TEXT)
    draw.text((72, 735), "Sanitized preview with sample course names", font=font(13), fill=(125, 133, 139))
    image.save(SOURCE / "draft-dashboard-mockup.png", optimize=True)


def create_content():
    image = Image.new("RGB", (1280, 800), BG)
    draw_header(image, "Sample Course")
    draw = ImageDraw.Draw(image)
    rounded(draw, (36, 98, 334, 765), radius=10, fill=SURFACE, outline=(42, 44, 46))
    rounded(draw, (58, 122, 312, 166), radius=7, fill=RAISED, outline=BORDER)
    draw.text((76, 134), "Search Topics", font=font(15), fill=MUTED)
    items = ["Bookmarks", "Course Schedule", "Table of Contents", "Getting Started", "Tutorials", "Weekly Notes", "Resources"]
    for i, item in enumerate(items):
        y = 194 + i * 64
        selected = item == "Tutorials"
        if selected:
            draw.rectangle((50, y - 8, 324, y + 42), fill=HOVER)
            draw.polygon([(324, y - 8), (334, y + 17), (324, y + 42)], fill=ACCENT)
        draw.text((72, y), item, font=font(17, selected), fill=ACCENT if selected else TEXT)
        draw.line((58, y + 45, 312, y + 45), fill=(50, 53, 55), width=1)

    rounded(draw, (370, 98, 1240, 765), radius=10, fill=SURFACE, outline=(42, 44, 46))
    draw.text((402, 130), "Tutorial 2: Working with Functions", font=font(27, True), fill=TEXT)
    draw.text((402, 176), "Course content stays readable without changing its meaning.", font=font(17), fill=MUTED)
    rounded(draw, (402, 224, 1208, 664), radius=12, fill=(21, 23, 25), outline=BORDER)
    draw.rectangle((402, 224, 805, 292), fill=ACCENT)
    draw.text((510, 244), "Lecture Recording", font=font(18, True), fill=(13, 14, 15))
    draw.text((932, 244), "Lecture Notes", font=font(18, True), fill=ACCENT)
    draw.text((432, 332), "Important: review both examples before the tutorial.", font=font(18, True), fill=(218, 88, 92))
    draw.text((432, 388), "The theme preserves authored colours while automatically", font=font(17), fill=TEXT)
    draw.text((432, 416), "lifting contrast when a colour would be difficult to read.", font=font(17), fill=TEXT)
    rounded(draw, (432, 480, 1024, 576), radius=8, fill=RAISED, outline=BORDER)
    draw.text((458, 501), "Accessible contrast", font=font(17, True), fill=ACCENT)
    draw.text((458, 534), "Links, notices, tabs, and legacy controls remain distinct.", font=font(15), fill=MUTED)
    draw.text((402, 720), "Sanitized preview with sample course content", font=font(13), fill=(125, 133, 139))
    image.save(SOURCE / "draft-content-mockup.png", optimize=True)


def create_calendar():
    image = Image.new("RGB", (1280, 800), BG)
    draw_header(image, "Calendar")
    draw = ImageDraw.Draw(image)
    for i, label in enumerate(("Agenda", "Day", "Week", "Month", "List")):
        x = 42 + i * 105
        fill = HOVER if label == "Week" else RAISED
        rounded(draw, (x, 101, x + 104, 146), radius=4, fill=fill, outline=BORDER)
        draw.text((x + 25, 115), label, font=font(15, label == "Week"), fill=TEXT)
    draw.text((42, 185), "Sep 20, 2026 – Sep 26, 2026", font=font(26), fill=TEXT)

    x0, y0, x1, y1 = 42, 238, 924, 754
    rounded(draw, (x0, y0, x1, y1), radius=7, fill=(26, 28, 30), outline=BORDER)
    left = x0 + 102
    col_w = (x1 - left) / 7
    row_h = 58
    days = ("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")
    for i, day in enumerate(days):
        x = left + i * col_w
        draw.text((x + 28, y0 + 20), day, font=font(15, day in ("Sun", "Sat")), fill=MUTED)
        draw.line((x, y0, x, y1), fill=BORDER, width=1)
    draw.line((x1, y0, x1, y1), fill=BORDER, width=1)
    draw.line((x0, y0 + 61, x1, y0 + 61), fill=(105, 110, 114), width=3)
    times = ("8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM")
    for i, time in enumerate(times):
        y = y0 + 71 + i * row_h
        draw.text((x0 + 13, y + 17), time, font=font(14, True), fill=TEXT)
        draw.line((x0, y + row_h, x1, y + row_h), fill=BORDER, width=1)

    events = [
        (2, 1, 1, (224, 228, 204), "Tutorial 9:30"),
        (5, 0, 1, (247, 175, 99), "Lab 9:00"),
        (2, 5, 2, (217, 236, 219), "Workshop 1:30"),
        (4, 6, 1, (232, 137, 125), "Office hour 2:00"),
        (3, 6, 1, (220, 238, 218), "Study group 3:00"),
    ]
    for col, row, span, color, label in events:
        x = left + col * col_w + 2
        y = y0 + 71 + row * row_h + 4
        rounded(draw, (x, y, x + col_w - 5, y + row_h * span - 8), radius=4, fill=color)
        draw.text((x + 7, y + 8), label, font=font(13, True), fill=(12, 14, 15))

    rounded(draw, (956, 98, 1240, 754), radius=10, fill=SURFACE, outline=(42, 44, 46))
    draw.text((980, 128), "September 2026", font=font(18, True), fill=TEXT)
    month_values = (30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
                    27, 28, 29, 30, 1, 2, 3)
    for row in range(5):
        for col in range(7):
            x = 978 + col * 35
            y = 178 + row * 38
            rounded(draw, (x, y, x + 30, y + 31), radius=5, fill=(24, 26, 28))
            index = row * 7 + col
            number = month_values[index]
            number_color = (110, 118, 124) if index < 2 or index > 31 else TEXT
            draw.text((x + 8, y + 7), str(number), font=font(12), fill=number_color)
    draw.line((976, 392, 1220, 392), fill=BORDER, width=1)
    draw.text((980, 426), "Tasks", font=font(22, True), fill=TEXT)
    rounded(draw, (980, 469, 1214, 516), radius=6, fill=(24, 26, 28), outline=BORDER)
    draw.text((994, 483), "Add a task…", font=font(15), fill=MUTED)
    draw.text((42, 774), "Sanitized preview with sample events", font=font(13), fill=(125, 133, 139))
    image.save(SOURCE / "draft-calendar-mockup.png", optimize=True)


def main():
    STORE.mkdir(parents=True, exist_ok=True)
    ICONS.mkdir(parents=True, exist_ok=True)
    master = Image.open(MASTER_PATH).convert("RGBA")
    create_icons(master)
    create_promo(master)
    create_dashboard()
    create_content()
    create_calendar()


if __name__ == "__main__":
    main()
