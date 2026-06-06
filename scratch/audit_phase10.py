import json
import os

EN_JSON_PATH = "apps/hub/src/learnos/i18n/locales/en.json"

ACADEMY_DATA = {
    "beautyMoments": {
        "trigonometry-circle": "The same circle that tracks the stars, tracks the pendulum.",
        "projectile-motion": "The parabola describes both the thrown ball and the satellite orbit.",
        "wave-interference": "Two sounds can add up to silence.",
        "derivatives-visual": "Slicing time so thin that motion stops, yet tells us everything about speed.",
        "redox-reactions": "Rust and respiration are the exact same theft of electrons.",
        "dna-synthesis": "A four-letter alphabet that writes every living thing on Earth.",
        "electrolysis": "Using lightning to split water back into the air it came from.",
        "natural-selection": "The environment carves the shape of the survivor.",
        "essay-architect": "A structured argument is as beautiful and rigid as a bridge.",
        "economic-indicators": "A country's health, hidden in the price of onions and milk.",
        "trig-identities": "An equation that dances through symmetries, always balancing to 1.",
        "climate-systems": "The monsoon is a giant heat engine powered by the sun."
    },
    "electrolysisSetups": {
        "water": {
            "name": "Water Splitting",
            "electrolyte": "Dilute H2SO4",
            "cathodeProduct": "Hydrogen Gas (H2)",
            "anodeProduct": "Oxygen Gas (O2)",
            "industrialUse": "Clean fuel production",
            "indianContext": "Green Hydrogen missions across India aim to use solar power for this."
        },
        "copper": {
            "name": "Copper Refining",
            "electrolyte": "Copper Sulphate (CuSO4)",
            "cathodeProduct": "Pure Copper",
            "industrialUse": "Electrical wiring",
            "indianContext": "Essential for India's massive rural electrification projects."
        },
        "brine": {
            "name": "Brine Electrolysis",
            "electrolyte": "Salt Water (NaCl)",
            "anodeProduct": "Chlorine Gas (Cl2)",
            "industrialUse": "Water purification",
            "indianContext": "Crucial for providing safe drinking water in Indian municipalities."
        }
    },
    "environments": {
        "arctic": {
            "name": "Snowy peaks",
            "indian": "Like the upper reaches of the Himalayas where the snow leopard hunts."
        },
        "forest": {
            "name": "Dense Jungle",
            "indian": "Like the Western Ghats, dark and full of shadows."
        },
        "grassland": {
            "name": "Dry Grassland",
            "indian": "Like the Rann of Kutch or the Deccan plateau."
        }
    },
    "essayPrompts": {
        "tech": {
            "title": "Technology & Society",
            "prompt": "Evaluate the impact of digital connectivity on rural education.",
            "examinerTip": "Look for arguments that balance access with the digital divide."
        },
        "india": {
            "title": "Demographic Dividend",
            "prompt": "Analyze India's demographic dividend: opportunity or challenge?",
            "examinerTip": "Ensure you define the term and provide both economic and social perspectives."
        },
        "ai": {
            "title": "Artificial Intelligence",
            "prompt": "Discuss the ethical implications of AI in healthcare diagnosis.",
            "examinerTip": "A strong essay will weigh patient outcomes against data privacy."
        }
    },
    "indicators": {
        "gdp": { "name": "GDP Growth" },
        "inflation": { "name": "Inflation (CPI)" },
        "unemployment": { "name": "Unemployment" },
        "repo": { "name": "Repo Rate (RBI)" }
    },
    "policyDecisions": {
        "rate-hike": {
            "name": "RBI Raises Repo Rate",
            "note": "Loans become expensive. Inflation drops, but growth slows down."
        },
        "infra": {
            "name": "Massive Highway Budget",
            "note": "Jobs created and trade speeds up. Growth jumps, but inflation might creep up."
        },
        "tax-cut": {
            "name": "Income Tax Cut",
            "note": "People have more money to spend. Boosts GDP slightly, increases inflation."
        }
    },
    "trigIdentities": {
        "pythagorean": { "name": "Pythagorean Identity" },
        "tangent": { "name": "Tangent Identity" },
        "double-sin": { "name": "Double Angle (Sin)" }
    },
    "feedbackLoops": {
        "ice": {
            "name": "Ice-Albedo Feedback",
            "india": "As Himalayan glaciers melt, dark rock absorbs more heat, melting more ice. A dangerous loop."
        },
        "vapour": {
            "name": "Water Vapour Feedback",
            "india": "Warmer Indian Ocean means more evaporation. Water vapour traps heat, making the ocean even warmer."
        },
        "cloud": {
            "name": "Cloud Albedo Feedback",
            "india": "More heat means more low clouds over the Arabian sea. These clouds reflect sunlight, cooling the surface down."
        }
    }
}

