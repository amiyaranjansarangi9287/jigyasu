import json
import os

locales_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales'
with open(os.path.join(locales_dir, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Alphabet Rewrites
en_data['early']['alphabet']['A']['items'] = {"0": "Amla", "1": "Auto Rickshaw", "2": "Almond"}
en_data['early']['alphabet']['B']['items'] = {"0": "Banyan Tree", "1": "Bindi", "2": "Bangles"}
en_data['early']['alphabet']['C']['items'] = {"0": "Chai", "1": "Camel", "2": "Cotton"}
en_data['early']['alphabet']['D']['items'] = {"0": "Dholak", "1": "Diya", "2": "Dosa"}
en_data['early']['alphabet']['M']['items'] = {"0": "Mango", "1": "Monsoon", "2": "Marigold"}
en_data['early']['alphabet']['P']['items'] = {"0": "Peacock", "1": "Paneer", "2": "Papaya"}
en_data['early']['alphabet']['R']['items'] = {"0": "Roti", "1": "Rangoli", "2": "River Ganges"}
en_data['early']['alphabet']['S']['items'] = {"0": "Sitar", "1": "Saree", "2": "Samosa"}
en_data['early']['alphabet']['T']['items'] = {"0": "Tiger", "1": "Taj Mahal", "2": "Tabla"}
en_data['early']['alphabet']['Y']['items'] = {"0": "Yoga", "1": "Yak", "2": "Yamuna"}

# Story Builder Animals
en_data['early']['story']['characters']['rabbit'] = "Bengal Tiger"
en_data['early']['story']['characters']['elephant'] = "Asian Elephant"
en_data['early']['story']['characters']['monkey'] = "Rhesus Macaque"
en_data['early']['story']['characters']['fish'] = "Ganges River Dolphin"

# Story Builder Places
en_data['early']['story']['places']['forest'] = "Sundarbans Mangroves"
en_data['early']['story']['places']['ocean'] = "Indian Ocean"
en_data['early']['story']['places']['mountain'] = "Himalayan Peaks"
en_data['early']['story']['places']['farm'] = "Punjab Wheat Fields"

# Recipes
if 'banana-shake' in en_data['early']['recipes']:
    en_data['early']['recipes']['banana-shake']['title'] = "Mango Lassi"
    en_data['early']['recipes']['banana-shake']['description'] = "A sweet and cool Indian yogurt drink."
    en_data['early']['recipes']['banana-shake']['steps'] = {
        "0": "Wash hands",
        "1": "Peel ripe sweet mangoes",
        "2": "Blend mango pieces",
        "3": "Add fresh thick yogurt and blend again",
        "4": "Pour into a glass and serve cool!"
    }

if 'dal-rice' in en_data['early']['recipes']:
    en_data['early']['recipes']['dal-rice']['title'] = "Comforting Dal Chawal"
    en_data['early']['recipes']['dal-rice']['description'] = "The ultimate cozy Indian meal."

if 'fruit-salad' in en_data['early']['recipes']:
    en_data['early']['recipes']['fruit-salad']['title'] = "Chana Chaat"
    en_data['early']['recipes']['fruit-salad']['description'] = "A tangy and healthy chickpea snack."
    en_data['early']['recipes']['fruit-salad']['steps'] = {
        "0": "Wash hands",
        "1": "Take boiled chickpeas (chana) in a bowl",
        "2": "Add chopped tomatoes and cucumbers",
        "3": "Squeeze fresh lemon juice on top",
        "4": "Sprinkle a pinch of chaat masala and mix!"
    }

# Save EN
with open(os.path.join(locales_dir, 'en.json'), 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
    
print("Phase 4: Early World Culturization Complete.")
