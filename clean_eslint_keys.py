import json
import os

locales_dir = 'apps/hub/src/learnos/i18n/locales'

def clean_dict(d):
    keys_to_delete = []
    for k, v in d.items():
        if k.startswith('eslint_disable'):
            keys_to_delete.append(k)
        elif isinstance(v, dict):
            clean_dict(v)
    for k in keys_to_delete:
        del d[k]

for filename in os.listdir(locales_dir):
    if filename.endswith('.json'):
        filepath = os.path.join(locales_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        clean_dict(data)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')
print("Successfully removed eslint keys from all locales.")
