import os
import re

apps_dir = 'D:/vision_agentic/jigyasu/apps'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'href="#"' in content:
        # Some are just dead links. Replacing with href="/" is safer than href="#" which causes page jumps.
        new_content = content.replace('href="#"', 'href="/"')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk(apps_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            fix_file(path)
