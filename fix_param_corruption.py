import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

fixed_files = []

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Pattern: hook inserted inside parameter destructuring
    # }\n  const { t } = useTranslation(); paramName }: Type) {
    # Should be: }\n}: Type) {\n  const { t } = useTranslation();
    content = re.sub(
        r'\}\s*\n\s*const \{ t \} = useTranslation\(\);\s*([^}]+?)\}:',
        r'}\n}:',
        content
    )
    # Then add hook after the opening brace of function body
    # Find pattern: }\n}: Type) {\n  return (
    content = re.sub(
        r'(function\s+\w+\([^)]*\)\s*\{)\s*(\n\s*return)',
        r'\1\n  const { t } = useTranslation();\2',
        content
    )
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\learnos\\\\', '')
        fixed_files.append(rel)

print(f'Fixed param corruption in {len(fixed_files)} files')
