// src/worlds/discovery/data/discoveryContent.ts
import type {
  ConceptNode,
  DiscoveryModule,
  ChemicalReaction,
  GeometryTheorem,
  GeneticTrait,
} from '../types/discovery.types';

export interface DiscoveryModuleMetadata {
  id: DiscoveryModule;
  title: string;
  emoji: string;
  subject: string;
  color: string;
  path: string;
  hook: string;
  realWorldConnection: string;
  unsolvedQuestion: string;
  connections: DiscoveryModule[];
}

export interface GoDeeperConnection {
  title: string;
  description: string;
  type: string;
}

export interface GoDeeper {
  moduleId: DiscoveryModule;
  connections: GoDeeperConnection[];
}

export const DISCOVERY_MODULES: DiscoveryModuleMetadata[] = [
  {
    id: 'algebra-scales',
    title: 'Algebra Scales',
    emoji: '⚖️',
    subject: 'math',
    color: '#F59E0B',
    path: 'algebra-scales',
    hook: 'x is just an unknown weight — find it by balancing',
    realWorldConnection: 'Engineers use algebra to balance forces in bridges',
    unsolvedQuestion: 'Can some equations have no solution, or infinite solutions?',
    connections: ['chemical-balancer', 'genetics-simulator'],
  },
  {
    id: 'cell-city',
    title: 'Cell City',
    emoji: '🦠',
    subject: 'biology',
    color: '#EC4899',
    path: 'cell-city',
    hook: 'Design a cell like an architect — every organelle has a role',
    realWorldConnection: 'Understanding cells leads to cures for cancer',
    unsolvedQuestion: 'How did the first cell come to exist?',
    connections: ['genetics-simulator', 'carbon-cycle'],
  },
  {
    id: 'chemical-balancer',
    title: 'Chemical Balancer',
    emoji: '⚗️',
    subject: 'chemistry',
    color: '#10B981',
    path: 'chemical-balancer',
    hook: 'Atoms cannot be created or destroyed — balance both sides',
    realWorldConnection: 'Pharmacists balance equations to make safe medicines',
    unsolvedQuestion: 'Why do some reactions release energy and others absorb it?',
    connections: ['algebra-scales', 'carbon-cycle'],
  },
  {
    id: 'geometry-proof',
    title: 'Geometry Proof Builder',
    emoji: '📐',
    subject: 'math',
    color: '#6366F1',
    path: 'geometry-proof',
    hook: 'Prove it is always true — not just for one triangle',
    realWorldConnection: 'Architects and GPS systems rely on Pythagorean theorem',
    unsolvedQuestion: 'Are there other number systems where Pythagoras fails?',
    connections: ['algebra-scales', 'speed-distance-time'],
  },
  {
    id: 'speed-distance-time',
    title: 'Speed Distance Time',
    emoji: '🚀',
    subject: 'physics',
    color: '#0EA5E9',
    path: 'speed-distance-time',
    hook: 'The slope of a graph IS speed — find it without a formula',
    realWorldConnection: 'Train scheduling and GPS use this every second',
    unsolvedQuestion: 'What happens to speed as you approach the speed of light?',
    connections: ['geometry-proof', 'algebra-scales'],
  },
  {
    id: 'genetics-simulator',
    title: 'Genetics Simulator',
    emoji: '🧬',
    subject: 'biology',
    color: '#8B5CF6',
    path: 'genetics-simulator',
    hook: 'Predict which traits offspring inherit using probability',
    realWorldConnection: 'Doctors use genetics to predict inherited diseases',
    unsolvedQuestion: 'Why do twins sometimes have different personalities?',
    connections: ['probability-sandbox', 'cell-city'],
  },
  {
    id: 'plate-tectonics',
    title: 'Plate Tectonics',
    emoji: '🌋',
    subject: 'earth-science',
    color: '#EF4444',
    path: 'plate-tectonics',
    hook: 'The ground beneath you is slowly moving — continents drift',
    realWorldConnection: 'India crashed into Asia to form the Himalayas',
    unsolvedQuestion: 'What drives plate movement deep inside Earth?',
    connections: ['carbon-cycle', 'economic-simulation'],
  },
  {
    id: 'literary-analysis',
    title: 'Literary Analysis',
    emoji: '📖',
    subject: 'language',
    color: '#F97316',
    path: 'literary-analysis',
    hook: 'Every story has hidden patterns — find the author\'s secret tools',
    realWorldConnection: 'Understanding persuasion helps you resist manipulation',
    unsolvedQuestion: 'Can a story mean something the author never intended?',
    connections: ['economic-simulation', 'number-systems'],
  },
  {
    id: 'economic-simulation',
    title: 'Economic Simulation',
    emoji: '📊',
    subject: 'economics',
    color: '#14B8A6',
    path: 'economic-simulation',
    hook: 'Supply and demand — the invisible force that prices everything',
    realWorldConnection: 'Why does onion price change every week in India?',
    unsolvedQuestion: 'Can an economy be perfectly fair?',
    connections: ['probability-sandbox', 'plate-tectonics'],
  },
  {
    id: 'periodic-table',
    title: 'Periodic Table Explorer',
    emoji: '⚛️',
    subject: 'chemistry',
    color: '#06B6D4',
    path: 'periodic-table',
    hook: 'Every element has a story — discover the pattern behind them all',
    realWorldConnection: 'Your phone contains 62 different elements',
    unsolvedQuestion: 'How many elements can exist before they become unstable?',
    connections: ['chemical-balancer', 'carbon-cycle'],
  },
  {
    id: 'probability-sandbox',
    title: 'Probability Sandbox',
    emoji: '🎲',
    subject: 'math',
    color: '#A855F7',
    path: 'probability-sandbox',
    hook: 'Chance is not random — it follows rules you can discover',
    realWorldConnection: 'Insurance companies use probability to set prices',
    unsolvedQuestion: 'Is anything truly random, or do we just not know enough?',
    connections: ['genetics-simulator', 'economic-simulation', 'fermi-estimation'],
  },
  {
    id: 'carbon-cycle',
    title: 'Carbon Cycle',
    emoji: '🌍',
    subject: 'biology',
    color: '#22C55E',
    path: 'carbon-cycle',
    hook: 'The carbon in you was once in a dinosaur — trace its journey',
    realWorldConnection: 'Burning fossil fuels releases ancient carbon into the air',
    unsolvedQuestion: 'How much carbon can the ocean absorb before it changes?',
    connections: ['cell-city', 'chemical-balancer', 'plate-tectonics'],
  },
  {
    id: 'number-systems',
    title: 'Number Systems',
    emoji: '🔢',
    subject: 'math',
    color: '#EAB308',
    path: 'number-systems',
    hook: 'Binary is not strange — it is how computers think',
    realWorldConnection: 'Every photo on your phone is just 1s and 0s',
    unsolvedQuestion: 'Are there number systems we have not discovered yet?',
    connections: ['probability-sandbox', 'literary-analysis'],
  },
  {
    id: 'fermi-estimation',
    title: 'Fermi Estimation',
    emoji: '🧠',
    subject: 'physics',
    color: '#64748B',
    path: 'fermi-estimation',
    hook: 'How many piano tuners are in Mumbai? You can figure it out',
    realWorldConnection: 'Scientists use Fermi estimation to check if results make sense',
    unsolvedQuestion: 'How many intelligent civilizations exist in the galaxy?',
    connections: ['probability-sandbox', 'economic-simulation'],
  },
];

