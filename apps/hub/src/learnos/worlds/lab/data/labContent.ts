// src/worlds/lab/data/labContent.ts
import type {
  LabModuleMetadata,
  EcosystemOrganism,
  ForceScenario,
  TimelineEvent,
  MultiplicationArray,
  LeverChallenge,
  ScalableRecipe,
  WeatherScenario,
  CodeChallenge,
  BuoyancyObject,
  StatisticsDataset,
  BodySystem,
  CrossConceptBridge,
} from '../types/lab.types';

export const LAB_MODULES: LabModuleMetadata[] = [
  { id: 'circuit-builder', emoji: '💡', title: 'Circuit Builder', subject: 'physics', color: '#F59E0B', bgColor: '#FFFBEB', path: 'circuit-builder', realWorldConnection: 'This is how every light in your home works', toyboxProject: 'LED Safe Circuit Kit', difficulty: 'intermediate', tags: ['electricity', 'circuits', 'hands-on'] },
  { id: 'fraction-kitchen', emoji: '🍳', title: 'Fraction Kitchen', subject: 'math', color: '#EF4444', bgColor: '#FFF5F5', path: 'fraction-kitchen', realWorldConnection: 'Chefs scale recipes exactly like this', difficulty: 'beginner', tags: ['fractions', 'cooking', 'ratios'] },
  { id: 'ecosystem-sandbox', emoji: '🌿', title: 'Ecosystem Sandbox', subject: 'biology', color: '#22C55E', bgColor: '#F0FDF4', path: 'ecosystem-sandbox', realWorldConnection: 'Indian tiger reserves work exactly like this', toyboxProject: 'Ecosystem in a Bottle', difficulty: 'intermediate', tags: ['ecosystem', 'food-chain', 'simulation'] },
  { id: 'force-lab', emoji: '⚡', title: 'Force Lab', subject: 'physics', color: '#8B5CF6', bgColor: '#F5F3FF', path: 'force-lab', realWorldConnection: 'Car brakes use friction to stop safely', toyboxProject: 'Rubber Band Car Experiment', difficulty: 'beginner', tags: ['force', 'friction', 'motion'] },
  { id: 'weather-station', emoji: '🌤️', title: 'Weather Station', subject: 'earth-science', color: '#0EA5E9', bgColor: '#F0F9FF', path: 'weather-station', realWorldConnection: 'Meteorologists use these exact instruments', difficulty: 'intermediate', tags: ['weather', 'data', 'prediction'] },
  { id: 'timeline-explorer', emoji: '📅', title: 'Timeline Explorer', subject: 'earth-science', color: '#6366F1', bgColor: '#EEF2FF', path: 'timeline-explorer', realWorldConnection: 'Understanding when things happened helps explain why', difficulty: 'beginner', tags: ['history', 'chronology', 'discoveries'] },
  { id: 'code-story', emoji: '💻', title: 'Code Story', subject: 'computer-science', color: '#14B8A6', bgColor: '#F0FDFA', path: 'code-story', realWorldConnection: 'This is exactly how computer programs work', difficulty: 'beginner', tags: ['coding', 'logic', 'sequencing'] },
  { id: 'multiplication-lab', emoji: '✖️', title: 'Multiplication Lab', subject: 'math', color: '#F97316', bgColor: '#FFF7ED', path: 'multiplication-lab', realWorldConnection: 'Architects use this for floor plans', difficulty: 'beginner', tags: ['multiplication', 'arrays', 'patterns'] },
  { id: 'buoyancy-lab', emoji: '🚢', title: 'Buoyancy Lab', subject: 'physics', color: '#06B6D4', bgColor: '#ECFEFF', path: 'buoyancy-lab', realWorldConnection: 'Ship engineers use this to build vessels', toyboxProject: 'Foil Boat Challenge', difficulty: 'intermediate', tags: ['density', 'floating', 'displacement'] },
  { id: 'lever-explorer', emoji: '⚙️', title: 'Lever Explorer', subject: 'physics', color: '#78716C', bgColor: '#F5F5F4', path: 'lever-explorer', realWorldConnection: 'Scissors, seesaws, and wheelbarrows are all levers', toyboxProject: 'Catapult with Fulcrum Variables', difficulty: 'beginner', tags: ['levers', 'mechanical-advantage', 'balance'] },
  { id: 'statistics-playground', emoji: '📊', title: 'Statistics Playground', subject: 'math', color: '#EC4899', bgColor: '#FDF2F8', path: 'statistics-playground', realWorldConnection: 'Cricket analysts use this every match', difficulty: 'intermediate', tags: ['mean', 'median', 'data-analysis'] },
  { id: 'human-body', emoji: '🫀', title: 'Human Body Systems', subject: 'biology', color: '#EF4444', bgColor: '#FFF5F5', path: 'human-body', realWorldConnection: 'Doctors need to understand all of this', difficulty: 'intermediate', tags: ['organs', 'systems', 'health'] },
  { id: 'panchabhutas', emoji: '🕉️', title: 'Panchabhutas', subject: 'chemistry', color: '#FF8C42', bgColor: '#FFF7ED', path: 'panchabhutas', realWorldConnection: 'Ancient Indian atomic theory offered early insights into the nature of matter', difficulty: 'beginner', tags: ['elements', 'ancient-science', 'indian'] },
  { id: 'states-of-matter', emoji: '🧊', title: 'States of Matter', subject: 'physics', color: '#3B82F6', bgColor: '#EFF6FF', path: 'states-of-matter', realWorldConnection: 'Everything around you exists in one of these three states', difficulty: 'beginner', tags: ['solid', 'liquid', 'gas', 'particles'] },
  { id: 'gravity', emoji: '🌌', title: 'Gravity & Spacetime', subject: 'physics', color: '#8B5CF6', bgColor: '#F5F3FF', path: 'gravity', realWorldConnection: 'This is why planets orbit and apples fall', difficulty: 'advanced', tags: ['gravity', 'spacetime', 'einstein', 'newton'] },
  { id: 'water-cycle', emoji: '🌧️', title: 'Water Cycle', subject: 'earth-science', color: '#0EA5E9', bgColor: '#F0F9FF', path: 'water-cycle', realWorldConnection: 'Indian monsoons are the largest water cycle event on Earth', difficulty: 'beginner', tags: ['evaporation', 'rain', 'clouds', 'monsoon'] },
  { id: 'photosynthesis', emoji: '🌿', title: 'Photosynthesis', subject: 'biology', color: '#22C55E', bgColor: '#F0FDF4', path: 'photosynthesis', realWorldConnection: 'Every plant you see is doing this right now', difficulty: 'intermediate', tags: ['plants', 'light', 'oxygen', 'energy'] },
  { id: 'digestive-system', emoji: '🍎', title: 'Digestive System', subject: 'biology', color: '#EC4899', bgColor: '#FDF2F8', path: 'digestive-system', realWorldConnection: 'Your body processes food through this exact journey', difficulty: 'beginner', tags: ['stomach', 'intestine', 'nutrition'] },
  { id: 'solar-system', emoji: '🌌', title: 'Solar System', subject: 'earth-science', color: '#F59E0B', bgColor: '#FFFBEB', path: 'solar-system', realWorldConnection: 'Earth is just one planet in this vast system', difficulty: 'beginner', tags: ['planets', 'orbits', 'sun'] },
  { id: 'blood-circulation', emoji: '❤️', title: 'Blood Circulation', subject: 'biology', color: '#EF4444', bgColor: '#FFF5F5', path: 'blood-circulation', realWorldConnection: 'Your heart pumps blood through this exact path', difficulty: 'intermediate', tags: ['heart', 'blood', 'vessels'] },
  { id: 'cell-explorer', emoji: '🔬', title: 'Cell Explorer', subject: 'biology', color: '#14B8A6', bgColor: '#F0FDFA', path: 'cell-explorer', realWorldConnection: 'Every living thing is made of these tiny units', difficulty: 'intermediate', tags: ['organelles', 'nucleus', 'microscopic'] },
  { id: 'newtons-laws', emoji: '🍎', title: "Newton's Laws", subject: 'physics', color: '#8B5CF6', bgColor: '#F5F3FF', path: 'newtons-laws', realWorldConnection: 'Every movement you make follows these laws', difficulty: 'intermediate', tags: ['force', 'mass', 'acceleration', 'F=ma'] },
  { id: 'magnets', emoji: '🧲', title: 'Magnets & Poles', subject: 'physics', color: '#A855F7', bgColor: '#FAF5FF', path: 'magnets', realWorldConnection: 'Compasses, speakers, and fridge magnets all use this', difficulty: 'beginner', tags: ['magnetic-field', 'poles', 'attraction'] },
  { id: 'electricity', emoji: '⚡', title: 'Electric Circuits', subject: 'physics', color: '#F59E0B', bgColor: '#FFFBEB', path: 'electricity', realWorldConnection: 'Every device in your home runs on these principles', difficulty: 'intermediate', tags: ['voltage', 'resistance', 'ohms-law', 'current'] },
  { id: 'light-shadows', emoji: '🔦', title: 'Light & Shadows', subject: 'physics', color: '#FBBF24', bgColor: '#FFFBEB', path: 'light-shadows', realWorldConnection: 'Shadows prove light travels in straight lines', difficulty: 'beginner', tags: ['light', 'shadow', 'reflection'] },
  { id: 'sound-waves', emoji: '🔊', title: 'Sound Waves', subject: 'physics', color: '#3B82F6', bgColor: '#EFF6FF', path: 'sound-waves', realWorldConnection: 'Every sound you hear travels this way', difficulty: 'beginner', tags: ['frequency', 'amplitude', 'vibration'] },
  { id: 'float-sink', emoji: '🌊', title: 'Float or Sink', subject: 'physics', color: '#0EA5E9', bgColor: '#F0F9FF', path: 'float-sink', realWorldConnection: 'Ships float using this exact principle', difficulty: 'beginner', tags: ['density', 'buoyancy', 'experiment'] },
  { id: 'plant-growth', emoji: '🌱', title: 'Plant Growth', subject: 'biology', color: '#22C55E', bgColor: '#F0FDF4', path: 'plant-growth', realWorldConnection: 'Every plant you see grew through these stages', difficulty: 'beginner', tags: ['seed', 'germination', 'flowering'] },
  { id: 'day-night', emoji: '🌍', title: 'Day & Night', subject: 'earth-science', color: '#6366F1', bgColor: '#EEF2FF', path: 'day-night', realWorldConnection: "Earth's rotation causes day and night", difficulty: 'beginner', tags: ['rotation', 'earth', 'sun'] },
  { id: 'moon-phases', emoji: '🌙', title: 'Moon Phases', subject: 'earth-science', color: '#A855F7', bgColor: '#FAF5FF', path: 'moon-phases', realWorldConnection: 'The Moon changes shape every night', difficulty: 'beginner', tags: ['lunar', 'orbit', 'calendar'] },
  { id: 'atoms', emoji: '⚛️', title: 'Atomic Structure', subject: 'chemistry', color: '#8B5CF6', bgColor: '#F5F3FF', path: 'atoms', realWorldConnection: 'Everything is made of these tiny particles', difficulty: 'intermediate', tags: ['protons', 'electrons', 'nucleus'] },
  { id: 'simple-machines', emoji: '⚙️', title: 'Simple Machines', subject: 'physics', color: '#64748B', bgColor: '#F8FAFC', path: 'simple-machines', realWorldConnection: 'Every tool you use is a simple machine', difficulty: 'beginner', tags: ['lever', 'pulley', 'wheel', 'ramp'] },
  { id: 'shapes', emoji: '🔺', title: 'Geometry Shapes', subject: 'math', color: '#A855F7', bgColor: '#FAF5FF', path: 'shapes', realWorldConnection: 'All buildings and objects use these shapes', difficulty: 'beginner', tags: ['polygon', 'angles', 'sides'] },
  { id: 'number-line', emoji: '📏', title: 'Number Line', subject: 'math', color: '#0EA5E9', bgColor: '#F0F9FF', path: 'number-line', realWorldConnection: 'Negative numbers are used in weather and banking', difficulty: 'beginner', tags: ['negative', 'positive', 'integers'] },
  { id: 'fractions', emoji: '🍕', title: 'Fractions', subject: 'math', color: '#F59E0B', bgColor: '#FFFBEB', path: 'fractions', realWorldConnection: 'Cooking, sharing, and measuring all use fractions', difficulty: 'beginner', tags: ['parts', 'whole', 'division'] },
  { id: 'multiplication', emoji: '✖️', title: 'Multiplication', subject: 'math', color: '#10B981', bgColor: '#ECFDF5', path: 'multiplication', realWorldConnection: 'Arrays are everywhere — tiles, eggs, windows', difficulty: 'beginner', tags: ['arrays', 'times-table', 'visual'] },
  { id: 'pi', emoji: '🥧', title: 'Pi (π)', subject: 'math', color: '#06B6D4', bgColor: '#ECFEFF', path: 'pi', realWorldConnection: 'Every circle you see uses π', difficulty: 'intermediate', tags: ['circle', 'circumference', 'constant'] },
  { id: 'pythagorean', emoji: '📐', title: 'Pythagorean Theorem', subject: 'math', color: '#6366F1', bgColor: '#EEF2FF', path: 'pythagorean', realWorldConnection: 'Construction and navigation use this daily', difficulty: 'advanced', tags: ['triangle', 'a²+b²=c²', 'hypotenuse'] },
  { id: 'senses', emoji: '👁️', title: 'Five Senses', subject: 'biology', color: '#EC4899', bgColor: '#FDF2F8', path: 'senses', realWorldConnection: 'You use these right now to learn!', difficulty: 'beginner', tags: ['sight', 'hearing', 'touch', 'taste', 'smell'] },
  { id: 'habitats', emoji: '🌲', title: 'Animal Habitats', subject: 'biology', color: '#22C55E', bgColor: '#F0FDF4', path: 'habitats', realWorldConnection: 'Every animal has a home it depends on', difficulty: 'beginner', tags: ['forest', 'ocean', 'desert', 'arctic'] },
  { id: 'food-chain', emoji: '🔗', title: 'Food Chains', subject: 'biology', color: '#84CC16', bgColor: '#ECFCCB', path: 'food-chain', realWorldConnection: 'You are part of a food chain right now', difficulty: 'beginner', tags: ['producer', 'consumer', 'energy'] },
];

