import json
import os

locales_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales'
with open(os.path.join(locales_dir, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Rewrites for Explorer modules (Narrative hooks)
explorer_rewrites = {
    "gravity-orbits": {
        "hook": "Space Commander! We've lost control of our orbital stations. Only you can restore the delicate balance of gravity before they crash!",
        "wonder": "Did you know that you are pulling on the Earth right now? Every object in the universe is playing a giant, invisible game of tug-of-war."
    },
    "states-of-matter": {
        "hook": "Welcome to the magical ice caves! Your mission is to melt the ancient glaciers and boil the sacred waters to reveal the hidden gems within.",
        "wonder": "Water is a shape-shifter! It can be as hard as a rock, flow like a river, or vanish into thin air as a ghost-like gas."
    },
    "pi-visual": {
        "hook": "The ancient architects of India left behind perfect circular monuments. Your mission is to discover the mysterious number that connects them all!",
        "wonder": "No matter how big or small a circle is—from a tiny bindi to the giant sun—the ratio of its edge to its width is ALWAYS exactly the same. It's a universal law!"
    },
    "photosynthesis": {
        "hook": "You've shrunk down to the size of an ant! Enter the bustling leaf factory and help the plant cook its food using nothing but sunlight and air.",
        "wonder": "Trees are the ultimate magicians. They literally eat the sunlight hitting their leaves and breathe out the oxygen that keeps us alive!"
    },
    "water-cycle": {
        "hook": "Ride the Great Indian Monsoon! Follow a single drop of water as it travels from the Indian Ocean, up to the Himalayas, and down the Ganges river.",
        "wonder": "The water you drank today might have been inside a dinosaur millions of years ago. Earth has been recycling the exact same water forever!"
    },
    "magnets": {
        "hook": "The compasses on our ships are spinning wildly out of control! Harness the power of invisible magnetic fields to guide us safely home.",
        "wonder": "Earth itself is just one giant, spinning magnet floating in space, protecting us from dangerous solar winds with an invisible forcefield."
    },
    "float-sink": {
        "hook": "The King's treasure chest has fallen into the deep ocean. Can you master the laws of buoyancy to build a vessel strong enough to retrieve it?",
        "wonder": "How can a massive steel cruise ship weighing thousands of tonnes float, while a tiny little pebble sinks straight to the bottom?"
    },
    "day-night": {
        "hook": "The sun has suddenly stopped moving across the sky! Take control of Earth's rotation and restore the balance of day and night.",
        "wonder": "The sun doesn't actually rise or set. We are just passengers on a giant rocky spaceship spinning through the dark void at 1,600 km/h!"
    },
    "electricity": {
        "hook": "The city has lost power during the festival of lights! You must complete the electrical circuits to light up the night sky once again.",
        "wonder": "The same exact electricity that powers your tablet right now is the same energy that creates massive, booming lightning storms in the sky."
    }
}

# Apply rewrites
for c_id, rewrites in explorer_rewrites.items():
    if c_id in en_data['explorer']['concepts']:
        if 'narrative' in en_data['explorer']['concepts'][c_id]:
            en_data['explorer']['concepts'][c_id]['narrative']['hook'] = rewrites['hook']
            en_data['explorer']['concepts'][c_id]['narrative']['wonder'] = rewrites['wonder']

# Save EN
with open(os.path.join(locales_dir, 'en.json'), 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
    
print("Phase 2: Explorer World Audit Complete.")
