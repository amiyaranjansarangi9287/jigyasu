import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Skip if no t( usage
    if 't(' not in content:
        continue
    
    # Skip if already has hook
    if 'const { t } = useTranslation()' in content:
        continue
    
    # Skip if it's a type/interface file with no function body
    lines = content.split('\n')
    
    # Find first function with a body (has { and return/const/setState etc.)
    func_start = -1
    brace_line = -1
    for i, line in enumerate(lines):
        if re.search(r'^\s*(export\s+default\s+)?function\s+\w+', line):
            func_start = i
            for j in range(i, min(i+5, len(lines))):
                if '{' in lines[j]:
                    brace_line = j
                    break
            break
    
    if brace_line >= 0:
        # Check next line - if it's already a const/state, insert before it
        if brace_line + 1 < len(lines):
            next_line = lines[brace_line + 1]
            if 'const' in next_line or 'useState' in next_line or 'useEffect' in next_line:
                lines.insert(brace_line + 1, '  const { t } = useTranslation();')
            else:
                # Replace the { with {\n hook
                lines[brace_line] = lines[brace_line].replace('{', '{\n  const { t } = useTranslation();', 1)
        else:
            lines[brace_line] = lines[brace_line].replace('{', '{\n  const { t } = useTranslation();', 1)
        
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write('\n'.join(lines))
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\learnos\\\\', '')
        print(f'Added hook: {rel}')