export const ECOSYSTEM_ORGANISMS: EcosystemOrganism[] = [
  { id: 'sun', type: 'sun', emoji: '☀️', name: 'Sun', population: 1, maxPopulation: 1, growthRate: 0, foodSources: [] },
  { id: 'grass', type: 'plant', emoji: '🌿', name: 'Grass', population: 100, maxPopulation: 200, growthRate: 0.15, foodSources: ['sun'] },
  { id: 'rabbit', type: 'herbivore', emoji: '🐰', name: 'Rabbit', population: 30, maxPopulation: 80, growthRate: 0.12, foodSources: ['grass'] },
  { id: 'deer', type: 'herbivore', emoji: '🦌', name: 'Deer', population: 15, maxPopulation: 40, growthRate: 0.08, foodSources: ['grass'] },
  { id: 'fox', type: 'carnivore', emoji: '🦊', name: 'Fox', population: 10, maxPopulation: 30, growthRate: 0.06, foodSources: ['rabbit'] },
  { id: 'tiger', type: 'carnivore', emoji: '🐯', name: 'Tiger', population: 5, maxPopulation: 15, growthRate: 0.04, foodSources: ['rabbit', 'deer'] },
  { id: 'mushroom', type: 'decomposer', emoji: '🍄', name: 'Decomposer', population: 50, maxPopulation: 100, growthRate: 0.1, foodSources: ['rabbit', 'deer', 'fox', 'tiger'] },
];

