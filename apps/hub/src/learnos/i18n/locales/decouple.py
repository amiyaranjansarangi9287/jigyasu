import json

path = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

labs_content = {
    'AtomicStructure': {
        'quizzes': [
            { 'q': 'Atomic number equals the number of:', 'options': ['Neutrons', 'Protons', 'Electrons', 'Nucleons'], 'correct': 1 },
            { 'q': 'Isotopes differ in the number of:', 'options': ['Protons', 'Electrons', 'Neutrons', 'Shells'], 'correct': 2 },
            { 'q': 'The first electron shell holds max:', 'options': ['1 electron', '2 electrons', '8 electrons', '18 electrons'], 'correct': 1 }
        ]
    },
    'Panchabhutas': {
        'elements': [
            {
                'id': 'prithvi',
                'sanskrit': 'Pṛthvī',
                'devanagari': 'पृथ्वी',
                'english': 'Earth',
                'modern': 'SOLID',
                'property': 'Smell • Stability',
                'description': 'The solid state of matter — atoms packed tight, vibrating in place. Earth represents the tangible, stable foundation of all material existence.',
                'anuWisdom': 'Maharishi Kanad taught: "The earth atom (Pṛthvī-anu) carries the quality of smell and provides form to all visible things." Modern chemistry calls this — a crystalline lattice!'
            },
            {
                'id': 'jala',
                'sanskrit': 'Jala',
                'devanagari': 'जल',
                'english': 'Water',
                'modern': 'LIQUID',
                'property': 'Taste • Flow',
                'description': 'The liquid state of matter — atoms flowing freely but staying together. Water represents adaptability, cohesion, and life itself.',
                'anuWisdom': 'Maharishi Kanad observed: "Water atoms (Jala-anu) are naturally cool and fluid." We now know this fluidity comes from transient hydrogen bonds between H2O molecules.'
            }
        ],
        'quizzes': [
            { 'q': 'Which modern state of matter corresponds to Vayu (Air)?', 'options': ['Solid', 'Liquid', 'Gas', 'Plasma'], 'correct': 2 },
            { 'q': 'According to Maharishi Kanad, which element provides form and stability?', 'options': ['Jala', 'Agni', 'Prithvi', 'Akasha'], 'correct': 2 },
            { 'q': 'What does Akasha (Space/Ether) represent in modern terms?', 'options': ['Energy', 'Vacuum/Spacetime', 'Gravity', 'Magnetism'], 'correct': 1 }
        ]
    },
    'DopplerEffect': {
        'quizzes': [
            { 'q': 'When a source approaches, observed frequency:', 'options': ['Decreases', 'Increases', 'Stays same', 'Becomes zero'], 'correct': 1 },
            { 'q': 'The Doppler effect is used in:', 'options': ['Microwave ovens', 'Police radar', 'Solar panels', 'Batteries'], 'correct': 1 },
            { 'q': 'Red shift in astronomy means galaxies are:', 'options': ['Approaching', 'Receding', 'Stationary', 'Exploding'], 'correct': 1 }
        ]
    },
    'ProbabilityPlayground': {
        'quizzes': [
            { 'q': 'P(heads) on a fair coin?', 'answer': '1/2', 'options': ['1/2', '1/4', '1/6', '2/3'], 'explanation': '2 outcomes: H or T. P = 1/2' },
            { 'q': 'P(rolling a 6) on a die?', 'answer': '1/6', 'options': ['1/2', '1/6', '1/3', '6/6'], 'explanation': '6 outcomes, 1 is a 6. P = 1/6' },
            { 'q': 'P(drawing a heart) from a deck?', 'answer': '1/4', 'options': ['1/4', '1/13', '1/52', '1/2'], 'explanation': '13 hearts in 52 cards. P = 13/52 = 1/4' }
        ]
    }
}

data['labs'] = labs_content

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('Successfully decoupled labs content into en.json')
