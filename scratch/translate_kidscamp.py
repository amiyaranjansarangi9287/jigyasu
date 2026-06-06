import json
import os

langs = {
    'hi': '[HI] ', 'ta': '[TA] ', 'te': '[TE] ', 'bn': '[BN] ', 'mr': '[MR] ',
    'gu': '[GU] ', 'kn': '[KN] ', 'ml': '[ML] ', 'pa': '[PA] ', 'as': '[AS] ',
    'ur': '[UR] ', 'sa': '[SA] ', 'sat': '[SAT] ', 'ne': '[NE] ', 'kok': '[KOK] ',
    'brx': '[BRX] ', 'doi': '[DOI] ', 'ks': '[KS] ', 'mai': '[MAI] ', 'sd': '[SD] ',
    'mni': '[MNI] ', 'od': '[OD] '
}

kidscamp_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/kidscamp/data'

# Load EN
with open(os.path.join(kidscamp_dir, 'activities.en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

def pseudo_translate(obj, prefix):
    if isinstance(obj, dict):
        return {k: pseudo_translate(v, prefix) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [pseudo_translate(v, prefix) for v in obj]
    elif isinstance(obj, str):
        # We only want to pseudo-translate actual text content, not IDs or image paths
        # For simplicity, if it contains spaces or is uppercase, we translate it
        if " " in obj or len(obj) > 15:
            return prefix + obj
        return obj
    else:
        return obj

for lang, prefix in langs.items():
    lang_file = os.path.join(kidscamp_dir, f'activities.{lang}.json')
    
    # We will just rewrite the whole array for each language
    lang_data = pseudo_translate(en_data, prefix)
            
    with open(lang_file, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, indent=2, ensure_ascii=False)
        
print("Phase 6.3: Kidscamp pseudo-translation complete for 22 languages.")
