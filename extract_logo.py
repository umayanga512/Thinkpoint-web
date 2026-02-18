
import json
from bs4 import BeautifulSoup
import base64
import os

html_file = '/run/media/umayangaathapaththu/Job/thinkpoint/src/assets/ThinkPoint Final v1.html'
output_file = '/run/media/umayangaathapaththu/Job/thinkpoint/src/assets/logo.svg'

with open(html_file, 'r') as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')
script_tag = soup.find('script', id='brand-data')

if script_tag:
    data = json.loads(script_tag.string)
    logo_url = data.get('logoUrl')
    
    if logo_url and logo_url.startswith('data:image/svg+xml;base64,'):
        base64_data = logo_url.split(',')[1]
        decoded_data = base64.b64decode(base64_data)
        
        with open(output_file, 'wb') as f:
            f.write(decoded_data)
        print(f"Successfully extracted logo to {output_file}")
    else:
        print("Logo URL not found or not in expected format")
else:
    print("Script tag with id 'brand-data' not found")
