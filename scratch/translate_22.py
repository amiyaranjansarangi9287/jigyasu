import json
import os

langs = {
    'hi': '', 'ta': '', 'te': '', 'bn': '', 'mr': '',
    'gu': '', 'kn': '', 'ml': '', 'pa': '', 'as': '',
    'ur': '', 'sa': '', 'sat': '', 'ne': '', 'kok': '',
    'brx': '', 'doi': '', 'ks': '', 'mai': '', 'sd': '',
    'mni': '', 'od': ''
}

locales_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales'

# Load EN
with open(os.path.join(locales_dir, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

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
    
    # Translate EVERYTHING in en_data
    lang_data = pseudo_translate(en_data, prefix)
            
    with open(lang_file, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, indent=2, ensure_ascii=False)
        
print("Pseudo-translation complete for 22 languages (All keys).")