export const CONSTELLATION_NODES: ConceptNode[] = DISCOVERY_MODULES.map(
  (module, i) => {
    const positions = [
      { x: 0.15, y: 0.20 }, { x: 0.40, y: 0.30 }, { x: 0.65, y: 0.15 },
      { x: 0.85, y: 0.35 }, { x: 0.55, y: 0.50 }, { x: 0.30, y: 0.45 },
      { x: 0.75, y: 0.60 }, { x: 0.20, y: 0.65 }, { x: 0.50, y: 0.75 },
      { x: 0.80, y: 0.45 }, { x: 0.10, y: 0.55 }, { x: 0.60, y: 0.35 },
      { x: 0.35, y: 0.70 }, { x: 0.90, y: 0.70 },
    ];
    return {
      id: module.id,
      title: module.title,
      subject: module.subject as any,
      x: positions[i]?.x ?? 0.5,
      y: positions[i]?.y ?? 0.5,
      mastery: null,
      connections: module.connections,
    };
  }
);

export interface UnsolvedQuestion {
  moduleId: DiscoveryModule;
  question: string;
  context: string;
  fieldName: string;
}

export const UNSOLVED_QUESTIONS: UnsolvedQuestion[] = [
  {
    moduleId: 'algebra-scales',
    question: 'Are there patterns in prime numbers?',
    context: 'The Riemann Hypothesis is about prime number patterns.',
    fieldName: 'Number Theory',
  },
  {
    moduleId: 'cell-city',
    question: 'How did the first living cell form from non-living matter?',
    context: 'Abiogenesis remains one of the biggest unanswered questions.',
    fieldName: 'Origin of Life',
  },
  {
    moduleId: 'plate-tectonics',
    question: 'What exactly drives plate movement in the mantle?',
    context: 'Convection currents are part of it, but the full mechanism is debated.',
    fieldName: 'Geophysics',
  },
  {
    moduleId: 'economic-simulation',
    question: 'Can we design an economy that is both efficient and fair?',
    context: 'Every economic system has trade-offs between equity and growth.',
    fieldName: 'Economic Design',
  },
  {
    moduleId: 'fermi-estimation',
    question: 'How many intelligent civilizations exist in our galaxy?',
    context: 'The Drake Equation gives a framework but no answer.',
    fieldName: 'Astrobiology',
  },
];

