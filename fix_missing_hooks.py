import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

fixed_files = []

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Skip if no t( usage
    if 't(' not in content:
        continue
    
    # Add import if missing
    if 'react-i18next' not in content:
        lines = content.split('\n')
        last_import = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import = i
        if last_import >= 0:
            lines.insert(last_import + 1, "import { useTranslation } from 'react-i18next';")
            content = '\n'.join(lines)
    
    # Add hook if missing
    if 'const { t } = useTranslation()' not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Find export default function or function declarations
            if re.search(r'^\s*(export\s+default\s+)?function\s+\w+', line):
                # Find the opening brace
                for j in range(i, min(i+5, len(lines))):
                    if '{' in lines[j] and '=>' not in lines[j]:
                        # Check if next line already has a hook
                        if j+1 < len(lines) and 'const' in lines[j+1]:
                            lines.insert(j+1, '  const { t } = useTranslation();')
                        else:
                            lines[j] = lines[j].replace('{', '{\n  const { t } = useTranslation();', 1)
                        break
                    elif lines[j].strip().endswith('{'):
                        lines[j] = lines[j] + '\n  const { t } = useTranslation();'
                        break
                break
        content = '\n'.join(lines)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\learnos\\\\', '')
        fixed_files.append(rel)

print(f'Fixed {len(fixed_files)} files with missing hooks/imports')
for f in fixed_files[:10]:
    print(f'  {f}')
if len(fixed_files) > 10:
    print(f'  ... and {len(fixed_files) - 10} more')