export const FORCE_SCENARIOS: ForceScenario[] = [
  { id: 'ice', surface: 'ice', surfaceEmoji: '🧊', frictionCoefficient: 0.05, boxEmoji: '📦', description: 'Ice rink — very slippery!' },
  { id: 'carpet', surface: 'carpet', surfaceEmoji: '🟫', frictionCoefficient: 0.4, boxEmoji: '📦', description: 'Carpet — quite grippy' },
  { id: 'sand', surface: 'sand', surfaceEmoji: '🏖️', frictionCoefficient: 0.6, boxEmoji: '📦', description: 'Sand — hard to push through' },
  { id: 'rock', surface: 'rock', surfaceEmoji: '🪨', frictionCoefficient: 0.7, boxEmoji: '📦', description: 'Rough rock — very high friction' },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'zero-india', year: 628, title: 'Zero Invented', emoji: '0️⃣', subject: 'math', description: 'Brahmagupta in India defined zero as a number', isIndian: true },
  { id: 'aryabhata', year: 499, title: 'Aryabhata Calculates Pi', emoji: '🔢', subject: 'math', description: 'Indian mathematician Aryabhata approximated pi', isIndian: true },
  { id: 'archimedes', year: -250, title: 'Archimedes Principle', emoji: '🛁', subject: 'physics', description: 'Archimedes formulated the principle of buoyancy, relating displacement to floating bodies' },
  { id: 'gutenberg', year: 1440, title: 'Printing Press', emoji: '📰', subject: 'computer-science', description: 'Gutenberg invented the printing press, spreading knowledge' },
  { id: 'galileo', year: 1610, title: 'Galileo Sees Moons', emoji: '🔭', subject: 'earth-science', description: 'Galileo saw moons of Jupiter with his telescope' },
  { id: 'newton-apple', year: 1666, title: 'Newton and Gravity', emoji: '🍎', subject: 'physics', description: 'Newton described the laws of motion and gravity' },
  { id: 'electricity', year: 1831, title: 'Faraday: Electricity', emoji: '⚡', subject: 'physics', description: 'Michael Faraday discovered electromagnetic induction' },
  { id: 'darwin', year: 1859, title: 'Darwin: Evolution', emoji: '🦎', subject: 'biology', description: 'Darwin published On the Origin of Species' },
  { id: 'bose-einstein', year: 1924, title: 'Bose-Einstein Statistics', emoji: '⚛️', subject: 'physics', description: 'Satyendra Bose collaborated with Einstein on quantum statistics', isIndian: true },
  { id: 'dna', year: 1953, title: 'DNA Structure Found', emoji: '🧬', subject: 'biology', description: 'Watson, Crick, Franklin discovered the double helix' },
  { id: 'moon-landing', year: 1969, title: 'Moon Landing', emoji: '🌕', subject: 'earth-science', description: 'Apollo 11 landed on the Moon' },
  { id: 'isro-mars', year: 2013, title: 'India Reaches Mars', emoji: '🚀', subject: 'earth-science', description: 'ISRO Mangalyaan became first Asian spacecraft to reach Mars', isIndian: true },
];