# Need to update missing modules too? Wait, let's just update all of discovery, explorer, lab, etc.
DISCOVERY_DATA = {
    "modules": {
        "algebra-scales": {
            "title": "The Equation Balancer",
            "hook": "If you add a mango to one side, what must you do to the other to keep it balanced?",
            "realWorldConnection": "Traders in ancient Indian bazaars used physical scales; algebra is just a scale in your mind.",
            "unsolvedQuestion": "Can every problem be perfectly balanced?"
        },
        "cell-city": {
            "title": "The Cell City",
            "hook": "Inside you are trillions of tiny cities. How do they know what to do without a mayor?",
            "realWorldConnection": "Like the complex logistics of Mumbai, a cell moves resources exactly where they are needed.",
            "unsolvedQuestion": "How did the first 'city' organize itself from just chemicals?"
        },
        "chemical-balancer": {
            "title": "The Chemistry Kitchen",
            "hook": "Matter cannot be destroyed. So where does the wood go when the campfire burns to ash?",
            "realWorldConnection": "Cooking dal involves complex chemical reactions where ingredients change form but not mass.",
            "unsolvedQuestion": "If we can rearrange atoms, can we turn lead into gold?"
        },
        "geometry-proof": {
            "title": "The Proof Builder",
            "hook": "How can you be absolutely, 100% sure that a triangle's angles always add up to a straight line?",
            "realWorldConnection": "The precise geometry of the Jantar Mantar observatory relies on these unbreakable rules.",
            "unsolvedQuestion": "Is math invented by humans, or discovered in the universe?"
        },
        "speed-distance-time": {
            "title": "The Motion Tracker",
            "hook": "If you are sitting on a moving train, are you moving or are you still?",
            "realWorldConnection": "Calculating the exact time the Vande Bharat express will arrive requires understanding these three locked variables.",
            "unsolvedQuestion": "If you travel at the speed of light, does time stop?"
        },
        "genetics-simulator": {
            "title": "The Trait Mixer",
            "hook": "Why do you have your grandfather's nose but your mother's eyes?",
            "realWorldConnection": "Farmers have been mixing traits in crops for thousands of years to make sweeter mangoes and stronger wheat.",
            "unsolvedQuestion": "Can we rewrite the code of life to cure any disease?"
        },
        "carbon-cycle": {
            "title": "The Carbon Journey",
            "hook": "The carbon atom in your fingernail might have once been inside a T-Rex. How?",
            "realWorldConnection": "The smoke from a brick kiln in Punjab becomes the tree in Kerala.",
            "unsolvedQuestion": "How much carbon can the Earth's oceans swallow before they change completely?"
        }
    }
}

EXPLORER_DATA = {
    "modules": {
        "ecosystem-web": {
            "title": "The Web of Life",
            "description": "If one spider vanishes, does the forest notice? Follow the invisible threads connecting predators to prey.",
            "wonderHook": "Every living thing in the Sundarbans is connected by an invisible thread. Pull one, and watch what happens to the others."
        },
        "gravity-architect": {
            "title": "Gravity Architect",
            "description": "Build solar systems and watch them dance or crash. What keeps the planets from falling into the sun?",
            "wonderHook": "Why doesn't the moon fall down? Or... is it falling right now, but missing the Earth?"
        },
        "fraction-pizza": {
            "title": "The Paratha Problem",
            "description": "Slice and share infinite parathas. Is half of a half the same as a quarter?",
            "wonderHook": "If you keep cutting a paratha in half forever, will you ever reach zero?"
        },
        "magnet-lab": {
            "title": "Invisible Forces",
            "description": "Play with invisible fields that push and pull. Why does iron care about magnets, but plastic doesn't?",
            "wonderHook": "A magnet can pull a piece of iron without touching it. What is reaching across the empty space?"
        },
        "states-of-matter": {
            "title": "The Shape of Water",
            "description": "Heat ice until it vanishes. It didn't disappear, it just learned to fly.",
            "wonderHook": "Ice, water, and steam are the exact same thing. How does heat change the rules of how they behave?"
        }
    },
    "archetypes": {
        "tinkerer": {
            "name": "The Tinkerer",
            "description": "You learn by breaking things to see how they work."
        },
        "observer": {
            "name": "The Observer",
            "description": "You watch quietly until the pattern reveals itself."
        },
        "theorist": {
            "name": "The Theorist",
            "description": "You ask 'what if' before you touch anything."
        }
    }
}

