import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Has t( call but no hook
    if 't(' in content and 'const { t } = useTranslation()' not in content:
        lines = content.split('\n')
        
        # Find first function with body and add hook
        for i, line in enumerate(lines):
            if re.search(r'^\s*(export\s+default\s+)?function\s+\w+', line):
                for j in range(i, min(i+5, len(lines))):
                    if '{' in lines[j]:
                        # Insert after opening brace
                        if j+1 < len(lines):
                            lines.insert(j+1, '  const { t } = useTranslation();')
                        else:
                            lines[j] = lines[j].replace('{', '{\n  const { t } = useTranslation();', 1)
                        break
                break
        
        new_content = '\n'.join(lines)
        if new_content != content:
            # Check if import needed
            if 'react-i18next' not in new_content:
                lines2 = new_content.split('\n')
                for i, line in enumerate(lines2):
                    if line.strip().startswith('import '):
                        lines2.insert(i+1, "import { useTranslation } from 'react-i18next';")
                        break
                new_content = '\n'.join(lines2)
            
            with open(f, 'w', encoding='utf-8') as fp:
                fp.write(new_content)
            print(f'Fixed: {f.name}')