export const SCALABLE_RECIPES: ScalableRecipe[] = [
  { id: 'idli', name: 'Idli', emoji: '🫓', baseServings: 4, targetServings: 12, isIndian: true, difficulty: 1, ingredients: [{ name: 'Rice', emoji: '🍚', baseAmount: 2, unit: 'cups' }, { name: 'Urad Dal', emoji: '🫘', baseAmount: 1, unit: 'cup' }, { name: 'Salt', emoji: '🧂', baseAmount: 1, unit: 'tsp' }] },
  { id: 'khichdi', name: 'Khichdi', emoji: '🍲', baseServings: 2, targetServings: 7, isIndian: true, difficulty: 3, ingredients: [{ name: 'Rice', emoji: '🍚', baseAmount: 0.5, unit: 'cup' }, { name: 'Moong Dal', emoji: '🫘', baseAmount: 0.25, unit: 'cup' }, { name: 'Water', emoji: '💧', baseAmount: 1.5, unit: 'cups' }] },
];

export const WEATHER_SCENARIOS: WeatherScenario[] = [
  { id: 'hot-dry', name: 'Hot and Dry', emoji: '☀️', readings: { temperature: 38, humidity: 20, pressure: 1013, windSpeed: 5, cloudCover: 5 }, correctPrediction: 'sunny', explanation: 'High temperature and low humidity means sun!' },
  { id: 'monsoon', name: 'Monsoon', emoji: '🌧️', readings: { temperature: 28, humidity: 90, pressure: 995, windSpeed: 30, cloudCover: 95 }, correctPrediction: 'rainy', explanation: 'Low pressure and high humidity brings rain.' },
  { id: 'overcast', name: 'Overcast', emoji: '☁️', readings: { temperature: 22, humidity: 65, pressure: 1008, windSpeed: 12, cloudCover: 85 }, correctPrediction: 'cloudy', explanation: 'High cloud cover blocks the sun even without rain.' },
  { id: 'thunderstorm', name: 'Thunderstorm', emoji: '⛈️', readings: { temperature: 24, humidity: 80, pressure: 988, windSpeed: 55, cloudCover: 75 }, correctPrediction: 'stormy', explanation: 'Very low pressure and strong winds signal a storm.' },
];

