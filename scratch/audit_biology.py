import json
import os

locales_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales'
with open(os.path.join(locales_dir, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Biology Rewrites (Decoupling + Wonder-first)
biology_rewrites = {
    "cell-map": {"title": "Cell Explorer", "desc": "Dive inside a microscopic metropolis to command the organelles that power life itself."},
    "dna-visualizer": {"title": "DNA Visualizer", "desc": "Unzip the secret genetic code that acts as the blueprint for every living creature."},
    "mitosis": {"title": "Mitosis", "desc": "Watch the incredible magic of one cell perfectly duplicating its entire existence."},
    "meiosis": {"title": "Meiosis", "desc": "Mix and match chromosomes to see how nature creates infinite genetic variety."},
    "respiration": {"title": "Cell Respiration", "desc": "Follow the energetic spark as food is magically burned into raw cellular power."},
    "photosynthesis": {"title": "Photosynthesis", "desc": "Command the chloroplasts to trap sunlight and weave it into solid sugar."},
    "punnett-square": {"title": "Punnett Square", "desc": "Predict the future! See what traits babies will inherit from their parents."},
    "crispr": {"title": "CRISPR Editor", "desc": "Use molecular scissors to slice DNA and rewrite the actual code of life!"},
    "evolution-tree": {"title": "Evolution Tree", "desc": "Trace the grand, interconnected family tree of every creature on Earth."},
    "brain": {"title": "Brain Explorer", "desc": "Navigate the most complex supercomputer in the universe: the human mind."},
    "heart": {"title": "Heart & Blood", "desc": "Ride a red blood cell through the pumping, pulsing highways of the body."},
    "digestive": {"title": "Digestive Journey", "desc": "Shrink down and surf a piece of food through the twisting digestive maze."},
    "immune-defense": {"title": "Immune Defense", "desc": "Command your white blood cells in an epic battle against invading viruses!"},
    "body-quiz": {"title": "Body Quiz", "desc": "Prove your medical mastery by identifying every system in the human machine."},
    "molecule-3d": {"title": "3D Molecules", "desc": "Grab, rotate, and inspect the tiny chemical building blocks of reality."},
    "microscope": {"title": "Microscope", "desc": "Zoom in 1000x to discover the hidden alien landscapes living right under your nose."},
    "enzyme-lab": {"title": "Enzyme Lab", "desc": "Tweak temperature and pH to make protein machines work at hyper-speed."},
    "plant-anatomy": {"title": "Plant Anatomy", "desc": "Dissect leaves and stems to find out how plants drink water without mouths."},
    "ecosystem": {"title": "Ecosystem", "desc": "Balance predators, prey, and weather to build a thriving natural world."},
    "biomes": {"title": "Biomes", "desc": "Travel from freezing tundras to scorching deserts to see how animals survive."},
    "carbon-cycle": {"title": "Carbon Cycle", "desc": "Track invisible carbon atoms as they flow from the air into trees and oceans."},
    "water-cycle": {"title": "Water Cycle", "desc": "Control the sun and clouds to summon mighty rainstorms and flowing rivers."},
    "climate": {"title": "Climate Sim", "desc": "Take control of the Earth's thermostat and see the dramatic future of our planet."},
    "food-chain": {"title": "Food Chain", "desc": "Eat or be eaten! Survive the wild by learning who is at the top of the menu."},
    "metamorphosis": {"title": "Metamorphosis", "desc": "Witness the bizarre, beautiful alien transformation of insects and frogs."},
    "microbe-match": {"title": "Microbe Match", "desc": "Can you identify the tiny microscopic bugs that make us sick... or keep us healthy?"}
}

for m_id, content in biology_rewrites.items():
    en_data[f"biology.modules.{m_id}.title"] = content["title"]
    en_data[f"biology.modules.{m_id}.desc"] = content["desc"]

# Save EN
with open(os.path.join(locales_dir, 'en.json'), 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
    
print("Phase 6.1: Biology Decoupling & Culturization Complete.")
