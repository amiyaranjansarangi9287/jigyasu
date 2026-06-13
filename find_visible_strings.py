import re
from pathlib import Path
from collections import Counter

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

# Find JSX text content (between > and <)
pattern = re.compile(r'>([A-Z][a-zA-Z0-9\s\-!,?\'\".:\u00ff-\uffff]{3,80})<')

results = []
for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Skip if already heavily translated
    if content.count('t(') > 5:
        continue
    
    matches = pattern.findall(content)
    # Filter out CSS classes and short strings
    texts = []
    for m in matches:
        m = m.strip()
        if len(m) >= 5 and not m.startswith('bg-') and not m.startswith('text-') and not m.startswith('from-') and not m.isupper():
            texts.append(m)
    
    if len(texts) >= 3:
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\learnos\\\\', '')
        results.append((rel, len(texts), texts[:3]))

# Sort by count descending
results.sort(key=lambda x: x[1], reverse=True)

for rel, count, samples in results[:30]:
    print(f'{count:3d} {rel}')
    for s in samples:
        print(f'      "{s}"')