// === CODE STORY ===
export const CODE_CHALLENGES: CodeChallenge[] = [
  { id: 'reach-star', title: 'Reach the Star', story: 'Robo needs to reach the star!', characterEmoji: '🤖', sceneEmoji: '⭐', difficulty: 1, availableBlocks: ['move-right','move-up'], goal: 'Move Robo to the star', hint: 'Go right then up', solutionBlocks: ['move-right','move-up'] },
  { id: 'avoid-dragon', title: 'Avoid the Dragon', story: 'If Robo sees a dragon, run left!', characterEmoji: '🤖', sceneEmoji: '🐉', difficulty: 2, availableBlocks: ['if-dragon','then-left','else-right'], goal: 'Use IF/THEN', hint: 'IF dragon → THEN left', solutionBlocks: ['if-dragon','then-left','else-right'] },
  { id: 'collect-coins', title: 'Collect Coins', story: 'Use REPEAT to collect 5 coins!', characterEmoji: '🤖', sceneEmoji: '🪙', difficulty: 3, availableBlocks: ['repeat-5','move-right','collect'], goal: 'Collect all coins with REPEAT', hint: 'REPEAT means do it many times', solutionBlocks: ['repeat-5','move-right','collect'] },
];

// === MULTIPLICATION LAB ===
export const MULTIPLICATION_ARRAYS: MultiplicationArray[] = [
  { rows: 3, cols: 4, emoji: '🍎', context: 'Apples in a box', indianContext: false },
  { rows: 5, cols: 6, emoji: '🪔', context: 'Diyas in rows', indianContext: true },
  { rows: 4, cols: 4, emoji: '🧱', context: 'Bricks in a wall', indianContext: false },
  { rows: 6, cols: 7, emoji: '🌾', context: 'Rice plants in a field', indianContext: true },
  { rows: 8, cols: 9, emoji: '⭐', context: 'Stars in a grid', indianContext: false },
  { rows: 7, cols: 8, emoji: '💐', context: 'Flowers in a garden', indianContext: true },
  { rows: 9, cols: 9, emoji: '🔢', context: 'Numbers in a times table', indianContext: false },
  { rows: 12, cols: 12, emoji: '📐', context: 'Squares in a grid', indianContext: false },
];

