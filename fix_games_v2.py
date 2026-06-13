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
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content
    
    # Fix useState with text value - use non-greedy for type
    content = re.sub(r"useState<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*\('([^']+)'\);", r"useState<'\2'>();", content)
    content = re.sub(r"useState<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*\('([a-z]+)'\);", r"useState<'\2'>();", content)
    # Actually just match the whole corrupted pattern and replace
    content = re.sub(r"useState<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*\('([^']+)'\);", r"useState<\1>('\2');", content)
    # For string type specifically
    content = re.sub(r"useState<string>\{t\('auto\.[^']+',\s*\('([^']+)'\);", r"useState<string>('\1');", content)
    # For Color/Mode/Difficulty/GameMode/Skin/Speed/Theme types
    content = re.sub(r"useState<(Color|Mode|Difficulty|GameMode|Skin|Speed|Theme|Turn)>\{t\('auto\.[^']+',\s*\('([^']+)'\);", r"useState<\1>('\2');", content)
    # For 'X' | 'O' type
    content = re.sub(r"useState<'X' \| 'O'>\{t\('auto\.[^']+',\s*\('([^']+)'\);", r"useState<'X' | 'O'>('\1');", content)
    # For Direction type
    content = re.sub(r"useRef<(Direction)>\{t\('auto\.[^']+',\s*\('([^']+)'\);", r"useRef<\1>('\2');", content)
    # Fix useState with null
    content = re.sub(r"useState<string \| null>\{t\('auto\.[^']+',\s*\(null\);", r"useState<string | null>(null);", content)
    # Fix useState with empty string
    content = re.sub(r"useState<string>\{t\('auto\.[^']+',\s*\(''\);", r"useState<string>('');", content)
    # Fix Array.map
    content = re.sub(r"\.map\(\(\) =>\{t\('auto\.[^']+',\s*'([^']+)'\);", r".map(() => \1);", content)
    # Fix switch case returns
    content = re.sub(r"return'\)\}<([A-Z][a-zA-Z0-9]*) \{\.\.\.props\s*\}/>\{t\('auto\.[^']+',\s*';", r"return <\1 {...props} />;", content)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print(f'Fixed: {path.name}')
    else:
        print(f'No change: {path.name}')
