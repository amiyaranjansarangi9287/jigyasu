import json

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

with open('D:/vision_agentic/jigyasu/scratch/academy.json', 'r', encoding='utf-8') as f:
    academy_data = json.load(f)

en_data['academy'] = academy_data

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
