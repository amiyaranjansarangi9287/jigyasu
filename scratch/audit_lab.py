import json
import os

locales_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales'
with open(os.path.join(locales_dir, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Rewrites for Lab modules (Wonder-first + Indian Context)
wonder_rewrites = {
    "circuit-builder": "Ever wondered how Diwali lights twinkle or fans spin? It's all about making the perfect loop of energy!",
    "fraction-kitchen": "Imagine trying to split a single delicious Dosa equally among 3 hungry siblings—chefs use these exact tricks!",
    "ecosystem-sandbox": "How does a single missing insect affect a whole forest? Discover the delicate balance hidden in Indian tiger reserves.",
    "force-lab": "Why does a cricket ball slow down on the pitch? Uncover the invisible forces of friction and momentum at play!",
    "weather-station": "How do we know when the Monsoons will arrive? Meteorologists track these invisible clues in the sky.",
    "timeline-explorer": "Have you ever wondered how we know what dinosaurs ate, or when the first humans lived? Timeline explorers unlock secrets of the past!",
    "code-story": "If you can give someone step-by-step instructions to make chai, you already know how to write computer code!",
    "multiplication-lab": "How do architects design the massive patterns of the Taj Mahal? They multiply blocks and arrays!",
    "buoyancy-lab": "Why does a tiny pebble sink, but a massive steel ship floats effortlessly? It's not magic, it's displacement!",
    "lever-explorer": "How did ancient builders lift stones weighing thousands of kilos to build temples? They used the superpower of levers!",
    "statistics-playground": "How does a cricket team decide their batting order? They use data, averages, and statistics to predict the future!",
    "human-body": "Your body is a bustling city with trillions of tiny workers! Discover how they all communicate to keep you alive.",
    "panchabhutas": "Ancient Indian thinkers believed everything in the universe is made of just 5 elements! Let's see how this ancient theory connects to modern chemistry.",
    "states-of-matter": "Why does a hard ice cube vanish into thin air? Watch molecules dance as they change states right before your eyes!",
    "gravity": "If you throw a ball, why doesn't it just keep going up forever? Uncover the invisible pulling force that keeps our feet on the ground.",
    "water-cycle": "Every drop of water you drink today might have been inside a dinosaur millions of years ago! Follow the epic journey of a raindrop.",
    "photosynthesis": "Did you know that trees literally eat sunlight and breathe out the oxygen we need? Discover their secret recipe!",
    "digestive-system": "What happens after you swallow a bite of your favorite curry? Journey through the ultimate food processing factory!",
    "solar-system": "Earth is just one tiny spaceship orbiting a massive star. Explore the cosmic neighborhood we call home!",
    "blood-circulation": "Your heart beats 100,000 times a day to pump a river of life through your body. Let's trace its path!",
    "cell-explorer": "Zoom in a million times! Every living thing is made of microscopic factories called cells. Take a peek inside.",
    "newtons-laws": "Why do you lurch forward when a bus suddenly stops? Newton's invisible laws govern every movement in the universe!",
    "magnets": "How does a compass always know which way is North? Discover the invisible fields that pull magnets together.",
    "electricity": "From the lightning in the sky to the spark of a plug, what is electricity and how does it power our world?",
    "light-shadows": "How do shadows stretch and bend? Prove that light travels in straight lines by bending it to your will!",
    "sound-waves": "When a tabla plays, how does the beat reach your ears? See the invisible waves of vibration traveling through the air.",
    "float-sink": "If wood is heavy, why does it float? Dive into the mysteries of density and discover why some things sink and others soar.",
    "plant-growth": "How does a tiny mustard seed transform into a towering plant? Witness the miraculous stages of life unfolding.",
    "day-night": "Why does the sun disappear every evening? It's not the sun moving, it's our entire planet spinning through space!",
    "moon-phases": "Why does the moon change its shape every night, from a thin crescent to a glowing sphere? Unlock the secrets of its orbit.",
    "atoms": "If you cut a grain of sand into a million pieces, what's left? Discover the tiny building blocks of the entire universe.",
    "simple-machines": "How can a simple ramp make lifting a heavy load feel as light as a feather? Unlock the physics of tools."
}

# Apply rewrites
for m_id, m_data in en_data['lab']['modules'].items():
    if m_id in wonder_rewrites:
        m_data['realWorldConnection'] = wonder_rewrites[m_id]

# Save EN
with open(os.path.join(locales_dir, 'en.json'), 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
    
print("Phase 1: Lab World Audit Complete.")
