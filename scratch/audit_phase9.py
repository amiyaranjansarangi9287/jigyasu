import json
import os

EN_JSON_PATH = "apps/hub/src/learnos/i18n/locales/en.json"

TEACH_ME_DATA = {
    "concepts": [
        "gravity",
        "photosynthesis",
        "fractions",
        "magnetism",
        "water-cycle"
    ],
    "questions": {
        "gravity": [
            "Why does the Moon orbit the Earth but an apple falls straight down, just like Aryabhata wondered?",
            "If gravity pulls everything, why don't clouds fall?",
            "If you dropped a rock into a hole through the center of the Earth, where would it go?",
            "How does gravity help keep the oceans in place?"
        ],
        "photosynthesis": [
            "If a Banyan tree eats sunlight and water, where does the heavy wood come from?",
            "Could humans ever learn to photosynthesize like plants?",
            "What happens to the oxygen after the plant breathes it out?",
            "If a plant is kept in the dark, how long can it survive on stored food?"
        ],
        "fractions": [
            "If we share a stuffed paratha, is 1/2 bigger than 1/3?",
            "How can we divide 3 parathas equally among 4 friends?",
            "If you cut a cake into infinite pieces, what is the size of each piece?",
            "Why is dividing by a fraction the same as multiplying by its flipped version?"
        ],
        "magnetism": [
            "If a magnet can pull iron, why can't it pull a gold coin?",
            "How do birds use the Earth's magnetic field to navigate?",
            "What would happen if the Earth lost its magnetic field?",
            "Can you create a magnet using just electricity?"
        ],
        "water-cycle": [
            "Is the water in the Ganges the exact same water the dinosaurs drank?",
            "How does water escape the ocean and float into the sky as a cloud?",
            "Where does the water go when a puddle dries up?",
            "If all the ice on Earth melted, where would the water go?"
        ]
    }
}

TIME_CAPSULE_DATA = {
    "concepts": [
        "Gravity & Spacetime",
        "Photosynthesis & Energy",
        "Fractions & Infinity",
        "Magnetism & Fields",
        "Water Cycle & Climate",
        "States of Matter",
        "Electricity & Circuits",
        "Evolution & Genetics",
        "Probability & Chance",
        "DNA & Life"
    ],
    "durations": [
        {"days": 7, "label": "1 week"},
        {"days": 30, "label": "1 month"},
        {"days": 90, "label": "3 months"},
        {"days": 180, "label": "6 months"},
        {"days": 365, "label": "1 year"}
    ]
}

ABOUT_PAGE_DATA = {
    "values": [
        {
            "title": "Wonder",
            "emoji": "✨",
            "desc": "We begin with questions, not answers. Every concept starts with a mystery, not a definition. We protect the natural curiosity every child is born with."
        },
        {
            "title": "Equity",
            "emoji": "⚖️",
            "desc": "One platform. For everyone. The child in a village in Odisha and the child in an apartment in Bengaluru should see the same beautiful concept, the same simulation, the same joy."
        },
        {
            "title": "Respect",
            "emoji": "🙏",
            "desc": "No grades, no judgment, no shame. Every learner is equal. The 6-year-old discovering colours. The 40-year-old who always wanted to understand gravity. Both are welcome here."
        },
        {
            "title": "Patience",
            "emoji": "🌱",
            "desc": "Learning takes the time it takes. No countdown timers on understanding. No pressure to move faster. The concept waits. Always."
        },
        {
            "title": "Joy",
            "emoji": "🎉",
            "desc": "If learning is not joyful, something is wrong with the design — not with the learner. Science is joyful. Mathematics is joyful. Discovery is joyful."
        },
        {
            "title": "Identity",
            "emoji": "🇮🇳",
            "desc": "Indian scientists, Indian examples, Indian languages, Indian realities. This is not a global platform translated for India. It is built for India, from India."
        }
    ],
    "difference_points": [
        {
            "emoji": "🔓",
            "title": "Free by Design",
            "desc": "There is no 'poor version' and 'rich version' of learning on Jigyasu. Everything is free. Forever. For everyone. This is not a feature. It is a principle."
        },
        {
            "emoji": "🌐",
            "title": "Website First",
            "desc": "A link shared through WhatsApp can reach a child in a village. No installation, no storage pressure, no app store barrier. Just open and learn."
        },
        {
            "emoji": "🗣️",
            "title": "Mother Tongue",
            "desc": "Thinking happens in our mother tongue. All 22 official scheduled Indian languages are fully supported, ensuring language is never a barrier to understanding."
        },
        {
            "emoji": "🛠️",
            "title": "Playful Simulations",
            "desc": "We don't just tell. We let you play. Interactive physics engines, math visualizers, and biology sandboxes turn abstract ideas into toys you can touch."
        }
    ],
    "title": "About Jigyasu",
    "subtitle": "Built for India. Built for Wonder.",
    "values_title": "Our Values",
    "difference_title": "How we are different",
    "cta": "Join the journey"
}

def main():
    print("Reading en.json...")
    with open(EN_JSON_PATH, 'r', encoding='utf-8', errors='surrogatepass') as f:
        data = json.load(f)

    if 'crosscutting' not in data:
        data['crosscutting'] = {}
    if 'data' not in data['crosscutting']:
        data['crosscutting']['data'] = {}

    data['crosscutting']['data']['teach_me_data'] = TEACH_ME_DATA
    data['crosscutting']['data']['time_capsule_data'] = TIME_CAPSULE_DATA
    data['crosscutting']['about_page'] = ABOUT_PAGE_DATA

    print("Writing en.json...")
    with open(EN_JSON_PATH, 'w', encoding='utf-8', errors='surrogatepass') as f:
        json.dump(data, f, indent=2, ensure_ascii=True)
    
    print("Phase 9 data injected successfully.")

if __name__ == '__main__':
    main()
