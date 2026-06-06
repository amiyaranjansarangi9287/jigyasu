import json
import os

EN_JSON_PATH = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json'

with open(EN_JSON_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'crosscutting' not in data:
    data['crosscutting'] = {}

if 'data' not in data['crosscutting']:
    data['crosscutting']['data'] = {}

# Mistake Museum
data['crosscutting']['data']['mistake_museum'] = {
    'earth-center': {
        'wrongBelief': 'Earth is the center of the universe',
        'whySense': 'Everything appears to move around us. The sun rises and sets.',
        'overturned': 'Copernicus (1543) proposed heliocentrism. Galileo observed Jupiter\'s moons.',
        'indianConnection': 'Aryabhata (499 CE) proposed Earth rotates on its axis \u2014 over 1000 years before Copernicus.',
    },
    'flat-earth': {
        'wrongBelief': 'The Earth is flat',
        'whySense': 'The ground looks flat. The horizon looks like a straight line.',
        'overturned': 'Pythagoras (500 BCE) reasoned Earth must be spherical.',
        'indianConnection': 'Ancient Indian texts describe Earth as spherical. Varahamihira (6th century) calculated Earth\'s circumference.',
    },
    'four-elements': {
        'wrongBelief': 'Everything is made of earth, water, fire, and air',
        'whySense': 'These four things are everywhere. Wood burns (fire + air) and leaves ash (earth).',
        'overturned': 'Lavoisier (1789) identified chemical elements.',
        'indianConnection': 'Indian philosophy had Pancha Mahabhuta \u2014 five elements including akasha (space/ether).',
    },
    'bloodletting': {
        'wrongBelief': 'Disease is caused by an imbalance of four humors',
        'whySense': 'Some patients seemed to improve after balancing humors.',
        'overturned': 'Germ theory (Pasteur, 1860s) showed diseases are caused by microorganisms.',
        'indianConnection': 'Ayurveda uses the Tridosha system (Vata, Pitta, Kapha) emphasizing holistic balance and diet rather than mere bloodletting.',
    }
}

# Daily Warmups
data['crosscutting']['data']['daily_warmups'] = {
    'why-sky-blue': {
        'theme': 'Why is the sky blue?',
        'question': 'What makes the sky appear blue during the day?',
        'options': [
            'The ocean reflects onto the sky',
            'Blue light scatters more than other colors in air',
            'The sun emits mostly blue light',
            'Clouds are blue',
        ],
        'ageAdaptations': {
            'tiny': 'Tap the blue sky! \ud83c\udf04',
            'early': 'Why do you think the sky is blue? Is it because of the ocean?',
            'lab': 'Light scatters differently based on wavelength. Which color scatters most?',
            'discovery': 'Rayleigh scattering: intensity \u221d 1/\u03bb\u2074. What does this mean for blue vs red light?',
            'academy': 'Derive the Rayleigh scattering cross-section. Why does sunset appear red?',
            'explorer': 'The physics of atmospheric scattering \u2014 and why other planets have different sky colors.',
        }
    },
    'fraction-pizza': {
        'theme': 'Sharing a Stuffed Paratha',
        'question': 'If you cut a large stuffed aloo paratha into 8 slices and eat 3, what fraction is left?',
        'options': ['3/8', '5/8', '1/2', '3/5'],
        'ageAdaptations': {
            'tiny': 'Count the paratha slices! \ud83e\udd56',
            'early': 'You have 8 slices. You eat 3. How many are left?',
            'lab': 'Express the remaining portion as a fraction, decimal, and percentage.',
            'discovery': 'If 3 people share 5/8 of a paratha equally, what fraction does each get?',
            'academy': 'Prove that 5/8 = 0.625 using long division. What pattern emerges?',
            'explorer': 'Fractions in cooking: scaling Indian recipes up and down.',
        }
    },
    'plant-growth': {
        'theme': 'How do plants grow?',
        'question': 'What does a plant need to grow?',
        'options': ['Only water', 'Only sunlight', 'Water, sunlight, and air', 'Only soil'],
        'ageAdaptations': {
            'tiny': 'What does a flower need? \ud83c\udf3b\ud83d\udca7\u2600\ufe0f',
            'early': 'Plants need water and sunlight. What else?',
            'lab': 'Name the three inputs of photosynthesis.',
            'discovery': 'Write the balanced equation for photosynthesis. Where does the mass come from?',
            'academy': 'Explain the light-dependent and light-independent reactions of photosynthesis.',
            'explorer': 'How understanding photosynthesis led to the green revolution in agriculture.',
        }
    },
    'gravity-fall': {
        'theme': 'Why do things fall?',
        'question': 'If you drop a feather and a rock on the Moon, which hits first?',
        'ageAdaptations': {
            'tiny': 'Watch things fall! \ud83e\udeb6\ud83e\udea8',
            'early': 'On Earth, a rock falls faster than a feather. Why? What about on the Moon?',
            'lab': 'Without air resistance, do heavy and light objects fall at the same rate?',
            'discovery': 'Galileo showed all objects fall at the same rate in vacuum. How did he prove this?',
            'academy': 'Derive the equation of motion for free fall. Why is g \u2248 9.8 m/s\u00b2?',
            'explorer': 'Einstein realized gravity is not a force \u2014 it is curved spacetime.',
        }
    },
    'water-states': {
        'theme': 'Water can be solid, liquid, or gas',
        'question': 'At what temperature does water boil at sea level?',
        'options': ['50\u00b0C', '100\u00b0C', '150\u00b0C', '200\u00b0C'],
        'ageAdaptations': {
            'tiny': 'Hot water makes steam! \u2668\ufe0f',
            'early': 'When water gets very hot, it turns into steam. At what temperature?',
            'lab': 'What happens to water molecules when temperature increases?',
            'discovery': 'Why does water boil at lower temperatures in the Himalayas?',
            'academy': 'Explain the phase diagram of water. What is the triple point?',
            'explorer': 'How pressure cookers work \u2014 and why cooking dal is harder at high altitude.',
        }
    },
    'number-pattern': {
        'theme': 'Number patterns',
        'question': 'What comes next: 2, 4, 8, 16, ...?',
        'options': ['24', '30', '32', '36'],
        'ageAdaptations': {
            'tiny': 'Count by twos! 2, 4, 6... \ud83d\udd22',
            'early': 'Each number is double the previous one. What comes after 16?',
            'lab': 'This is 2\u207f. What is 2\u2075? What about 2\u00b9\u2070?',
            'discovery': 'This pattern appears in cell division, computer memory, and compound interest.',
            'academy': 'Prove by induction that the sum of 2\u2070 + 2\u00b9 + ... + 2\u207f = 2\u207f\u207a\u00b9 - 1.',
            'explorer': 'Exponential growth: why it is the most powerful force in the universe.',
        }
    },
    'magnet-sort': {
        'theme': 'What sticks to magnets?',
        'question': 'Which of these is attracted to a magnet?',
        'options': ['Wood', 'Plastic', 'Iron nail', 'Glass'],
        'ageAdaptations': {
            'tiny': 'What does the magnet pick up? \ud83e\uddf2',
            'early': 'Try different objects. Which ones stick to the magnet?',
            'lab': 'Why is iron magnetic but aluminum is not?',
            'discovery': 'What are magnetic domains? Why can you demagnetize a magnet by heating it?',
            'academy': 'Explain ferromagnetism using electron spin and exchange interaction.',
            'explorer': 'How MRI machines use magnetic fields to see inside your body.',
        }
    }
}

# Concept Gossip
data['crosscutting']['data']['concept_gossip'] = {
    'zero-infinity': {
        'title': 'Zero & Infinity',
        'concept1': 'Zero (0)',
        'concept2': 'Infinity (\u221e)',
        'messages': [
            {"sender": 1, "text": "Hey Infinity. Everyone thinks I am nothing. But without me, math falls apart."},
            {"sender": 2, "text": "I know the feeling. They think I am a number. I'm actually a direction, an endless journey."},
            {"sender": 1, "text": "True. If someone tries to divide by me, I break the universe."},
            {"sender": 2, "text": "And if they try to add 1 to me, nothing changes. We are the ultimate rule-breakers."},
            {"sender": 1, "text": "Indian mathematicians gave me a symbol \u2014 a dot, then a circle (shunya). What about you?"},
            {"sender": 2, "text": "John Wallis gave me this \u221e shape in 1655. But the idea of endlessness is ancient."}
        ]
    },
    'gravity-entropy': {
        'title': 'Gravity & Entropy',
        'concept1': 'Gravity',
        'concept2': 'Entropy',
        'messages': [
            {"sender": 1, "text": "I bring things together. I build stars, planets, and galaxies."},
            {"sender": 2, "text": "And I tear them apart. I am the reason things decay and spread out."},
            {"sender": 1, "text": "We are complete opposites. I create order out of chaos."},
            {"sender": 2, "text": "But in the end, I always win. The universe is moving toward maximum chaos."},
            {"sender": 1, "text": "Unless... a black hole? I crush everything into a singularity."},
            {"sender": 2, "text": "Even black holes evaporate over time (Hawking radiation). Told you I win."}
        ]
    },
    'dna-rna': {
        'title': 'DNA & RNA',
        'concept1': 'DNA',
        'concept2': 'RNA',
        'messages': [
            {"sender": 1, "text": "I am the master blueprint. I hold the code for life safely in the nucleus."},
            {"sender": 2, "text": "Yeah, but you never leave the nucleus. You're just a massive, secure hard drive."},
            {"sender": 1, "text": "Security is important! I'm a stable double helix."},
            {"sender": 2, "text": "I'm the one who actually gets things done. I read your code, go to the ribosomes, and build the proteins."},
            {"sender": 1, "text": "True, you are the messenger. Without you, I'm just static information."},
            {"sender": 2, "text": "Exactly. You're the architect, but I'm the construction worker."}
        ]
    }
}

with open(EN_JSON_PATH, 'w', encoding='utf-8', errors='surrogatepass') as f:
    json.dump(data, f, indent=2, ensure_ascii=True)

print("Phase 8.1: crosscutting data injected into en.json successfully.")
