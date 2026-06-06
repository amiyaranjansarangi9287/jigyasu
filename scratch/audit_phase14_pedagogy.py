import json
import os
import re

EN_JSON_PATH = r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\i18n\locales\en.json"

# Highly specific Wonder-First overrides for a few secondary modules
SPECIFIC_OVERRIDES = {
    "academy:electrolysis": {
        "mystery": {
            "question": "Can we force a chemical reaction to run backwards?",
            "hook": "Normally, batteries produce electricity by letting chemicals react. But what if we pump electricity INTO the chemicals? Let's find out."
        },
        "exploration": {
            "instruction": "Assemble the electrolysis cell. Try different voltages and electrolytes to see what gases are produced.",
            "hints": [
                "What happens at the cathode (negative electrode)?",
                "Try using water as the electrolyte. What bubbles do you see?",
                "Increase the voltage and watch the rate of reaction."
            ]
        },
        "insight": {
            "revelation": "You are literally tearing water molecules apart with electricity!",
            "connection": "By providing energy, we can reverse spontaneous redox reactions."
        },
        "application": {
            "realWorld": "This is how we extract pure aluminum from ore and plate jewelry with gold.",
            "indianContext": "India's massive Green Hydrogen Mission uses this exact process to create clean fuel from solar power and water!",
            "activity": "You can do this at home using a 9V battery, two pencils, and a glass of salt water."
        }
    },
    "math:math-visualizer": {
        "mystery": {
            "question": "What does an equation actually look like in 3D?",
            "hook": "Numbers and symbols on a page can be abstract. Let's step inside the math and see its true shape."
        },
        "exploration": {
            "instruction": "Rotate the 3D grid and change the parameters of the equations to see how the shapes morph.",
            "hints": [
                "Try making the 'a' coefficient negative. What happens to the parabola?",
                "Rotate the view. Does it look the same from all angles?",
                "Add a sine wave to the mix."
            ]
        },
        "insight": {
            "revelation": "Math isn't just symbols; it's the geometry of the universe!",
            "connection": "The equations perfectly describe these beautiful, symmetrical shapes."
        },
        "application": {
            "realWorld": "Engineers use 3D math to design aerodynamic cars, airplanes, and video game graphics.",
            "indianContext": "Ancient Indian mathematicians conceptualized complex 3D geometry centuries ago for architectural marvels like stepwells.",
            "activity": "Look at the shape of a satellite dish or a car headlight. They use these exact parabolic equations to focus signals."
        }
    }
}

def generate_generic_payload(world_id, module_id, title):
    clean_title = title.lower()
    return {
        "mystery": {
            "question": f"What exactly happens when we look closely at {clean_title}?",
            "hook": f"The world of {clean_title} hides fascinating secrets and patterns. Let's uncover them together and see how they shape our universe."
        },
        "exploration": {
            "instruction": f"Use the interactive tools below to experiment with {clean_title}. Change the variables and observe the results.",
            "hints": [
                "Try changing one variable at a time.",
                "Do you notice any repeating patterns?",
                "What happens if you take the simulation to the extreme?"
            ]
        },
        "insight": {
            "revelation": f"You've just uncovered the fundamental principles behind {clean_title}!",
            "connection": "By experimenting safely, you revealed how these forces and concepts interact naturally."
        },
        "application": {
            "realWorld": "These rules govern everything from microscopic systems to massive structures around us.",
            "indianContext": f"In India, engineers, doctors, and scientists use the principles of {clean_title} every day to solve local challenges and build the future.",
            "activity": "Next time you are outside or looking around your home, see if you can spot these principles in action!"
        }
    }

def process_file(filepath, world_id, en_json):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find: withWonderFirst(..., 'world', 'module_id')
    # Because we added these in index.tsx / MathApp.tsx
    pattern = rf"withWonderFirst\([^,]+,\s*'{world_id}',\s*'([^']+)'\)"
    matches = re.findall(pattern, content)
    
    updated_count = 0
    for module_id in matches:
        key = f"{world_id}:{module_id}"
        
        title_key = f"worlds.{world_id}.modules.{module_id}.title"
        title = en_json.get(title_key)
        if not title:
            try:
                title = en_json.get("worlds", {}).get(world_id, {}).get("modules", {}).get(module_id, {}).get("title")
            except AttributeError:
                pass

        if not title:
            title = module_id.replace("-", " ").title()

        payload = SPECIFIC_OVERRIDES.get(key)
        if not payload:
            payload = generate_generic_payload(world_id, module_id, title)

        prefix = f"worlds.{world_id}.modules.{module_id}.wonder"
        
        en_json[f"{prefix}.mystery.question"] = payload["mystery"]["question"]
        en_json[f"{prefix}.mystery.hook"] = payload["mystery"]["hook"]
        
        en_json[f"{prefix}.exploration.instruction"] = payload["exploration"]["instruction"]
        for i, hint in enumerate(payload["exploration"]["hints"]):
            en_json[f"{prefix}.exploration.hints.{i}"] = hint
            
        en_json[f"{prefix}.insight.revelation"] = payload["insight"]["revelation"]
        en_json[f"{prefix}.insight.connection"] = payload["insight"]["connection"]
        en_json[f"{prefix}.insight.ahaMoment"] = f"Ah! So that is how {title} works!"
        
        en_json[f"{prefix}.application.realWorld"] = payload["application"]["realWorld"]
        en_json[f"{prefix}.application.indianContext"] = payload["application"]["indianContext"]
        en_json[f"{prefix}.application.activity"] = payload["application"]["activity"]
        
        updated_count += 1
        
    return updated_count

def main():
    with open(EN_JSON_PATH, "r", encoding="utf-8") as f:
        en_json = json.load(f)
        
    targets = [
        (r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\math\components\MathApp.tsx", "math"),
        (r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\academy\index.tsx", "academy"),
        (r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\explorer\index.tsx", "explorer"),
        (r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\discovery\index.tsx", "discovery"),
        (r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\early\index.tsx", "early"),
        (r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\worlds\tiny\index.tsx", "tiny")
    ]
    
    total = 0
    for filepath, world_id in targets:
        count = process_file(filepath, world_id, en_json)
        total += count
        print(f"Processed {count} modules in {world_id}")

    with open(EN_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(en_json, f, indent=2)

    print(f"Total modules processed for Phase 14: {total}")

if __name__ == "__main__":
    main()
