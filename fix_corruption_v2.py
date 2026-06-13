"""Fix corruption from previous script that broke useState and other hooks."""
import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

fixed_files = []

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Pattern 1: useState<TYPE>{t('auto.XXX', '('TEXT'); -> useState<TYPE>('TEXT');
    # Also: useState<TYPE>{t('auto.XXX', '('TEXT') -> useState<TYPE>('TEXT')
    content = re.sub(
        r"useState<([^>]+)>\{t\('auto\.[^']+',\s*\('([^']+)'\)\s*\}",
        r"useState<\1>('\2')",
        content
    )
    
    # Pattern 2: useState')}<TYPE> -> useState<TYPE>
    content = re.sub(
        r"useState'\)\}<",
        r"useState<",
        content
    )
    
    # Pattern 3: useRef')}<TYPE> -> useRef<TYPE>
    content = re.sub(
        r"useRef'\)\}<",
        r"useRef<",
        content
    )
    
    # Pattern 4: useState<...>{t('auto.XXX', 'default') -> useState<...>('default')
    content = re.sub(
        r"(use[A-Za-z]+<[^>]+>)\{t\('auto\.[^']+',\s*'([^']+)'\)\}",
        r"\1('\2')",
        content
    )
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\learnos\\\\', '')
        fixed_files.append(rel)

print(f"Fixed {len(fixed_files)} files:")
for f in fixed_files[:20]:
    print(f"  {f}")
if len(fixed_files) > 20:
    print(f"  ... and {len(fixed_files) - 20} more")
