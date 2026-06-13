import re
from pathlib import Path

# Files that need useTranslation import added
files_needing_import = [
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\Embeddings\ExplorePhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\Embeddings\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\GenerativeAI\ExplorePhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\GenerativeAI\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\RAG\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\ReinforcementLearning\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\Transformers\ExplorePhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\Transformers\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\games\SpeedRound.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\story\StoryPlayer.tsx',
]

# Special file with multiple functions needing hook
illustrations_file = r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\illustrations\index.tsx'

for f in files_needing_import:
    path = Path(f)
    if not path.exists():
        print(f'MISSING: {f}')
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Add import if missing
    if 'useTranslation' not in content:
        # Find last import line
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
        # Find first function declaration
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if re.search(r'export\s+(?:default\s+)?function\s+\w+', line):
                # Insert after the opening brace
                for j in range(i, min(i+3, len(lines))):
                    if '{' in lines[j]:
                        lines[j] = lines[j].replace('{', '{\n  const { t } = useTranslation();', 1)
                        break
                break
        content = '\n'.join(lines)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print(f'Fixed: {path.name}')
    else:
        print(f'No change: {path.name}')

# Fix illustrations/index.tsx specially
if Path(illustrations_file).exists():
    with open(illustrations_file, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Add import if missing
    if 'useTranslation' not in content:
        lines = content.split('\n')
        last_import = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import = i
        if last_import >= 0:
            lines.insert(last_import + 1, "import { useTranslation } from 'react-i18next';")
            content = '\n'.join(lines)
    
    # Add hook to each exported function that uses t
    if content != original or 'const { t } = useTranslation()' not in content:
        lines = content.split('\n')
        new_lines = []
        i = 0
        while i < len(lines):
            new_lines.append(lines[i])
            # After a line with `export function` or `function` that has `{` on same or next line
            if re.search(r'\bfunction\s+\w+.*\{', lines[i]) and i+1 < len(lines):
                if 'const { t } = useTranslation()' not in lines[i+1] and 't(' in content:
                    new_lines.append('  const { t } = useTranslation();')
            i += 1
        content = '\n'.join(new_lines)
    
    if content != original:
        with open(illustrations_file, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print('Fixed: illustrations/index.tsx')
    else:
        print('No change: illustrations/index.tsx')
