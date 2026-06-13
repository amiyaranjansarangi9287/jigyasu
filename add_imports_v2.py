import re
from pathlib import Path

files = [
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\Embeddings\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\GenerativeAI\ExplorePhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\GenerativeAI\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\RAG\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\ReinforcementLearning\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\concepts\Transformers\LearnPhase.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\illustrations\index.tsx',
]

for f in files:
    path = Path(f)
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Check for actual import FROM react-i18next
    if 'react-i18next' not in content:
        lines = content.split('\n')
        last_import = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import = i
        if last_import >= 0:
            lines.insert(last_import + 1, "import { useTranslation } from 'react-i18next';")
            content = '\n'.join(lines)
            with open(f, 'w', encoding='utf-8') as fp:
                fp.write(content)
            print(f'Added import: {path.name}')
        else:
            print(f'No import found: {path.name}')
    else:
        print(f'Already has import: {path.name}')
