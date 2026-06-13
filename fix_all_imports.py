import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Has useTranslation() call but no import
    if 'useTranslation()' in content and 'react-i18next' not in content:
        lines = content.split('\n')
        last_import = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import = i
        if last_import >= 0:
            lines.insert(last_import + 1, "import { useTranslation } from 'react-i18next';")
            with open(f, 'w', encoding='utf-8') as fp:
                fp.write('\n'.join(lines))
            print(f'Added import: {f.name}')