export const GO_DEEPER_CONTENT: GoDeeper[] = [
  {
    moduleId: 'algebra-scales',
    connections: [
      { title: 'Algebra in chemistry', description: 'Balancing chemical equations uses algebra logic.', type: 'application' },
      { title: 'History of algebra', description: 'Al-Khwarizmi wrote the first algebra book in 820 CE.', type: 'history' },
      { title: 'Linear algebra', description: 'What if you have multiple unknowns? Matrices solve them.', type: 'frontier' },
    ],
  },
  {
    moduleId: 'cell-city',
    connections: [
      { title: 'Mitochondria are ancient bacteria', description: 'Cells swallowed bacteria billions of years ago — they became organelles.', type: 'concept' },
      { title: 'Stem cells', description: 'Some cells can become any type — this is how healing works.', type: 'application' },
      { title: 'Synthetic biology', description: 'Scientists are building artificial cells from scratch.', type: 'frontier' },
    ],
  },
  {
    moduleId: 'chemical-balancer',
    connections: [
      { title: 'Haber process', description: 'Balancing N₂ + H₂ → NH₃ feeds half the world through fertilizer.', type: 'application' },
      { title: 'Lavoisier and conservation', description: 'Matter is never lost — it just changes form.', type: 'history' },
      { title: 'Nuclear reactions', description: 'In nuclear reactions, matter becomes energy. E = mc².', type: 'frontier' },
    ],
  },
  {
    moduleId: 'geometry-proof',
    connections: [
      { title: 'Non-Euclidean geometry', description: 'What if parallel lines meet? Einstein used this for relativity.', type: 'frontier' },
      { title: 'GPS and geometry', description: 'Your phone uses triangle geometry to find your location.', type: 'application' },
      { title: 'Euclid\'s Elements', description: 'Written in 300 BCE, still the basis of geometry today.', type: 'history' },
    ],
  },
  {
    moduleId: 'speed-distance-time',
    connections: [
      { title: 'Special relativity', description: 'At near-light speed, time itself slows down.', type: 'frontier' },
      { title: 'Calculus connection', description: 'Speed is the derivative of distance — the birth of calculus.', type: 'concept' },
      { title: 'Indian astronomers', description: 'Kerala school calculated infinite series for trig functions centuries before Europe.', type: 'history' },
    ],
  },
  {
    moduleId: 'genetics-simulator',
    connections: [
      { title: 'CRISPR gene editing', description: 'Scientists can now edit DNA like a word processor.', type: 'frontier' },
      { title: 'Mendel\'s peas', description: 'A monk in 1865 discovered the rules of inheritance.', type: 'history' },
      { title: 'Personalized medicine', description: 'Your DNA determines which medicines work best for you.', type: 'application' },
    ],
  },
  {
    moduleId: 'plate-tectonics',
    connections: [
      { title: 'Continental drift', description: 'Wegener proposed it in 1912 — ridiculed for decades before accepted.', type: 'history' },
      { title: 'Earthquake prediction', description: 'We still cannot predict earthquakes — this is an active research area.', type: 'frontier' },
      { title: 'Himalayan formation', description: 'India is still pushing into Asia — Everest grows 4mm per year.', type: 'application' },
    ],
  },
  {
    moduleId: 'literary-analysis',
    connections: [
      { title: 'Rhetoric and persuasion', description: 'Aristotle identified ethos, pathos, and logos 2400 years ago.', type: 'history' },
      { title: 'Media literacy', description: 'Understanding literary devices helps you spot manipulation in news.', type: 'application' },
      { title: 'AI and creativity', description: 'Can an AI write a poem that moves you? What does that mean?', type: 'frontier' },
    ],
  },
  {
    moduleId: 'economic-simulation',
    connections: [
      { title: 'Adam Smith\'s invisible hand', description: 'Self-interest can benefit society — but only sometimes.', type: 'history' },
      { title: 'Universal basic income', description: 'What if everyone received money regardless of work?', type: 'frontier' },
      { title: 'Microfinance in India', description: 'Small loans to women in villages transformed entire communities.', type: 'application' },
    ],
  },
  {
    moduleId: 'periodic-table',
    connections: [
      { title: 'Mendeleev\'s prediction', description: 'He left gaps for elements not yet discovered — and was right.', type: 'history' },
      { title: 'Rare earth elements', description: 'Your phone needs neodymium, yttrium, and 14 others.', type: 'application' },
      { title: 'Island of stability', description: 'Super-heavy elements might be stable — we have not found them yet.', type: 'frontier' },
    ],
  },
  {
    moduleId: 'probability-sandbox',
    connections: [
      { title: 'Monte Carlo method', description: 'Using random numbers to solve problems that seem impossible.', type: 'application' },
      { title: 'Bayesian thinking', description: 'Update your beliefs when new evidence arrives.', type: 'concept' },
      { title: 'Quantum probability', description: 'At the smallest scale, nature itself is probabilistic.', type: 'frontier' },
    ],
  },
  {
    moduleId: 'carbon-cycle',
    connections: [
      { title: 'Carbon dating', description: 'Measuring carbon-14 tells us how old ancient objects are.', type: 'application' },
      { title: 'Climate change', description: 'Extra CO₂ in the atmosphere traps heat — the greenhouse effect.', type: 'frontier' },
      { title: 'Ancient atmosphere', description: 'Earth\'s air was once toxic. Life changed it.', type: 'history' },
    ],
  },
  {
    moduleId: 'number-systems',
    connections: [
      { title: 'Indian invention of zero', description: 'Zero as a number was invented in India around 500 CE.', type: 'history' },
      { title: 'Cryptography', description: 'Prime numbers and modular arithmetic keep your messages secret.', type: 'application' },
      { title: 'Imaginary numbers', description: '√-1 is not real — but it powers all of electrical engineering.', type: 'frontier' },
    ],
  },
  {
    moduleId: 'fermi-estimation',
    connections: [
      { title: 'Enrico Fermi', description: 'He estimated the atomic bomb yield from falling paper scraps.', type: 'history' },
      { title: 'Drake Equation', description: 'A Fermi estimate for alien civilizations — we still do not know.', type: 'frontier' },
      { title: 'Back-of-envelope thinking', description: 'Quick estimates prevent expensive mistakes in engineering.', type: 'application' },
    ],
  },
];

