import os
import re
import json

EN_JSON_PATH = "apps/hub/src/learnos/i18n/locales/en.json"

def update_json_data():
    with open(EN_JSON_PATH, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # We inject the data structures for Phase 11 into en.json
    
    # Discovery Data
    if 'algebraChallenges' not in en_data['discovery']:
        en_data['discovery']['algebraChallenges'] = {
            "alg1": {"hint": "Start by removing 5 from both sides."},
            "alg2": {"hint": "Divide by 2."},
            "alg3": {"hint": "Add 4 first."},
            "alg4": {"hint": "Subtract 3, then multiply by 2."},
            "alg5": {"hint": "Move the variables to one side."},
            "alg6": {"hint": "Distribute the 2, or divide by 2 first."},
            "alg7": {"hint": "What number squared equals 49?"},
            "alg8": {"hint": "Subtract 2x and add 3 to both sides."}
        }
    
    en_data['discovery']['cellOrganelles'] = {
        "nucleus": {"name": "Nucleus", "role": "The Mayor's Office. Contains the city's blueprints."},
        "mitochondria": {"name": "Mitochondria", "role": "The Power Plant. Converts sugar into energy."},
        "ribosome": {"name": "Ribosome", "role": "The Factory. Builds proteins."},
        "golgi": {"name": "Golgi Apparatus", "role": "The Post Office. Packages and ships proteins."},
        "lysosome": {"name": "Lysosome", "role": "The Recycling Center. Breaks down waste."}
    }
    
    en_data['discovery']['chemicalReactions'] = {
        "water": {"name": "Making Water", "realWorldContext": "Hydrogen fuel cells produce electricity and water."},
        "rust": {"name": "Rusting Iron", "realWorldContext": "Why your bicycle chain rusts in the monsoon."},
        "photosynthesis": {"name": "Photosynthesis", "realWorldContext": "How a banyan tree makes food from sunlight."}
    }

    # Academy Data
    if 'curves' not in en_data['academy']:
        en_data['academy']['curves'] = {
            "cubic": {"label": "Cubic Curve"},
            "quadratic": {"label": "Quadratic Curve"},
            "sine": {"label": "Sine Wave"}
        }

    # Lab Data
    if 'components' not in en_data['lab']:
        en_data['lab']['components'] = {
            "battery": {"name": "Battery", "desc": "Power source"},
            "bulb": {"name": "Bulb", "desc": "Light emitter"},
            "switch": {"name": "Switch", "desc": "Control flow"},
            "wire": {"name": "Wire", "desc": "Conducts electricity"}
        }

    with open(EN_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, indent=2, ensure_ascii=True)
    print("Injected Phase 11 secondary data structures into en.json.")

if __name__ == "__main__":
    update_json_data()
