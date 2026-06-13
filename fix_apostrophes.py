import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src')

fixed_files = []
total_fixes = 0

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Find t('key', 'text') where text contains an unescaped apostrophe
    # Pattern: t('...', '...'...') - the second string has a single quote inside
    def fix_apostrophe(match):
        full = match.group(0)
        key = match.group(1)
        text = match.group(2)
        # If text contains a single quote that's not escaped, use double quotes
        if "'" in text and "\\'" not in text:
            return f"t('{key}', \"{text}\")"
        return full
    
    content = re.sub(r"t\('([^']+)',\s*'([^']*'[^']*)'\)", fix_apostrophe, content)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\', '')
        fixed_files.append(rel)
        total_fixes += 1

print(f'Fixed apostrophes in {len(fixed_files)} files')
