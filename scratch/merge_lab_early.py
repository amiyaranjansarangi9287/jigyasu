import json

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open('D:/vision_agentic/jigyasu/scratch/lab.json', 'r', encoding='utf-8') as f:
    lab_data = json.load(f)

with open('D:/vision_agentic/jigyasu/scratch/early.json', 'r', encoding='utf-8') as f:
    early_data = json.load(f)

en_data['lab'] = lab_data
en_data['early'] = early_data

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