export interface CrossConceptBridge {
  id: string;
  fromModule: DiscoveryModule;
  toModule: DiscoveryModule;
  title: string;
  description: string;
  unlocksWhen: string;
}

export const DISCOVERY_CROSS_BRIDGES: CrossConceptBridge[] = [
  {
    id: 'algebra-chemistry',
    fromModule: 'algebra-scales',
    toModule: 'chemical-balancer',
    title: 'Equations in Chemistry',
    description: 'Balancing chemical equations IS solving algebra — atoms are variables.',
    unlocksWhen: 'Complete both algebra-scales and chemical-balancer',
  },
  {
    id: 'genetics-probability',
    fromModule: 'genetics-simulator',
    toModule: 'probability-sandbox',
    title: 'Inheritance is Probability',
    description: 'Punnett squares are probability tables in disguise.',
    unlocksWhen: 'Complete both genetics-simulator and probability-sandbox',
  },
  {
    id: 'carbon-cell',
    fromModule: 'carbon-cycle',
    toModule: 'cell-city',
    title: 'Carbon is Life',
    description: 'Every molecule in a cell contains carbon — the cycle powers the cell.',
    unlocksWhen: 'Complete both carbon-cycle and cell-city',
  },
  {
    id: 'geometry-physics',
    fromModule: 'geometry-proof',
    toModule: 'speed-distance-time',
    title: 'Graphs are Geometry',
    description: 'A speed-distance graph is a triangle — geometry explains motion.',
    unlocksWhen: 'Complete both geometry-proof and speed-distance-time',
  },
  {
    id: 'economics-probability',
    fromModule: 'economic-simulation',
    toModule: 'probability-sandbox',
    title: 'Markets are Probabilistic',
    description: 'Stock prices move by probability — not certainty.',
    unlocksWhen: 'Complete both economic-simulation and probability-sandbox',
  },
  {
    id: 'number-probability',
    fromModule: 'number-systems',
    toModule: 'probability-sandbox',
    title: 'Binary and Chance',
    description: 'Random number generation uses number theory — computers simulate chance.',
    unlocksWhen: 'Complete both number-systems and probability-sandbox',
  },
  {
    id: 'plate-carbon',
    fromModule: 'plate-tectonics',
    toModule: 'carbon-cycle',
    title: 'Volcanoes and Carbon',
    description: 'Volcanoes release carbon from deep Earth — tectonics drives the carbon cycle.',
    unlocksWhen: 'Complete both plate-tectonics and carbon-cycle',
  },
  {
    id: 'fermi-economics',
    fromModule: 'fermi-estimation',
    toModule: 'economic-simulation',
    title: 'Estimating Markets',
    description: 'Fermi estimation helps you size markets and understand economic scale.',
    unlocksWhen: 'Complete both fermi-estimation and economic-simulation',
  },
];

