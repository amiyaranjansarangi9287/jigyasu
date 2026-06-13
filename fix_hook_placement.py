import re
from pathlib import Path

files = [
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
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\math\components\LogicPuzzles.tsx',
]

for f in files:
    path = Path(f)
    if not path.exists():
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Remove ALL existing const { t } = useTranslation(); lines
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'const { t } = useTranslation();' not in line:
            new_lines.append(line)
    content = '\n'.join(new_lines)
    
    # Find the main exported component (export default function) and add hook
    lines = content.split('\n')
    found = False
    for i, line in enumerate(lines):
        if re.search(r'^\s*export\s+default\s+function\s+\w+', line):
            for j in range(i, min(i+10, len(lines))):
                if '{' in lines[j]:
                    lines.insert(j+1, '  const { t } = useTranslation();')
                    found = True
                    break
            break
    
    if found:
        content = '\n'.join(lines)
    
    # Ensure import is present
    if 'react-i18next' not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                lines.insert(i+1, "import { useTranslation } from 'react-i18next';")
                break
        content = '\n'.join(lines)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print(f'Fixed: {path.name}')
    else:
        print(f'No change: {path.name}')
