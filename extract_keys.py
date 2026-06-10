import os
import json
import re

src_dir = 'apps/hub/src'
en_json_path = 'apps/hub/src/learnos/i18n/locales/en.json'

with open(en_json_path, 'r', encoding='utf-8') as f:
    en_json = json.load(f)

def set_nested(d, key_path, val):
    parts = key_path.split('.')
    current = d
    for part in parts[:-1]:
        if part not in current or not isinstance(current[part], dict):
            current[part] = {}
        current = current[part]
    if parts[-1] not in current:
        current[parts[-1]] = val

t_pattern = re.compile(r"t\(\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]")
trans_pattern = re.compile(r"<Trans\s+i18nKey=['\"]([^'\"]+)['\"].*?>\s*(.*?)\s*<\/Trans>", re.DOTALL)

found = 0
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Find t('key', 'val')
                for match in t_pattern.findall(content):
                    key, val = match
                    set_nested(en_json, key, val)
                    found += 1
                
                # Find <Trans i18nKey="key">val</Trans>
                for match in trans_pattern.findall(content):
                    key, val = match
                    # strip html/JSX tags if any inside Trans
                    val = re.sub(r'<[^>]+>', '', val).strip()
                    set_nested(en_json, key, val)
                    found += 1

with open(en_json_path, 'w', encoding='utf-8') as f:
    json.dump(en_json, f, indent=2, ensure_ascii=False)

print(f"Extraction complete. Processed {found} instances.")
