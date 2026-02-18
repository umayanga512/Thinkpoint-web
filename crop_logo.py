import base64
import re
from io import BytesIO
from PIL import Image

def crop_logo():
    svg_path = 'src/assets/logo.svg'
    
    with open(svg_path, 'r') as f:
        content = f.read()
    
    # Extract base64 image
    match = re.search(r'href="data:image/png;base64,([^"]+)"', content)
    if not match:
        print("Error: Could not find base64 image in SVG")
        return

    b64_data = match.group(1)
    img_data = base64.b64decode(b64_data)
    
    # Open image
    img = Image.open(BytesIO(img_data))
    print(f"Image mode: {img.mode}")
    
    # Check corners
    corners = [
        (0, 0),
        (img.width - 1, 0),
        (0, img.height - 1),
        (img.width - 1, img.height - 1)
    ]
    
    print("Corner pixel values:")
    for x, y in corners:
        print(f"({x}, {y}): {img.getpixel((x, y))}")

    # Calculate bounding box
    bbox = img.getbbox()
    
    if not bbox:
        print("Error: Image is empty or fully transparent")
        return
        
    print(f"Original size: {img.size}")
    print(f"Bounding box (alpha channel): {bbox}")

    # If alpha crop didn't work (full size), try determining bbox based on color
    if bbox == (0, 0, img.width, img.height):
        # Convert to RGBA if not already
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        # Check if corners are white or near white
        corner_pixel = img.getpixel((0, 0))
        threshold = 200
        is_white_bg = corner_pixel[0] > threshold and corner_pixel[1] > threshold and corner_pixel[2] > threshold
        
        if is_white_bg:
            print(f"Detected light background (Corner: {corner_pixel}). Attempting to make transparent...")
            for item in datas:
                if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                    newData.append((255, 255, 255, 0)) # Make Transparent
                else:
                    newData.append(item)
            
            img.putdata(newData)
            bbox = img.getbbox()
            print(f"New Bounding box after removing white: {bbox}")
            if bbox:
                 img = img.crop(bbox)

    # Crop image if we have a valid smaller bbox
    if bbox and bbox != (0, 0, img.width, img.height) and 'newData' not in locals():
         img = img.crop(bbox)

    print(f"Final size: {img.size}")
    
    # Save cropped image to base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    new_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    # Create new SVG content
    width, height = img.size
    new_svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><image href="data:image/png;base64,{new_b64}"/></svg>'
    
    with open(svg_path, 'w') as f:
        f.write(new_svg)
        
    print(f"Successfully processed logo and updated {svg_path}")

if __name__ == "__main__":
    crop_logo()
