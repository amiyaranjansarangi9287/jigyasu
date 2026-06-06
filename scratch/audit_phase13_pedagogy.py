import json
import os
import re

# Paths
EN_JSON_PATH = r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\i18n\locales\en.json"

# Highly specific Wonder-First overrides
SPECIFIC_OVERRIDES = {
    "biology:cell-map": {
        "mystery": {
            "question": "What runs the microscopic city inside your body?",
            "hook": "Every single cell in your body is like a bustling metropolis, complete with power plants, post offices, and recycling centers. Let's zoom in a million times and see how it works!"
        },
        "exploration": {
            "instruction": "Navigate through the Cell City. Tap on the different organelles to discover their jobs.",
            "hints": [
                "Find the 'Power Plant' of the cell. What is it called?",
                "Which organelle acts like a post office, packaging proteins?",
                "Compare a plant cell to an animal cell. What's the biggest difference?"
            ]
        },
        "insight": {
            "revelation": "You've discovered the hidden machinery of life: Organelles!",
            "connection": "Just like a city needs different workers to survive, your cells rely on these tiny structures to keep you alive, breathing, and moving."
        },
        "application": {
            "realWorld": "Without mitochondria producing energy, you wouldn't even be able to blink.",
            "indianContext": "Think of the Golgi Apparatus like the massive Dabbawala network in Mumbai—sorting and delivering packages (proteins) exactly where they need to go with incredible precision!",
            "activity": "Next time you eat an apple, remember you are consuming millions of tiny plant cell walls."
        }
    },
    "physics:black-hole": {
        "mystery": {
            "question": "What happens when gravity becomes so strong that not even light can escape?",
            "hook": "Somewhere in the universe, massive stars collapse into infinitely dense points. These invisible giants shape galaxies. Let's safely approach the event horizon."
        },
        "exploration": {
            "instruction": "Adjust the mass of the black hole and observe how it warps the spacetime grid around it.",
            "hints": [
                "What happens to the fabric of spacetime as mass increases?",
                "Try sending a light beam past the event horizon. What occurs?",
                "Watch the time dilation meter as you get closer to the center."
            ]
        },
        "insight": {
            "revelation": "You've witnessed Spacetime Curvature and the Event Horizon!",
            "connection": "Mass tells spacetime how to curve, and spacetime tells mass how to move. A black hole is just an extreme valley in this fabric."
        },
        "application": {
            "realWorld": "Astronomers use these exact mathematical models to photograph black holes like Sagittarius A* at the center of our Milky Way.",
            "indianContext": "Indian astrophysicist Subrahmanyan Chandrasekhar calculated the exact mass limit (Chandrasekhar Limit) that determines if a star will eventually collapse into a black hole. He won the Nobel Prize for this!",
            "activity": "Place a heavy ball on a stretched bedsheet and roll a marble past it to see gravity wells in action at home."
        }
    },
    "physics:planetary-motion": {
        "mystery": {
            "question": "Why don't planets just fly off into deep space or crash into the Sun?",
            "hook": "The solar system is a delicate dance of gravity and velocity. A perfect balance keeps Earth in its orbit, allowing life to thrive."
        },
        "exploration": {
            "instruction": "Create your own solar system. Adjust the speed and mass of planets to achieve stable orbits.",
            "hints": [
                "What happens if a planet moves too fast?",
                "What happens if a planet moves too slow?",
                "Try placing two massive planets close to each other. Do their orbits remain stable?"
            ]
        },
        "insight": {
            "revelation": "You've mastered Orbital Mechanics and Kepler's Laws!",
            "connection": "Orbiting is essentially falling continuously towards a massive object, but moving sideways fast enough to keep missing it."
        },
        "application": {
            "realWorld": "Satellites, the ISS, and the Moon all follow these exact same rules to stay in orbit.",
            "indianContext": "ISRO scientists used these precise orbital mechanics to successfully send the Mangalyaan spacecraft to Mars on a shoestring budget using gravity assists!",
            "activity": "Tie a small object to a string and spin it around. The string is gravity, and your hand is the sun!"
        }
    },
    "lab:day-night": {
        "mystery": {
            "question": "Where does the sun go at night?",
            "hook": "Every morning the sun rises, and every evening it sets. But is the sun really moving, or are we?"
        },
        "exploration": {
            "instruction": "Drag the slider to rotate the Earth and watch how the sunlight hits different continents.",
            "hints": [
                "When it's day in India, what is happening in America?",
                "Locate the axis of rotation. Is it perfectly straight?",
                "How long does one full rotation take in the simulation?"
            ]
        },
        "insight": {
            "revelation": "You discovered Earth's Rotation!",
            "connection": "The sun stands still. It is the Earth spinning like a top that creates the illusion of a rising and setting sun."
        },
        "application": {
            "realWorld": "This rotation is why we have 24-hour days and different time zones across the globe.",
            "indianContext": "Ancient Indian astronomer Aryabhata wrote in the 5th century that the earth rotates on its axis, centuries before it was accepted globally!",
            "activity": "Shine a flashlight on a spinning globe or ball in a dark room to see day and night in action."
        }
    }
}

