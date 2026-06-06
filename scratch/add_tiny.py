import json

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

en_data['tiny'] = {
    "zones": {
        "tap-world": "Tap World",
        "color-mixer": "Color Mixer",
        "shape-sorter": "Shape Sorter",
        "animal-orchestra": "Animal Orchestra",
        "bubble-world": "Bubble World",
        "weather-maker": "Weather Maker",
        "farm-friends": "Farm Friends",
        "day-and-night": "Day and Night",
        "gravity-garden": "Gravity Garden"
    }
}

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
