import os
import re

apps_dir = 'D:/vision_agentic/jigyasu/apps'
fixed_files = 0

for root, _, files in os.walk(apps_dir):
    if 'node_modules' in root or 'dist' in root:
        continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Pattern: onClick={() = aria-label="Action button"> something}
            # Should be: onClick={() => something} aria-label="Action button"
            
            # Since the aria-label was just blindly inserted, let's just strip it out to fix the syntax
            new_content = re.sub(r'onClick=\{\(\)\s*=\s*aria-label=\"[^\"]*\">\s*', r'onClick={() => ', content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                fixed_files += 1

print(f'Fixed corrupted onClick syntax in {fixed_files} files.')
