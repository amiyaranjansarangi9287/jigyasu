"""
Comprehensive script to:
1. Wrap hardcoded English strings in learning modules with t() calls
2. Add keys to en.json
3. Translate to all 21 languages
"""
import json
import os
import re
from pathlib import Path

BASE = Path(r'D:\vision_agentic\jigyasu')
LOCALES_DIR = BASE / 'apps' / 'hub' / 'src' / 'learnos' / 'i18n' / 'locales'

# Load extracted strings
with open(BASE / 'learning_strings.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Strings to skip: proper nouns
SKIP_STRINGS = {
    'Compound Interest', 'Batting Average', 'Paramanu', 'Ayurveda described',
    'Jatharagni', 'Jagadish Chandra Bose', 'Gurutva', 'Magnesia', 'Ayaskanta',
    'Prayatna', 'Vrikshayurveda', 'Nakshatras', 'Chand Baori', 'Baori', 'Chand',
    'Sushruta', 'Siddhanta', 'Surya', 'Arrow keys or WASD to move', 'WASD',
    'AI Power', 'AI creates new art from patterns!', 'Gen AI',
    "You're doing what AI does!", 'Real AI art', 'Jigyasu.', 'Agni', 'Vega',
    'Prithvi', 'Jala', 'Newton',
}

# Scientific terms that are standard in all languages
SCIENTIFIC_TERMS = {
    'Cuticle', 'Epidermis', 'Palisade', 'Cortex', 'Pith', 'Root Hairs', 'Root Cap',
    'Fermentation', 'Metamorphosis', 'Dominant alleles', 'Homozygous', 'Heterozygous',
    'Genotype', 'Phenotype',
}
SKIP_STRINGS.update(SCIENTIFIC_TERMS)

# Collect all strings to translate
to_translate = []
for cat in ['ui_labels', 'sentences']:
    for item in data['categories'].get(cat, []):
        text = item['text']
        if text not in SKIP_STRINGS:
            to_translate.append(item)

# Deduplicate by text
dedup = {}
for item in to_translate:
    text = item['text']
    if text not in dedup:
        dedup[text] = []
    dedup[text].append(item)

print(f"Unique strings to translate: {len(dedup)}")

# Generate keys and replacements
key_map = {}  # text -> i18n key
replacements = {}  # file -> list of (old, new)

for idx, (text, locations) in enumerate(dedup.items(), 1):
    # Generate a key from the text
    key_text = re.sub(r'[^a-zA-Z0-9\s]', '', text).lower().strip()
    key_text = re.sub(r'\s+', '_', key_text)[:50]
    key = f'auto.learning.s{idx:03d}_{key_text}'
    key_map[text] = key
    
    for loc in locations:
        file_path = loc['file']
        if file_path not in replacements:
            replacements[file_path] = []
        # Create replacement: >text< -> >{t('key', 'text')}<
        old = f'>{text}<'
        new = f">{{t('{key}', '{text}')}}<"
        replacements[file_path].append((old, new, key, text))

# Apply replacements and add imports
files_modified = set()
for file_path, reps in replacements.items():
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    has_t = 't(' in content
    
    # Apply all replacements for this file
    for old, new, key, text in reps:
        if old in content:
            content = content.replace(old, new, 1)
        else:
            # Try to find the line and replace more carefully
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if text in line and 't(' not in line and 'className' not in line:
                    # Replace only the text between tags
                    pattern = f'>([^<]*{re.escape(text)}[^<]*)<'
                    def replacer(m):
                        return f">{{t('{key}', '{text}')}}<"
                    new_line = re.sub(pattern, replacer, line)
                    if new_line != line:
                        lines[i] = new_line
                        break
            content = '\n'.join(lines)
    
    if content != original:
        # Add useTranslation import if needed
        if 'useTranslation' not in content:
            # Find the last import line and add after it
            import_lines = []
            lines = content.split('\n')
            last_import_idx = -1
            for i, line in enumerate(lines):
                if line.strip().startswith('import '):
                    last_import_idx = i
            if last_import_idx >= 0:
                lines.insert(last_import_idx + 1, "import { useTranslation } from 'react-i18next';")
                content = '\n'.join(lines)
        
        # Add const { t } = useTranslation(); if needed
        if 'const { t } = useTranslation()' not in content and 'function ' in content:
            # Find the first function declaration and add after opening brace
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if re.search(r'export\s+(?:default\s+)?function\s+\w+', line):
                    # Find the opening brace on this or next line
                    for j in range(i, min(i+3, len(lines))):
                        if '{' in lines[j]:
                            lines[j] = lines[j].replace('{', '{\n  const { t } = useTranslation();', 1)
                            break
                    break
            content = '\n'.join(lines)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        files_modified.add(file_path)
        print(f"Modified: {file_path.replace(str(BASE / 'apps' / 'hub' / 'src' / 'learnos' / ''), '')}")

print(f"\nTotal files modified: {len(files_modified)}")

# Update en.json
en_path = LOCALES_DIR / 'en.json'
with open(en_path, 'r', encoding='utf-8') as f:
    en_json = json.load(f)

def set_nested(obj, path, value):
    parts = path.split('.')
    current = obj
    for p in parts[:-1]:
        if p not in current:
            current[p] = {}
        current = current[p]
    current[parts[-1]] = value

for text, key in key_map.items():
    set_nested(en_json, key, text)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_json, f, indent=2, ensure_ascii=False)

print(f"Added {len(key_map)} keys to en.json")
print("Done! Run translate script next.")
