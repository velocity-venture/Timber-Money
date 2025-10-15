from PIL import Image, ImageDraw, ImageFont
w, h = 800, 600
img = Image.new("RGB", (w, h), color="white")
d = ImageDraw.Draw(img)
try:
    f = ImageFont.truetype("DejaVuSans-Bold.ttf", 28)
except:
    f = ImageFont.load_default()
y = 20
d.text((30, y), "SAMPLE STORE", font=f, fill="black"); y += 50
d.text((30, y), "123 Main St", font=f, fill="black"); y += 35
d.text((30, y), "Anytown, USA", font=f, fill="black"); y += 35
d.text((30, y), "Date: 2025-10-15", font=f, fill="black"); y += 50
d.text((30, y), "Item A       $5.00", font=f, fill="black"); y += 35
d.text((30, y), "Item B       $7.34", font=f, fill="black"); y += 35
d.text((30, y), "----------------------", font=f, fill="black"); y += 35
d.text((30, y), "TOTAL:       $12.34", font=f, fill="black"); y += 50
d.text((30, y), "Thank you!", font=f, fill="black")
img.save("/home/runner/workspace/sample_receipt.png")
print("Wrote /home/runner/workspace/sample_receipt.png")
