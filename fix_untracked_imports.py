from pathlib import Path

for dir in [
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\ai',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\games',
    r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\heritage',
]:
    for f in Path(dir).rglob('*.tsx'):
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        if 'useTranslation()' in content and 'react-i18next' not in content:
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if line.strip().startswith('import '):
                    lines.insert(i+1, "import { useTranslation } from 'react-i18next';")
                    break
            with open(f, 'w', encoding='utf-8') as fp:
                fp.write('\n'.join(lines))
            print(f'Fixed import: {f.name}')
