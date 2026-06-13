import re
from pathlib import Path

files = [
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Chess.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\ConnectFour.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Game2048.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Hangman.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\JigsawPuzzle.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\MemoryMatch.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Minesweeper.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Pong.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\ReactionTest.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\SimonSays.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Snake.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\Sudoku.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\TicTacToe.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\games\WordSearch.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\heritage\HeritageWorld.tsx',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games\GameHub.tsx',
]

for f in files:
    path = Path(f)
    if not path.exists():
        print(f'MISSING: {f}')
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Fix useState with text value
    content = re.sub(r"useState<[^>]+>\{t\('auto\.[^']+',\s*\('([^']+)'\);", r"useState('\1');", content)
    # Fix useState with null
    content = re.sub(r"useState<[^>]+>\{t\('auto\.[^']+',\s*\(null\);", r"useState(null);", content)
    # Fix useState with empty string
    content = re.sub(r"useState<[^>]+>\{t\('auto\.[^']+',\s*\(''\);", r"useState('');", content)
    # Fix useRef
    content = re.sub(r"useRef<[^>]+>\{t\('auto\.[^']+',\s*\('([^']+)'\);", r"useRef('\1');", content)
    # Fix switch case returns
    content = re.sub(r"return'\)\}<([A-Z][a-zA-Z0-9]*) \{\.\.\.props\s*\}/>\{t\('auto\.[^']+',\s*';", r"return <\1 {...props} />;", content)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print(f'Fixed: {path.name}')
    else:
        print(f'No change: {path.name}')
