"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEEDBACK_LOOPS = exports.TRIG_IDENTITIES = exports.POLICY_DECISIONS = exports.INDICATORS = exports.ESSAY_PROMPTS = exports.ENVIRONMENTS = exports.ELECTROLYSIS_SETUPS = exports.CURVES = exports.TRIG_MEMORY_AIDS = exports.SPECIAL_ANGLES = exports.BEAUTY_MOMENTS = exports.ACADEMY_MODULES = void 0;
exports.calculateTrigPoint = calculateTrigPoint;
exports.ACADEMY_MODULES = [
    { id: 'trigonometry-circle', title: 'Trigonometry Unit Circle', emoji: '⭕', subject: 'mathematics', color: '#F59E0B', path: 'trigonometry', hook: 'Drag a point on a circle — watch waves write themselves', beauty: 'One rotating point generates all waves in nature', realFuture: 'Sound engineers use this daily', examRelevance: 'CBSE Class 11 Ch.3: Trigonometric Functions', examQuestions: [{ id: 'trig-q1', board: 'CBSE', year: 2023, question: 'Find sin(π/6) + cos(π/3)', options: ['0', '1', '½', '√3/2'], correctIndex: 1, markscheme: 'sin(π/6)=½, cos(π/3)=½. Sum=1.', marks: 2, topic: 'Trig values' }] },
    { id: 'projectile-motion', title: 'Projectile Motion Lab', emoji: '🚀', subject: 'physics', color: '#0EA5E9', path: 'projectile-motion', hook: 'Find the angle that maximises range', beauty: 'Horizontal and vertical motion are independent', realFuture: 'ISRO calculates every trajectory this way', examRelevance: 'CBSE Class 11 Physics Ch.5', examQuestions: [{ id: 'proj-q1', board: 'JEE', question: 'At what angle for maximum range?', options: ['30°', '45°', '60°', '90°'], correctIndex: 1, markscheme: 'R=u²sin(2θ)/g. Max when 2θ=90°, θ=45°', marks: 4, topic: 'Maximum range' }] },
    { id: 'wave-interference', title: 'Wave Interference', emoji: '🌊', subject: 'physics', color: '#8B5CF6', path: 'wave-interference', hook: 'Place two sources — watch the pattern compute itself', beauty: 'Waves can cancel yet both still exist', realFuture: 'Noise-cancelling headphones use this', examRelevance: 'CBSE Class 12 Physics Ch.10', examQuestions: [{ id: 'wave-q1', board: 'CBSE', question: 'Condition for constructive interference?', options: ['nλ', '(2n+1)λ/2', '0', 'Equal amplitudes'], correctIndex: 0, markscheme: 'Path difference = nλ', marks: 2, topic: 'Interference conditions' }] },
    { id: 'derivatives-visual', title: 'Derivatives & Slope', emoji: '📉', subject: 'mathematics', color: '#EC4899', path: 'derivatives', hook: 'Drag a point along any curve — watch slope become a function', beauty: 'Derivative is the curve\'s instantaneous direction', realFuture: 'ML optimisation uses derivatives billions of times/sec', examRelevance: 'CBSE Class 12 Maths Ch.5', examQuestions: [{ id: 'deriv-q1', board: 'CBSE', question: 'Find dy/dx if y = x³ + 3x² - 5x + 2', markscheme: 'dy/dx = 3x² + 6x - 5', marks: 3, topic: 'Power rule' }] },
    { id: 'redox-reactions', title: 'Redox Reactions', emoji: '🔋', subject: 'chemistry', color: '#10B981', path: 'redox-reactions', hook: 'Electrons travel from one atom to another — that is electricity', beauty: 'Rust, fire, batteries are all the same process', realFuture: 'EV battery engineers work with this daily', examRelevance: 'CBSE Class 11 Chemistry Ch.8', examQuestions: [{ id: 'redox-q1', board: 'CBSE', question: 'Oxidising agent in: Zn + CuSO₄ → ZnSO₄ + Cu', options: ['Zn', 'CuSO₄', 'ZnSO₄', 'Cu'], correctIndex: 1, markscheme: 'Cu²⁺ gains electrons = oxidising agent', marks: 2, topic: 'Oxidising agents' }] },
    { id: 'dna-synthesis', title: 'DNA and Protein Synthesis', emoji: '🧬', subject: 'biology', color: '#EF4444', path: 'dna-synthesis', hook: 'One changed base pair can alter an entire protein', beauty: 'The same 4-letter code wrote every living thing', realFuture: 'CRISPR engineers edit genomes gene by gene', examRelevance: 'CBSE Class 12 Biology Ch.6', examQuestions: [{ id: 'dna-q1', board: 'NEET', question: 'Which enzyme unwinds the double helix?', options: ['DNA Polymerase', 'Helicase', 'Ligase', 'Primase'], correctIndex: 1, markscheme: 'Helicase breaks hydrogen bonds', marks: 4, topic: 'DNA replication' }] },
    { id: 'electrolysis', title: 'Electrolysis', emoji: '⚡', subject: 'chemistry', color: '#F59E0B', path: 'electrolysis', hook: 'Energy forces reactions backwards', beauty: 'Energy can reverse chemistry', realFuture: 'Green hydrogen uses electrolysis', examRelevance: 'CBSE Class 12 Chemistry Ch.3', examQuestions: [] },
    { id: 'natural-selection', title: 'Natural Selection', emoji: '🦎', subject: 'biology', color: '#22C55E', path: 'natural-selection', hook: 'Run 10 generations — watch population shift', beauty: 'Complexity from the simplest rule', realFuture: 'Antibiotic resistance is evolution in real time', examRelevance: 'CBSE Class 12 Biology Ch.7', examQuestions: [] },
    { id: 'essay-architect', title: 'Essay Architect', emoji: '✍️', subject: 'english', color: '#A78BFA', path: 'essay-architect', hook: 'Structure your argument before you write', beauty: 'A well-structured argument is elegant mathematics', realFuture: 'Every professional communicates structured arguments', examRelevance: 'CBSE Class 12 English Writing', examQuestions: [] },
    { id: 'economic-indicators', title: 'Economic Indicators', emoji: '📊', subject: 'economics', color: '#84CC16', path: 'economic-indicators', hook: 'Understand why the RBI raises interest rates', beauty: 'An entire economy described by six numbers', realFuture: 'Every business decision reads economic signals', examRelevance: 'CBSE Class 12 Economics Ch.2', examQuestions: [] },
    { id: 'trig-identities', title: 'Trigonometric Identities', emoji: '📐', subject: 'mathematics', color: '#06B6D4', path: 'trig-identities', hook: 'Prove sin²θ + cos²θ = 1 using geometry', beauty: 'Every identity is geometric truth as algebra', realFuture: 'Signal processing uses trig identities constantly', examRelevance: 'CBSE Class 11 Maths Ch.3', examQuestions: [] },
    { id: 'climate-systems', title: 'Climate Systems', emoji: '🌡️', subject: 'physics', color: '#F97316', path: 'climate-systems', hook: 'Adjust one parameter — watch feedback loops cascade', beauty: 'Earth\'s climate is nonlinear — small changes cascade', realFuture: 'Climate scientists build these models for global policy', examRelevance: 'CBSE Class 11 Geography Ch.10', examQuestions: [] },
];
exports.BEAUTY_MOMENTS = {
    'trigonometry-circle': 'One point moving in a circle generates every wave in nature.',
    'projectile-motion': 'Horizontal and vertical motion are completely independent.',
    'wave-interference': 'Two waves can cancel each other — yet both still exist.',
    'derivatives-visual': 'The derivative of position is velocity. Of velocity is acceleration. One operation, three concepts.',
    'redox-reactions': 'Rust, fire, and batteries are all the same reaction at different speeds.',
    'dna-synthesis': 'Four bases. Twenty amino acids. Every living thing runs on this code.',
    'electrolysis': 'With electricity, you can run chemistry backwards.',
    'natural-selection': 'No one planned anything. The environment kept what worked.',
    'essay-architect': 'A perfectly structured argument has the elegance of a mathematical proof.',
    'economic-indicators': 'Six numbers describe the health of 1.4 billion people.',
    'trig-identities': 'sin²θ + cos²θ = 1 is Pythagoras wearing trigonometry\'s clothes.',
    'climate-systems': 'The Earth is a system of systems. Small changes cascade.',
};
function calculateTrigPoint(deg) {
    const rad = (deg * Math.PI) / 180;
    return { angle: deg, radians: rad, sinValue: Math.round(Math.sin(rad) * 10000) / 10000, cosValue: Math.round(Math.cos(rad) * 10000) / 10000, tanValue: Math.abs(Math.tan(rad)) > 1000 ? null : Math.round(Math.tan(rad) * 10000) / 10000, quadrant: (deg >= 0 && deg < 90 ? 1 : deg >= 90 && deg < 180 ? 2 : deg >= 180 && deg < 270 ? 3 : 4) };
}
exports.SPECIAL_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
exports.TRIG_MEMORY_AIDS = [
    { angle: 0, sin: '0', cos: '1', tan: '0' },
    { angle: 30, sin: '½', cos: '√3/2', tan: '1/√3' },
    { angle: 45, sin: '√2/2', cos: '√2/2', tan: '1' },
    { angle: 60, sin: '√3/2', cos: '½', tan: '√3' },
    { angle: 90, sin: '1', cos: '0', tan: 'undef' },
];
exports.CURVES = [
    { id: 'cubic', label: 'Cubic', expression: 'y = x³ - 3x', fn: x => x * x * x - 3 * x, derivative: x => 3 * x * x - 3, domain: [-2.5, 2.5] },
    { id: 'quadratic', label: 'Quadratic', expression: 'y = x² - 4', fn: x => x * x - 4, derivative: x => 2 * x, domain: [-3, 3] },
    { id: 'sine', label: 'Sine', expression: 'y = sin(x)', fn: x => Math.sin(x), derivative: x => Math.cos(x), domain: [-2 * Math.PI, 2 * Math.PI] },
];
exports.ELECTROLYSIS_SETUPS = [
    { id: 'water', name: 'Water Electrolysis', electrolyte: 'Dilute H₂SO₄', cathodeProduct: 'H₂', anodeProduct: 'O₂', industrialUse: 'Green hydrogen fuel production', indianContext: 'India targets 5 MT/year green hydrogen by 2030', emoji: '💧' },
    { id: 'copper', name: 'Copper Sulfate', electrolyte: 'CuSO₄ solution', cathodeProduct: 'Cu deposit', anodeProduct: 'O₂', industrialUse: 'Electroplating jewellery and machine parts', indianContext: 'Indian jewellery industry uses electroplating extensively', emoji: '🔩' },
    { id: 'brine', name: 'Brine', electrolyte: 'NaCl solution', cathodeProduct: 'H₂', anodeProduct: 'Cl₂', industrialUse: 'Chlorine for water treatment and PVC', indianContext: 'India is a major chlorine producer for water treatment', emoji: '🧂' },
];
exports.ENVIRONMENTS = [
    { id: 'arctic', name: 'Arctic Ice', emoji: '❄️', favored: 'white', indian: 'Snow leopards in Himalayas have pale coats' },
    { id: 'forest', name: 'Dark Forest', emoji: '🌲', favored: 'dark', indian: 'Black leopard thrives in dense Indian forests' },
    { id: 'grassland', name: 'Indian Grassland', emoji: '🌾', favored: 'tawny', indian: 'Tiger stripes match tall dry grass' },
];
exports.ESSAY_PROMPTS = [
    { id: 'tech', title: 'Technology: Boon or Bane?', prompt: 'Is technology making human life better or worse overall?', examinerTip: 'Explore both sides and build a real counter-argument.' },
    { id: 'india', title: 'India: Developing or Emerged?', prompt: 'Is India still developing, or has it emerged?', examinerTip: 'Define developed before arguing.' },
    { id: 'ai', title: 'AI in Examinations', prompt: 'Should AI tools be allowed in school examinations?', examinerTip: 'Your rebuttal must be specific.' },
];
exports.INDICATORS = [
    { id: 'gdp', name: 'GDP Growth', emoji: '📈', value: 7, unit: '%' },
    { id: 'inflation', name: 'Inflation', emoji: '💸', value: 5.1, unit: '%' },
    { id: 'unemployment', name: 'Unemployment', emoji: '👷', value: 7.8, unit: '%' },
    { id: 'repo', name: 'RBI Repo Rate', emoji: '🏦', value: 6.5, unit: '%' },
];
exports.POLICY_DECISIONS = [
    { id: 'rate-hike', name: 'RBI Rate Hike', emoji: '📊', gdp: -0.5, inflation: -0.8, note: 'Controls inflation but slows growth.' },
    { id: 'infra', name: 'Infrastructure Boost', emoji: '🏗️', gdp: 1.2, inflation: 0.5, note: 'Creates jobs but raises spending.' },
    { id: 'tax-cut', name: 'Corporate Tax Cut', emoji: '💼', gdp: 0.8, inflation: 0.2, note: 'Encourages investment but reduces revenue.' },
];
exports.TRIG_IDENTITIES = [
    { id: 'pythagorean', name: 'Pythagorean Identity', statement: 'sin²θ + cos²θ = 1', proof: ['On unit circle: sin θ = y, cos θ = x', 'x² + y² = 1', 'Therefore sin²θ + cos²θ = 1'] },
    { id: 'tangent', name: 'Tangent Identity', statement: 'tan θ = sin θ / cos θ', proof: ['tan θ = opposite / adjacent', 'opposite = sin θ', 'adjacent = cos θ'] },
    { id: 'double-sin', name: 'Double Angle', statement: 'sin(2θ) = 2sinθcosθ', proof: ['sin(A+B)=sinAcosB+cosAsinB', 'Set A=B=θ', 'sin(2θ)=2sinθcosθ'] },
];
exports.FEEDBACK_LOOPS = [
    { id: 'ice', name: 'Ice-Albedo Feedback', emoji: '🧊↔️🌡️', type: 'positive', india: 'Himalayan glacier melt threatens water supply' },
    { id: 'vapour', name: 'Water Vapour Feedback', emoji: '💧↔️🌡️', type: 'positive', india: 'More extreme Indian monsoons' },
    { id: 'cloud', name: 'Cloud Feedback', emoji: '☁️↔️🌡️', type: 'negative', india: 'Cloud uncertainty complicates India projections' },
];