export const CHEMICAL_REACTIONS: ChemicalReaction[] = [
  {
    id: 'water',
    name: 'Water Formation',
    reactants: [{ formula: 'H₂', elements: [{ symbol: 'H', name: 'Hydrogen', color: '#60A5FA', count: 2 }], count: 2 }, { formula: 'O₂', elements: [{ symbol: 'O', name: 'Oxygen', color: '#F87171', count: 2 }], count: 1 }],
    products: [{ formula: 'H₂O', elements: [{ symbol: 'H', name: 'Hydrogen', color: '#60A5FA', count: 2 }, { symbol: 'O', name: 'Oxygen', color: '#F87171', count: 1 }], count: 2 }],
    animation: 'glow',
    realWorldContext: '2H₂ + O₂ → 2H₂O',
    indianRelevance: 'Hydrogen fuel cells could power India\'s clean energy future',
  },
  {
    id: 'photosynthesis',
    name: 'Photosynthesis',
    reactants: [{ formula: 'CO₂', elements: [{ symbol: 'C', name: 'Carbon', color: '#6B7280', count: 1 }, { symbol: 'O', name: 'Oxygen', color: '#F87171', count: 2 }], count: 6 }, { formula: 'H₂O', elements: [{ symbol: 'H', name: 'Hydrogen', color: '#60A5FA', count: 2 }, { symbol: 'O', name: 'Oxygen', color: '#F87171', count: 1 }], count: 6 }],
    products: [{ formula: 'C₆H₁₂O₆', elements: [{ symbol: 'C', name: 'Carbon', color: '#6B7280', count: 6 }, { symbol: 'H', name: 'Hydrogen', color: '#60A5FA', count: 12 }, { symbol: 'O', name: 'Oxygen', color: '#F87171', count: 6 }], count: 1 }, { formula: 'O₂', elements: [{ symbol: 'O', name: 'Oxygen', color: '#F87171', count: 2 }], count: 6 }],
    animation: 'glow',
    realWorldContext: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
    indianRelevance: 'India\'s agriculture depends on this reaction',
  },
  {
    id: 'rust',
    name: 'Rusting of Iron',
    reactants: [{ formula: 'Fe', elements: [{ symbol: 'Fe', name: 'Iron', color: '#9CA3AF', count: 1 }], count: 4 }, { formula: 'O₂', elements: [{ symbol: 'O', name: 'Oxygen', color: '#F87171', count: 2 }], count: 3 }],
    products: [{ formula: 'Fe₂O₃', elements: [{ symbol: 'Fe', name: 'Iron', color: '#9CA3AF', count: 2 }, { symbol: 'O', name: 'Oxygen', color: '#F87171', count: 3 }], count: 2 }],
    animation: 'smoke',
    realWorldContext: '4Fe + 3O₂ → 2Fe₂O₃',
    indianRelevance: 'Rusting costs India ₹80,000 crore annually in infrastructure damage',
  },
  {
    id: 'combustion',
    name: 'Methane Combustion',
    reactants: [{ formula: 'CH₄', elements: [{ symbol: 'C', name: 'Carbon', color: '#6B7280', count: 1 }, { symbol: 'H', name: 'Hydrogen', color: '#60A5FA', count: 4 }], count: 1 }, { formula: 'O₂', elements: [{ symbol: 'O', name: 'Oxygen', color: '#F87171', count: 2 }], count: 2 }],
    products: [{ formula: 'CO₂', elements: [{ symbol: 'C', name: 'Carbon', color: '#6B7280', count: 1 }, { symbol: 'O', name: 'Oxygen', color: '#F87171', count: 2 }], count: 1 }, { formula: 'H₂O', elements: [{ symbol: 'H', name: 'Hydrogen', color: '#60A5FA', count: 2 }, { symbol: 'O', name: 'Oxygen', color: '#F87171', count: 1 }], count: 2 }],
    animation: 'explosion',
    realWorldContext: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    indianRelevance: 'Natural gas (CNG) used in Indian buses runs on this reaction',
  },
];

