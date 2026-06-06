import json
import os

langs = {
    'hi': '[HI] ',
    'ta': '[TA] ',
    'te': '[TE] ',
    'bn': '[BN] ',
    'mr': '[MR] '
}

locales_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales'

# Load EN
with open(os.path.join(locales_dir, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

blocks_to_translate = ['academy', 'discovery', 'tiny', 'explorer', 'early', 'lab']

def pseudo_translate(obj, prefix):
    if isinstance(obj, dict):
        return {k: pseudo_translate(v, prefix) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [pseudo_translate(v, prefix) for v in obj]
    elif isinstance(obj, str):
        return prefix + obj
    else:
        return obj

for lang, prefix in langs.items():
    lang_file = os.path.join(locales_dir, f'{lang}.json')
    if os.path.exists(lang_file):
        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)
            
        for block in blocks_to_translate:
            if block in en_data:
                lang_data[block] = pseudo_translate(en_data[block], prefix)
                
        with open(lang_file, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, indent=2, ensure_ascii=False)
            
print("Pseudo-translation complete.")
