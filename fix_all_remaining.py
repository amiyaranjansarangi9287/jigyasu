"""Fix ALL remaining corruption patterns."""
import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src')

fixed_files = []
total_fixes = 0

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Pattern A: useState<TYPE>{t('auto.XXX', '('TEXT'); -> useState<TYPE>('TEXT');
    content, n = re.subn(
        r"(use(?:State|Ref)<[^>]+>)\{t\('auto\.[^']+',\s*\('([^']+)'\);",
        r"\1('\2');",
        content
    )
    total_fixes += n
    
    # Pattern B: useState<TYPE>{t('auto.XXX', '(null); -> useState<TYPE>(null);
    content, n = re.subn(
        r"(use(?:State|Ref)<[^>]+>)\{t\('auto\.[^']+',\s*\(null\);",
        r"\1(null);",
        content
    )
    total_fixes += n
    
    # Pattern C: useState<TYPE>{t('auto.XXX', '(''); -> useState<TYPE>('');
    content, n = re.subn(
        r"(use(?:State|Ref)<[^>]+>)\{t\('auto\.[^']+',\s*\(''\);",
        r"\1('');",
        content
    )
    total_fixes += n
    
    # Pattern D: useState<TYPE>{t('auto.XXX', '('X'); -> useState<TYPE>('X');
    content, n = re.subn(
        r"(use(?:State|Ref)<[^>]+>)\{t\('auto\.[^']+',\s*\('([A-Z])'\);",
        r"\1('\2');",
        content
    )
    total_fixes += n
    
    # Pattern E: useState<TYPE>{t('auto.XXX', '('4x4'); -> useState<TYPE>('4x4');
    content, n = re.subn(
        r"(use(?:State|Ref)<[^>]+>)\{t\('auto\.[^']+',\s*\('([^a-zA-Z'][^']*)'\);",
        r"\1('\2');",
        content
    )
    total_fixes += n
    
    # Pattern F: useState<TYPE>{t('auto.XXX', '('All'); -> useState<TYPE>('All');
    content, n = re.subn(
        r"(use(?:State|Ref)<[^>]+>)\{t\('auto\.[^']+',\s*\('([A-Z][a-zA-Z]+)'\);",
        r"\1('\2');",
        content
    )
    total_fixes += n
    
    # Pattern G: switch case return')}<Component {...props} />{t('auto.XXX', '; -> return <Component {...props} />;
    content, n = re.subn(
        r"return'\)\}<([A-Z][a-zA-Z0-9]*) \{\.\.\.props\s*\}/>\{t\('auto\.[^']+',\s*';",
        r"return <\1 {...props} />;",
        content
    )
    total_fixes += n
    
    # Pattern H: Array.map(() =>{t('auto.XXX', 'Array(...)); -> Array.map(() => Array(...));
    content, n = re.subn(
        r"\.map\(\(\) =>\{t\('auto\.[^']+',\s*'([^']+)'\);",
        r".map(() => \1);",
        content
    )
    total_fixes += n
    
    # Pattern I: useState<TYPE>{t('auto.XXX', '('Animals'); -> useState<TYPE>('Animals');
    content, n = re.subn(
        r"(use(?:State|Ref)<[^>]+>)\{t\('auto\.[^']+',\s*\('([A-Z][a-zA-Z\s]+)'\);",
        r"\1('\2');",
        content
    )
    total_fixes += n
    
    # Pattern J: useState<TYPE>{t('auto.XXX', '('White's turn'); -> useState<TYPE>("White's turn");
    content, n = re.subn(
        r"(use(?:State|Ref)<[^>]+>)\{t\('auto\.[^']+',\s*\('([^']+)'\);",
        r"\1('\2');",
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
