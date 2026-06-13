"""
Extract hardcoded strings from learning modules, wrap in t(), add keys to en.json.
Does NOT touch proper nouns, scientific terms, or CSS values.
"""
import json
import re
from pathlib import Path

SRC = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos')
EN_JSON = Path(r'D:\vision_agentic\jigyasu\apps\hub\src\learnos\i18n\locales\en.json')

# Load existing en.json
with open(EN_JSON, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Proper nouns and terms to keep in English
SKIP = {
    'Sushruta Samhita', 'Jagadish Chandra Bose', 'Bose', 'Surya Siddhanta',
    'Ayurveda', 'Jatharagni', 'Paramanu', 'Gurutva', 'Shanku Yantra',
    'Magnesia', 'Ayaskanta', 'Prayatna', 'Vrikshayurveda', 'Nakshatras',
    'Chand Baori', 'Baori', 'Chand', 'Sushruta', 'Siddhanta', 'Surya',
    'Simple Interest', 'Compound Interest', 'Batting Average',
    'WASD', 'SVG', 'HTML', 'CSS', 'JSON', 'AI', 'ML', 'STEM',
    'Cuticle', 'Epidermis', 'Palisade', 'Cortex', 'Pith', 'Root Hairs', 'Root Cap',
    'Fermentation', 'Metamorphosis', 'Dominant alleles', 'Homozygous', 'Heterozygous',
    'Genotype', 'Phenotype', 'Newton',
}

# Regex to find text between JSX tags
JSX_TEXT = re.compile(r'>([A-Z][a-zA-Z0-9\s\-!,?\'\".:\u00ff-\uffff]{3,60})<')

strings_found = []
files_modified = []

for f in SRC.rglob('*.tsx'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    lines = content.split('\n')
    modified = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        # Skip imports, comments
        if stripped.startswith('import ') or stripped.startswith('//') or stripped.startswith('*'):
            continue
        # Skip if already has t() on this line
        if 't(' in line:
            continue
        
        matches = JSX_TEXT.findall(line)
        for text in matches:
            text = text.strip()
            if not text or len(text) < 4:
                continue
            # Skip proper nouns
            if text in SKIP or any(p in text for p in SKIP):
                continue
            # Skip CSS-like values
            if text.startswith('bg-') or text.startswith('text-') or text.startswith('from-') or text.startswith('to-'):
                continue
            # Skip short/all-caps things
            if text.isupper() and len(text) < 10:
                continue
            # Skip emoji-only
            if len(re.findall(r'[\U0001F300-\U0001F9FF]', text)) > len(text) * 0.4:
                continue
            # Skip single words with hyphens (likely CSS)
            if ' ' not in text and '-' in text:
                continue
            
            # Generate key
            key_text = re.sub(r'[^a-zA-Z0-9\s]', '', text).lower().strip()
            key_text = re.sub(r'\s+', '_', key_text)[:40]
            idx = len(strings_found) + 1
            key = f'auto.learning.s{idx:03d}_{key_text}'
            
            # Replace in line
            old = f'>{text}<'
            new = f">{{t('{key}', '{text}')}}<"
            if old in lines[i]:
                lines[i] = lines[i].replace(old, new, 1)
                modified = True
                strings_found.append({'key': key, 'text': text, 'file': str(f)})
    
    if modified:
        # Check if useTranslation import is needed
        new_content = '\n'.join(lines)
        if "import { useTranslation } from 'react-i18next';" not in new_content:
            # Add import
            lines.insert(1 if lines[0].startswith('//') else 0, "import { useTranslation } from 'react-i18next';")
            new_content = '\n'.join(lines)
        
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        rel = str(f).replace('D:\\\\vision_agentic\\\\jigyasu\\\\apps\\\\hub\\\\src\\\\learnos\\\\', '')
        files_modified.append(rel)

# Add keys to en.json
def set_nested(obj, path, value):
    parts = path.split('.')
    current = obj
    for p in parts[:-1]:
        if p not in current:
            current[p] = {}
        current = current[p]
    current[parts[-1]] = value

for item in strings_found:
    set_nested(en_data, item['key'], item['text'])

with open(EN_JSON, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

print(f'Wrapped {len(strings_found)} strings in {len(files_modified)} files')
print(f'Added {len(strings_found)} keys to en.json')