export const TIMES_TABLE_PATTERNS = [
  { number: 2, pattern: 'Always even! Count in 2s.', emoji: '2️⃣', color: '#3B82F6' },
  { number: 5, pattern: 'Always ends in 0 or 5!', emoji: '5️⃣', color: '#10B981' },
  { number: 9, pattern: 'Digits always add up to 9!', emoji: '9️⃣', color: '#8B5CF6' },
  { number: 10, pattern: 'Just add a zero!', emoji: '🔟', color: '#F59E0B' },
  { number: 11, pattern: 'Repeat the digit! (up to 9×11)', emoji: '1️⃣1️⃣', color: '#EF4444' },
];

// === BUOYANCY ===
export const BUOYANCY_OBJECTS: BuoyancyObject[] = [
  { id: 'wooden-block', name: 'Wooden Block', emoji: '🪵', mass: 400, volume: 800, density: 0.5, floats: true, material: 'Wood (density: 0.5)' },
  { id: 'iron-cube', name: 'Iron Cube', emoji: '🔩', mass: 800, volume: 100, density: 8.0, floats: false, material: 'Iron (density: 8.0)' },
  { id: 'plastic-ball', name: 'Plastic Ball', emoji: '⚽', mass: 200, volume: 500, density: 0.4, floats: true, material: 'Plastic (density: 0.4)' },
  { id: 'coin', name: 'Coin', emoji: '🪙', mass: 15, volume: 2, density: 7.5, floats: false, material: 'Alloy (density: 7.5)' },
  { id: 'cork', name: 'Cork', emoji: '🍾', mass: 10, volume: 40, density: 0.25, floats: true, material: 'Cork (density: 0.25)' },
  { id: 'wax-candle', name: 'Wax Candle', emoji: '🕯️', mass: 60, volume: 70, density: 0.86, floats: true, material: 'Wax (density: 0.86)' },
  { id: 'leaf', name: 'Leaf', emoji: '🍃', mass: 2, volume: 10, density: 0.2, floats: true, material: 'Plant (density: 0.2)' },
  { id: 'steel-ball', name: 'Steel Ball', emoji: '⚙️', mass: 500, volume: 65, density: 7.8, floats: false, material: 'Steel (density: 7.8)' },
];

