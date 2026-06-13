"""Extract all hardcoded English strings from learning modules for i18n."""
import json
import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')

# Proper nouns that should stay English
PROPER_NOUNS = {
    'Sushruta Samhita', 'Jagadish Chandra Bose', 'Bose', 'Surya Siddhanta',
    'Ayurveda', 'Jatharagni', 'Paramanu', 'Gurutva', 'Shanku Yantra',
    'Magnesia', 'Ayaskanta', 'Prayatna', 'Vrikshayurveda', 'Nakshatras',
    'Chand Baori', 'Baori', 'Chand', 'Sushruta', 'Siddhanta', 'Surya',
    'Simple Interest', 'Compound Interest', 'Batting Average',
    'WASD', 'SVG', 'HTML', 'CSS', 'JSON', 'AI', 'ML', 'STEM',
}

# Skip patterns: CSS class values, aria labels, etc.
SKIP_PATTERNS = re.compile(
    r'^(from-|to-|bg-|text-|border-|hover:|dark:|shadow-|ring-|opacity-|scale-|rotate-|translate-|w-|h-|min-|max-|flex|grid|block|hidden|absolute|relative|fixed|sticky|overflow-|z-|p-|m-|px-|py-|mx-|my-|pt-|pb-|pl-|pr-|mt-|mb-|ml-|mr-|gap-|space-|justify-|items-|content-|self-|order-|col-|row-|basis-|grow-|shrink-|auto|span|start|end|center|left|right|top|bottom|full|screen|none|auto|px|rem|em|%|deg|rad|turn|s|ms|ease|linear|cubic|step|inset|opacity|blur|brightness|contrast|saturate|sepia|invert|grayscale|hue|drop|backdrop|transition|duration|delay|transform|animate|cursor|select|resize|snap|scroll|touch|pointer|select|resize|caret|accent|appearance|fill|stroke|sr)',
    re.I
)

# Find all >text< patterns that are actual content
results = []
for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        # Skip imports, comments
        if stripped.startswith('import ') or stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('/*'):
            continue
        # Find text between JSX tags: >...<
        # Use a more careful pattern - only text that looks like real content
        matches = re.findall(r'>([A-Z][a-zA-Z\s\-!,?\'\".\d]{3,60})<', line)
        for m in matches:
            text = m.strip()
            if not text:
                continue
            # Skip if already wrapped in t()
            if 't(' in line:
                continue
            # Skip CSS-like values
            if SKIP_PATTERNS.match(text):
                continue
            # Skip single words that look like CSS classes
            if ' ' not in text and '-' in text:
                continue
            # Skip emoji-only or mostly emoji
            if len(re.findall(r'[\U0001F300-\U0001F9FF]', text)) > len(text) * 0.3:
                continue
            # Skip if it's inside className or style
            if 'className=' in line or 'style=' in line:
                continue
            # Skip if it's a URL or path
            if '/' in text or '\\' in text:
                continue
            # Skip very short things
            if len(text) < 4:
                continue
            rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\', '')
            results.append({'file': rel, 'line': i, 'text': text})

# Deduplicate by text
seen = {}
unique = []
for r in results:
    if r['text'] not in seen:
        seen[r['text']] = r
        unique.append(r)

# Categorize
categorized = {'proper_nouns': [], 'ui_labels': [], 'sentences': [], 'technical': []}
for r in unique:
    text = r['text']
    if text in PROPER_NOUNS or any(p in text for p in PROPER_NOUNS):
        categorized['proper_nouns'].append(r)
    elif len(text) > 25:
        categorized['sentences'].append(r)
    elif any(t in text for t in ['Interest', 'Average', 'Conversion', 'Probability']):
        categorized['technical'].append(r)
    else:
        categorized['ui_labels'].append(r)

# Save results
output = {
    'total': len(unique),
    'categories': {k: v for k, v in categorized.items()},
}

with open(r'D:\vision_agentic\jigyasu\learning_strings.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

for cat, items in categorized.items():
    print(f'=== {cat.upper()}: {len(items)} ===')
    for item in items[:10]:
        print(f"  {item['file']}:{item['line']}: {item['text']}")
    if len(items) > 10:
        print(f'  ... and {len(items)-10} more')
    print()

print(f'TOTAL UNIQUE STRINGS TO TRANSLATE: {len(categorized["ui_labels"]) + len(categorized["sentences"]) + len(categorized["technical"])}')
