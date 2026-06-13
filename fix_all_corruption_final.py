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
    content, n = re.subn(
        r"useState<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*'\('([^']+)'\);",
        r"useState<\1>('\2');",
        content
    )
    total_fixes += n
    
    # Pattern 2: useState<TYPE>{t('auto.XXX', '('null'); -> useState<TYPE>(null);
    content, n = re.subn(
        r"useState<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*'\(null'\);",
        r"useState<\1>(null);",
        content
    )
    total_fixes += n
    
    # Pattern 3: useState<TYPE>{t('auto.XXX', '(''); -> useState<TYPE>('');
    content, n = re.subn(
        r"useState<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*'\(''\);",
        r"useState<\1>('');",
        content
    )
    total_fixes += n
    
    # Pattern 4: useState<TYPE>{t('auto.XXX', '('X'); -> useState<TYPE>('X');
    content, n = re.subn(
        r"useState<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*'\('([A-Z])'\);",
        r"useState<\1>('\2');",
        content
    )
    total_fixes += n
    
    # Pattern 5: useRef<TYPE>{t('auto.XXX', '('TEXT'); -> useRef<TYPE>('TEXT');
    content, n = re.subn(
        r"useRef<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*'\('([^']+)'\);",
        r"useRef<\1>('\2');",
        content
    )
    total_fixes += n
    
    # Pattern 6: .map(() =>{t('auto.XXX', 'Array...'); -> .map(() => Array...);
    content, n = re.subn(
        r"\.map\(\(\) =>\{t\('auto\.[^']+',\s*'([^']+)'\);",
        r".map(() => \1);",
        content
    )
    total_fixes += n
    
    # Pattern 7: switch case return')}<Component {...props} />{t('auto.XXX', '; -> return <Component {...props} />;
    content, n = re.subn(
        r"return'\)\}<([A-Z][a-zA-Z0-9]*) \{\.\.\.props\s*\}/>\{t\('auto\.[^']+',\s*';",
        r"return <\1 {...props} />;",
        content
    )
    total_fixes += n
    
    # Pattern 8: aria-label=TEXT -> aria-label="TEXT"
    content, n = re.subn(
        r"aria-label=([A-Za-z][A-Za-z\s]+)(?=[>\s])",
        r'aria-label="\1"',
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