export const WATER_DENSITY = 1.0;

// === LEVER ===
export const LEVER_CHALLENGES: LeverChallenge[] = [
  { id: 'lc1', description: 'Balance the two weights by moving the fulcrum!', leftWeight: 5, rightWeight: 5, goalSide: 'balanced', difficulty: 1, class: 1, emoji: '⚖️', realWorldExample: 'A seesaw (class 1 lever)' },
  { id: 'lc2', description: 'The left side is heavier. Move fulcrum to balance!', leftWeight: 10, rightWeight: 5, goalSide: 'balanced', difficulty: 2, class: 1, emoji: '🏋️', realWorldExample: 'A balance scale' },
  { id: 'lc3', description: 'Lift the heavy rock with a small effort on the other side!', leftWeight: 20, rightWeight: 5, goalSide: 'right', difficulty: 2, class: 1, emoji: '🪨', realWorldExample: 'Ancient Egyptians building pyramids' },
  { id: 'lc4', description: 'Find the fulcrum position where force multiplies!', leftWeight: 30, rightWeight: 10, goalSide: 'balanced', difficulty: 3, class: 1, emoji: '⚙️', realWorldExample: 'Crowbar opening a lid' },
];

// === STATISTICS ===
export const STATISTICS_DATASETS: StatisticsDataset[] = [
  { id: 'cricket-scores', name: 'Cricket Scores', emoji: '🏏', data: [45,67,23,89,12,56,78,34,91,45], context: 'Runs scored in 10 matches', unit: 'runs', isIndian: true },
  { id: 'monthly-rainfall', name: 'Monthly Rainfall', emoji: '🌧️', data: [12,8,15,45,89,156,210,198,145,67,23,10], context: 'Rainfall in mm', unit: 'mm', isIndian: true },
  { id: 'class-heights', name: 'Class Heights', emoji: '📏', data: [125,130,128,135,122,138,132,127,134,129], context: 'Student heights in cm', unit: 'cm', isIndian: false },
];