def generate_generic_payload(world_id, module_id, title):
    # Generates a highly contextual template using the title
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

def process_dynamic_routes():
    # Read DynamicRoutes.tsx to find all modules
    routes_path = r"D:\vision_agentic\jigyasu\apps\hub\src\learnos\core\modules\DynamicRoutes.tsx"
    with open(routes_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find: 'world:module': () => import(...)
    pattern = r"'([a-z]+):([a-z0-9\-]+)':\s*\(\)\s*=>"
    matches = re.findall(pattern, content)

    print(f"Found {len(matches)} modules in DynamicRoutes.")

    with open(EN_JSON_PATH, "r", encoding="utf-8") as f:
        en_json = json.load(f)

    updated_count = 0

    for world_id, module_id in matches:
        if module_id.endswith("-wonder") or world_id == "math":
            continue

        key = f"{world_id}:{module_id}"
        
        title_key = f"worlds.{world_id}.modules.{module_id}.title"
        title = en_json.get(title_key)
        if not title:
            # Maybe it's nested
            try:
                title = en_json.get("worlds", {}).get(world_id, {}).get("modules", {}).get(module_id, {}).get("title")
            except AttributeError:
                pass

        if not title:
            title = module_id.replace("-", " ").title()

        payload = SPECIFIC_OVERRIDES.get(key)
        if not payload:
            payload = generate_generic_payload(world_id, module_id, title)

        # Inject wonder payload using flattened keys so we don't conflict with existing string vs dict structure
        prefix = f"worlds.{world_id}.modules.{module_id}.wonder"
        
        en_json[f"{prefix}.mystery.question"] = payload["mystery"]["question"]
        en_json[f"{prefix}.mystery.hook"] = payload["mystery"]["hook"]
        
        en_json[f"{prefix}.exploration.instruction"] = payload["exploration"]["instruction"]
        for i, hint in enumerate(payload["exploration"]["hints"]):
            en_json[f"{prefix}.exploration.hints.{i}"] = hint
            
        en_json[f"{prefix}.insight.revelation"] = payload["insight"]["revelation"]
        en_json[f"{prefix}.insight.connection"] = payload["insight"]["connection"]
        
        en_json[f"{prefix}.application.realWorld"] = payload["application"]["realWorld"]
        en_json[f"{prefix}.application.indianContext"] = payload["application"]["indianContext"]
        en_json[f"{prefix}.application.activity"] = payload["application"]["activity"]
        
        updated_count += 1

    with open(EN_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(en_json, f, indent=2)

    print(f"Successfully generated and injected Wonder-First pedagogy for {updated_count} modules into en.json.")

if __name__ == "__main__":
    process_dynamic_routes()