export const GEOMETRY_THEOREMS: GeometryTheorem[] = [
  { id: 'triangle-angles', name: 'Triangle Angle Sum', statement: 'Angles add up to 180°', emoji: '📐', proofSteps: ['Draw a line parallel to one side', 'Alternate angles are equal', 'Three angles form a straight line = 180°'], interactiveType: 'triangle-angles' },
  { id: 'pythagorean', name: 'Pythagorean Theorem', statement: 'a² + b² = c² for right triangles', emoji: '📏', proofSteps: ['Draw squares on each side', 'Area of square on hypotenuse = sum of other two', 'Rearrange to show equality'], interactiveType: 'pythagorean' },
  { id: 'circle-tangent', name: 'Tangent-Radius Theorem', statement: 'A tangent is perpendicular to the radius at the point of contact', emoji: '⭕', proofSteps: ['Assume it is not perpendicular', 'Draw a shorter line — contradiction', 'Therefore it must be perpendicular'], interactiveType: 'circle-theorem' },
];

export const GENETIC_TRAITS: GeneticTrait[] = [
  { id: 'eye-color', name: 'Eye Color', emoji: '👁️', dominantAllele: 'B', recessiveAllele: 'b', dominantPhenotype: 'Brown', recessivePhenotype: 'Blue', exampleContext: 'B is dominant over b' },
  { id: 'tongue-rolling', name: 'Tongue Rolling', emoji: '👅', dominantAllele: 'R', recessiveAllele: 'r', dominantPhenotype: 'Can roll', recessivePhenotype: 'Cannot roll', exampleContext: 'About 70% of people can roll their tongue' },
  { id: 'earlobes', name: 'Earlobe Attachment', emoji: '👂', dominantAllele: 'F', recessiveAllele: 'f', dominantPhenotype: 'Free earlobes', recessivePhenotype: 'Attached earlobes', exampleContext: 'Free earlobes are dominant' },
  { id: 'dimples', name: 'Dimples', emoji: '😊', dominantAllele: 'D', recessiveAllele: 'd', dominantPhenotype: 'Has dimples', recessivePhenotype: 'No dimples', exampleContext: 'Dimples are a dominant trait' },
];

export interface AlgebraChallenge { id: string; equation: string; solution: number; hint: string; difficulty: 1|2|3; parts: any; unknownSide: string; twoVariables?: boolean; }
export const ALGEBRA_CHALLENGES: AlgebraChallenge[] = [
  { id: 'alg1', equation: 'x + 5 = 12', solution: 7, hint: 'Remove 5 from both sides', difficulty: 1, parts: {}, unknownSide: 'left' },
  { id: 'alg2', equation: '2x = 16', solution: 8, hint: 'Divide by 2', difficulty: 1, parts: {}, unknownSide: 'left' },
  { id: 'alg3', equation: '3x - 4 = 11', solution: 5, hint: 'First add 4, then divide by 3', difficulty: 2, parts: {}, unknownSide: 'left' },
  { id: 'alg4', equation: 'x/2 + 3 = 7', solution: 8, hint: 'Subtract 3 first, then multiply by 2', difficulty: 2, parts: {}, unknownSide: 'left' },
  { id: 'alg5', equation: '5x + 2 = 3x + 10', solution: 4, hint: 'Move all x to one side, numbers to the other', difficulty: 2, parts: {}, unknownSide: 'both' },
  { id: 'alg6', equation: '2(x + 3) = 16', solution: 5, hint: 'Expand the bracket first', difficulty: 2, parts: {}, unknownSide: 'left' },
  { id: 'alg7', equation: 'x² = 49', solution: 7, hint: 'What number squared gives 49?', difficulty: 3, parts: {}, unknownSide: 'left' },
  { id: 'alg8', equation: '4x - 3 = 2x + 7', solution: 5, hint: 'Collect x terms on one side', difficulty: 3, parts: {}, unknownSide: 'both' },
];
