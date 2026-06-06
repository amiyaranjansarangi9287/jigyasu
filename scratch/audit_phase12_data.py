import os
import json

EN_JSON_PATH = "apps/hub/src/learnos/i18n/locales/en.json"

def update_json_data():
    with open(EN_JSON_PATH, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    if 'core' not in en_data:
        en_data['core'] = {}

    en_data['core']['pedagogy'] = {
        "but_why": {
            "title": "But WHY does this happen?",
            "badge": "But WHY?",
            "aria": "But Why?"
        },
        "hints": {
            "free": "Free Hint",
            "cost": "Hint (-5 XP)",
            "show_answer": "Show Answer",
            "title_free": "Hint 1: Free",
            "title_cost": "Hint 2: Costs 5 XP",
            "title_answer": "Hint 3: Show Answer",
            "fallback": "Try one small example from the lesson, then explain what changed in your own words."
        },
        "feedback": {
            "why_btn": "Why? 🤔",
            "explanation": "Explanation"
        }
    }

    en_data['core']['wonder_template'] = {
        "announcements": {
            "mystery": "Mystery phase: Starting with a question",
            "exploration": "Exploration phase: Time to investigate and discover",
            "insight": "Insight phase: The moment of understanding",
            "application": "Application phase: Connecting to real life"
        },
        "shortcuts": {
            "label": "Keyboard shortcuts:",
            "keys": "N: Next | H: Hint | S: Skip | ESC: Exit"
        },
        "mystery": {
            "what_do_you_think": "What do you think?",
            "take_a_moment": "Take a moment to wonder. Don't worry about the right answer. Just let your curiosity guide you.",
            "btn_explore": "Let's Explore Together",
            "btn_aria": "Start exploring the mystery"
        },
        "exploration": {
            "title": "Exploration Time",
            "time": "Time exploring:",
            "need_hint": "Need a hint?",
            "hints_guide": "Hints are here to guide you, not judge you. Take your time.",
            "hint_prefix": "Hint",
            "btn_insight": "I Think I Understand",
            "btn_aria": "Show insight and explanation"
        },
        "insight": {
            "title": "The Insight",
            "happening": "Here's what's happening:",
            "connection": "Connection to the mystery:",
            "btn_apply": "See How This Applies",
            "btn_aria": "See how this concept applies in real life"
        },
        "application": {
            "title": "In Real Life",
            "subtitle": "Understanding connects to the world around you",
            "real_world": "Real World:",
            "indian_context": "Indian Context:",
            "try_it": "Try It:",
            "btn_complete": "I Understand!",
            "btn_aria": "Complete module and return to home"
        }
    }

    # Math module registry titles/descriptions
    en_data['core']['modules'] = {
        "math": {
            "math-adventure": {"title": "Adventure Map", "description": "Explore math zones"},
            "math-visualizer": {"title": "3D Visualizer", "description": "See math in 3D"},
            "number-crunch": {"title": "Number Crunch", "description": "Race the clock game"},
            "pattern-hub": {"title": "Pattern Hub", "description": "Find patterns"},
            "skills-academy": {"title": "Skills Academy", "description": "Build foundations"},
            "advanced-hub": {"title": "Advanced Hub", "description": "Higher level math"},
            "math-daily": {"title": "Daily Challenge", "description": "Daily math puzzle"},
            "explorers-hub": {"title": "Explorers Hub", "description": "Visual topics"},
            "worksheet-gen": {"title": "Worksheet Generator", "description": "Print practice sheets"}
        },
        "biology": {
            "bio-adventure": {"title": "Life Safari", "description": "Explore ecosystems"},
            "cell-explorer": {"title": "Cell Explorer", "description": "Dive into cells"},
            "body-systems": {"title": "Body Systems", "description": "Human anatomy"},
            "genetics-lab": {"title": "Genetics Lab", "description": "DNA and inheritance"},
            "evolution-tree": {"title": "Tree of Life", "description": "Evolutionary history"},
            "bio-daily": {"title": "Daily Nature", "description": "Daily bio challenge"},
            "disease-detective": {"title": "Outbreak", "description": "Epidemiology simulator"},
            "ecosystem-builder": {"title": "Eco Builder", "description": "Create habitats"}
        },
        "physics": {
            "physics-adventure": {"title": "Physics Sandbox", "description": "Play with forces"},
            "mechanics-lab": {"title": "Mechanics Lab", "description": "Motion and energy"},
            "waves-optics": {"title": "Light & Sound", "description": "Waves and optics"},
            "astro-explorer": {"title": "Cosmos Explorer", "description": "Space and gravity"},
            "quantum-realm": {"title": "Quantum Realm", "description": "Subatomic physics"},
            "physics-daily": {"title": "Daily Experiment", "description": "Daily physics puzzle"},
            "circuit-builder": {"title": "Circuit Builder", "description": "Electronics simulator"}
        },
        "lab": {
            "lab-adventure": {"title": "Science Lab", "description": "Virtual experiments"},
            "chemistry-lab": {"title": "Chemistry Lab", "description": "Mix reactions"},
            "biology-lab": {"title": "Microscope", "description": "View specimens"},
            "physics-lab": {"title": "Physics Bench", "description": "Test mechanics"},
            "data-analyzer": {"title": "Data Analyzer", "description": "Graph results"}
        }
    }

    with open(EN_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, indent=2, ensure_ascii=True)
    print("Injected Phase 12 core namespace into en.json.")

if __name__ == "__main__":
    update_json_data()
