"""Fix corruption from previous script that broke useState and other type annotations."""
import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

# The corruption pattern: {t('auto.FILENAME_text', '('original')  -> should be ('original')
# This appears in useState declarations, type annotations, etc.

CORRUPTION_PATTERN = re.compile(r"\{t\('auto\.[^']+',\s*\('([^']*)'\)\s*\}")

fixed_count = 0
files_fixed = []

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    original = content
    
    # Find all corruption patterns
    def fix_corruption(match):
        original_text = match.group(1)
        return f"('{original_text}')"
    
    content = CORRUPTION_PATTERN.sub(fix_corruption, content)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\learnos\\\\', '')
        files_fixed.append(rel)
        fixed_count += 1

print(f"Fixed {fixed_count} files with corruption:")
for f in files_fixed[:20]:
    print(f"  {f}")
if len(files_fixed) > 20:
    print(f"  ... and {len(files_fixed) - 20} more")
