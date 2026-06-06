import json
import os

kidscamp_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/kidscamp/data'

with open(os.path.join(kidscamp_dir, 'activities.en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Replacements for culturization
replacements = {
    "sciencelab-solar-oven": {
        "name": "Solar Oven Roasted Papad",
        "description": "Harness the incredible power of the sun to build your own solar oven and perfectly roast crispy papads! Learn about solar thermal energy, reflection, and the greenhouse effect while making a tasty, traditional snack."
    },
    "outdoorquest-bird-feeder": {
        "name": "Coconut Shell Bird Feeder",
        "description": "Repurpose an empty coconut shell into a beautiful, hanging bird feeder! Fill it with local grains and watch the incredible variety of native birds flock to your garden."
    },
    "toybox-wooden-car": {
        "name": "Wooden Auto-Rickshaw (Tuk-Tuk)",
        "description": "Construct your very own wooden Auto-Rickshaw! Learn the physics of axles and wheels as you design and paint the iconic three-wheeled vehicle that navigates busy Indian streets."
    },
    "artstudio-tiedye": {
        "name": "Bandhani Tie-Dye Dupatta",
        "description": "Discover the ancient Indian art of Bandhani! Use rubber bands and vibrant natural dyes to create mesmerizing geometric patterns on a cotton dupatta or scarf."
    },
    "artstudio-pasta-jewelry": {
        "name": "Terracotta Clay Jewelry",
        "description": "Connect with ancient Harappan traditions by sculpting your own terracotta jewelry! Shape natural clay into beautiful beads, dry them in the sun, and paint them with traditional Indian motifs."
    }
}

for item in en_data:
    if item['id'] in replacements:
        item['name'] = replacements[item['id']]['name']
        item['description'] = replacements[item['id']]['description']

with open(os.path.join(kidscamp_dir, 'activities.en.json'), 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

print("Phase 7.1: Kidscamp activities.en.json successfully culturized.")