// === BODY SYSTEMS ===
export const BODY_SYSTEMS: BodySystem[] = [
  { id: 'circulatory', name: 'Circulatory', emoji: '❤️', color: '#EF4444', function: 'Pumps blood with oxygen', interestingFact: 'Your heart beats 100,000 times per day!', organs: [{ id: 'heart', name: 'Heart', emoji: '❤️', fact: 'Pumps 5 litres per minute' }, { id: 'vessels', name: 'Blood Vessels', emoji: '🩸', fact: 'Would circle Earth 2.5 times' }] },
  { id: 'digestive', name: 'Digestive', emoji: '🫁', color: '#F97316', function: 'Breaks down food into energy', interestingFact: 'Small intestine is 6 metres long!', organs: [{ id: 'stomach', name: 'Stomach', emoji: '🫃', fact: 'Acid strong enough to dissolve metal' }, { id: 'intestine', name: 'Small Intestine', emoji: '🌀', fact: 'Where nutrients are absorbed' }] },
  { id: 'respiratory', name: 'Respiratory', emoji: '🫁', color: '#06B6D4', function: 'Brings oxygen, removes CO2', interestingFact: 'You breathe 20,000 times per day!', organs: [{ id: 'lungs', name: 'Lungs', emoji: '🫁', fact: '300 million tiny air sacs' }, { id: 'trachea', name: 'Windpipe', emoji: '🔵', fact: 'Tiny hairs filter dust' }] },
  { id: 'skeletal', name: 'Skeletal', emoji: '🦴', color: '#94A3B8', function: 'Supports body and protects organs', interestingFact: '206 bones, but babies have 270!', organs: [{ id: 'skull', name: 'Skull', emoji: '💀', fact: 'Protects your brain' }, { id: 'femur', name: 'Femur', emoji: '🦵', fact: 'Longest and strongest bone' }] },
];

// === CROSS-CONCEPT BRIDGES ===
export const CROSS_CONCEPT_BRIDGES: CrossConceptBridge[] = [
  { id: 'circuit-force', module1: 'circuit-builder', module2: 'force-lab', bridgeMessage: 'Voltage pushes electrons like force pushes a box — both are "push"!', emoji: '⚡🔀⚡' },
  { id: 'fraction-stats', module1: 'fraction-kitchen', module2: 'statistics-playground', bridgeMessage: 'Fractions and statistics both describe parts of a whole.', emoji: '🍳🔀📊' },
  { id: 'eco-timeline', module1: 'ecosystem-sandbox', module2: 'timeline-explorer', bridgeMessage: 'Darwin proposed natural selection by observing ecosystems over time.', emoji: '🌿🔀📅' },
  { id: 'buoy-fraction', module1: 'buoyancy-lab', module2: 'fraction-kitchen', bridgeMessage: 'Density is mass/volume — a fraction! Density < 1 floats.', emoji: '🚢🔀🍳' },
  { id: 'lever-mult', module1: 'lever-explorer', module2: 'multiplication-lab', bridgeMessage: 'Levers multiply force. Force × distance = multiplication making work easier!', emoji: '⚙️🔀✖️' },
  { id: 'weather-stats', module1: 'weather-station', module2: 'statistics-playground', bridgeMessage: 'Weather forecasting IS statistics — collecting data and finding patterns.', emoji: '🌤️🔀📊' },
  { id: 'body-eco', module1: 'human-body', module2: 'ecosystem-sandbox', bridgeMessage: 'Your body is an ecosystem! Organs depend on each other like organisms.', emoji: '🫀🔀🌿' },
  { id: 'code-force', module1: 'code-story', module2: 'force-lab', bridgeMessage: 'Code uses IF/THEN — just like physics! IF force > friction THEN box moves.', emoji: '💻🔀⚡' },
];
