"""Fix ALL remaining corruption from the previous script."""
import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src')

fixed_files = []
total_fixes = 0

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Pattern 1: useState<TYPE>{t('auto.XXX', '('TEXT'); -> useState<TYPE>('TEXT');
    # Matches: {t('auto.anything', '(something');
    content, n = re.subn(
        r"\{t\('auto\.[^']+',\s*\('([^']+)'\);",
        r"('\1');",
        content
    )
    total_fixes += n
    
    # Pattern 2: useState<TYPE>{t('auto.XXX', '(null); -> useState<TYPE>(null);
    content, n = re.subn(
        r"\{t\('auto\.[^']+',\s*\(null\);",
        r"(null);",
        content
    )
    total_fixes += n
    
    # Pattern 3: useState<TYPE>{t('auto.XXX', '('', -> useState<TYPE>('', 
    content, n = re.subn(
        r"\{t\('auto\.[^']+',\s*\('',",
        r"('',",
        content
    )
    total_fixes += n
    
    # Pattern 4: useState<TYPE>{t('auto.XXX', '('X'); -> useState<TYPE>('X');
    content, n = re.subn(
        r"\{t\('auto\.[^']+',\s*\('([A-Z])'\);",
        r"('\1');",
        content
    )
    total_fixes += n
    
    # Pattern 5: useState<TYPE>{t('auto.XXX', '('4x4'); -> useState<TYPE>('4x4');
    content, n = re.subn(
        r"\{t\('auto\.[^']+',\s*\('([^a-zA-Z][^']*)'\);",
        r"('\1');",
        content
    )
    total_fixes += n
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\', '')
        fixed_files.append(rel)

print(f"Fixed {total_fixes} corruptions in {len(fixed_files)} files")
for f in fixed_files[:20]:
    print(f"  {f}")
if len(fixed_files) > 20:
    print(f"  ... and {len(fixed_files) - 20} more")
