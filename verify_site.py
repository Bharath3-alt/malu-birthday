import os
import re
import urllib.request

pages = [
    'index.html',
    'childhood.html',
    'now.html',
    'us.html',
    'birthday.html',
]

base = 'http://localhost:8000/'
project_root = r'c:\Users\bhara\Desktop\Malu Birthday'

for page in pages:
    url = base + page
    with urllib.request.urlopen(url) as response:
        html = response.read().decode('utf-8')
        refs = re.findall(r'(?:href|src)="([^"]+)"', html)
        print(f'{page}: HTTP {response.status}')
        for ref in refs:
            if ref.startswith(('http://', 'https://', '#', 'mailto:', 'tel:')):
                continue
            target = os.path.normpath(os.path.join(project_root, ref))
            exists = os.path.exists(target)
            print(f'  {ref} -> {exists}')