LAB_DATA = {
    "modules": {
        "circuit-builder": {
            "title": "The Circuit Board",
            "realWorldConnection": "How the switch on your wall turns on the fan.",
            "toyboxProject": "Build a simple flashlight"
        },
        "fraction-kitchen": {
            "title": "The Math Kitchen",
            "realWorldConnection": "Scaling up a recipe for chai when guests arrive."
        },
        "ecosystem-balance": {
            "title": "The Pond Ecosystem",
            "realWorldConnection": "Why frogs matter to the mosquitoes in your neighborhood."
        },
        "forces-motion": {
            "title": "Push and Pull",
            "realWorldConnection": "Why a heavy cricket ball goes further than a tennis ball when hit with the same force."
        },
        "chemical-reactions": {
            "title": "The Reaction Chamber",
            "realWorldConnection": "Why iron rusts in the monsoon but not in the summer."
        },
        "wave-lab": {
            "title": "The Sound Studio",
            "realWorldConnection": "How the string of a sitar makes a note."
        },
        "data-detective": {
            "title": "Data Detective",
            "realWorldConnection": "Predicting the monsoon using rainfall data."
        },
        "history-timeline": {
            "title": "The Time Machine",
            "realWorldConnection": "How the Indus Valley civilization connects to modern India."
        },
        "code-logic": {
            "title": "Logic Gates",
            "realWorldConnection": "The invisible rules inside your smartphone."
        },
        "simple-machines": {
            "title": "The Mechanic's Shop",
            "realWorldConnection": "How a simple pulley lifts water from a village well."
        },
        "weather-station": {
            "title": "The Weather Station",
            "realWorldConnection": "Why the Western Ghats get so much rain."
        },
        "human-body": {
            "title": "Inside You",
            "realWorldConnection": "What happens to the roti you just ate."
        },
        "buoyancy-lab": {
            "title": "The Floating Lab",
            "realWorldConnection": "Why a heavy steel ship floats but a tiny pebble sinks."
        },
        "concept-bridge": {
            "title": "The Bridge Builder",
            "realWorldConnection": "How math and physics hold up the Howrah Bridge."
        }
    }
}

EARLY_DATA_UPDATE = {
    "modules": {
        "pip": "Pip the Explorer",
        "plant": "Grow a Seed",
        "water_cycle": "Make it Rain",
        "habitats": "Where Do I Live?",
        "shadow": "Shadow Play",
        "magnet": "Sticky Magnets",
        "shop": "The Market Shop",
        "adventure_map": "The Big Map",
        "story_builder": "Story Builder",
        "number_line": "Number Line",
        "alphabet_forest": "Alphabet Forest",
        "mini_chef": "Mini Chef",
        "pattern_patrol": "Pattern Patrol",
        "word_scramble": "Word Scramble",
        "plant_growth": "Plant Growth",
        "habitat_heroes": "Habitat Heroes",
        "shadow_detective": "Shadow Detective",
        "magnet_explorer": "Magnet Explorer",
        "coin_counter": "Coin Counter"
    }
}

TINY_DATA_UPDATE = {
    "modules": {
        "animal-orchestra": "Animal Orchestra",
        "bubble-world": "Bubble World",
        "color-mixer": "Color Mixer",
        "day-and-night": "Day and Night",
        "farm-friends": "Farm Friends",
        "shape-sorter": "Shape Sorter",
        "tap-world": "Tap World",
        "weather-maker": "Weather Maker"
    }
}

def main():
    with open(EN_JSON_PATH, 'r', encoding='utf-8', errors='surrogatepass') as f:
        data = json.load(f)

    # Inject Academy
    if 'academy' not in data:
        data['academy'] = {}
    data['academy'].update(ACADEMY_DATA)

    # Inject Discovery
    if 'discovery' not in data:
        data['discovery'] = {}
    data['discovery'].update(DISCOVERY_DATA)

    # Inject Explorer
    if 'explorer' not in data:
        data['explorer'] = {}
    data['explorer'].update(EXPLORER_DATA)

    # Inject Lab
    if 'lab' not in data:
        data['lab'] = {}
    if 'modules' not in data['lab']:
        data['lab']['modules'] = {}
    data['lab']['modules'].update(LAB_DATA['modules'])

    # Inject Early
    if 'early' not in data:
        data['early'] = {}
    if 'modules' not in data['early']:
        data['early']['modules'] = {}
    data['early']['modules'].update(EARLY_DATA_UPDATE['modules'])

    # Inject Tiny
    if 'tiny' not in data:
        data['tiny'] = {}
    if 'modules' not in data['tiny']:
        data['tiny']['modules'] = {}
    data['tiny']['modules'].update(TINY_DATA_UPDATE['modules'])

    with open(EN_JSON_PATH, 'w', encoding='utf-8', errors='surrogatepass') as f:
        json.dump(data, f, indent=2, ensure_ascii=True)
    
    print("Phase 10 data injected successfully.")

if __name__ == '__main__':
    main()
