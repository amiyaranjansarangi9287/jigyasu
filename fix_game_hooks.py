import re
from pathlib import Path

files = [
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\ErrorBoundary.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai\components\ui\Button.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Breakout.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Chess.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\ConnectFour.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\DinoRun.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Game2048.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Minesweeper.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Pong.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\SlidingPuzzle.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Snake.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Sudoku.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Tetris.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\TicTacToe.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\WordSearch.tsx',
]

for f in files:
    path = Path(f)
    if not path.exists():
        print(f'MISSING: {f}')
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Skip if already has hook
    if 'const { t } = useTranslation()' in content:
        print(f'Already has hook: {path.name}')
        continue
    
    lines = content.split('\n')
    
    # Find first function declaration and add hook after opening brace
    for i, line in enumerate(lines):
        if re.search(r'^\s*(export\s+default\s+)?function\s+\w+', line):
            for j in range(i, min(i+10, len(lines))):
                if '{' in lines[j]:
                    # Check next line - don't duplicate
                    if j+1 < len(lines) and 'const { t }' not in lines[j+1]:
                        lines.insert(j+1, '  const { t } = useTranslation();')
                    break
            break
    
    # Check if import needed
    if 'react-i18next' not in content:
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                lines.insert(i+1, "import { useTranslation } from 'react-i18next';")
                break
    
    with open(f, 'w', encoding='utf-8') as fp:
        fp.write('\n'.join(lines))
    print(f'Fixed: {path.name}')
