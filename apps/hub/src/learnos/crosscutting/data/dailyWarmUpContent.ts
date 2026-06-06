// src/crosscutting/data/dailyWarmUpContent.ts

export interface WarmUpChallenge {
  id: string;
  theme: string;
  type: 'visual' | 'quiz' | 'observation' | 'creative';
  question: string;
  options?: string[];
  correctIndex?: number;
  prompt?: string;
  estimatedMinutes: number;
  ageAdaptations: Record<string, string>;
}

export const DAILY_WARMUPS: WarmUpChallenge[] = [
  {
    id: 'why-sky-blue',
    theme: 'Why is the sky blue?',
    type: 'quiz',
    question: 'What makes the sky appear blue during the day?',
    options: [
      'The ocean reflects onto the sky',
      'Blue light scatters more than other colors in air',
      'The sun emits mostly blue light',
      'Clouds are blue',
    ],
    correctIndex: 1,
    estimatedMinutes: 3,
    ageAdaptations: {
      tiny: 'Tap the blue sky! 🌤️',
      early: 'Why do you think the sky is blue? Is it because of the ocean?',
      lab: 'Light scatters differently based on wavelength. Which color scatters most?',
      discovery: 'Rayleigh scattering: intensity ∝ 1/λ⁴. What does this mean for blue vs red light?',
      academy: 'Derive the Rayleigh scattering cross-section. Why does sunset appear red?',
      explorer: 'The physics of atmospheric scattering — and why other planets have different sky colors.',
    },
  },
  {
    id: 'fraction-pizza',
    theme: 'Sharing a pizza',
    type: 'visual',
    question: 'If you cut a pizza into 8 slices and eat 3, what fraction is left?',
    options: ['3/8', '5/8', '1/2', '3/5'],
    correctIndex: 1,
    estimatedMinutes: 3,
    ageAdaptations: {
      tiny: 'Count the pizza slices! 🍕',
      early: 'You have 8 slices. You eat 3. How many are left?',
      lab: 'Express the remaining portion as a fraction, decimal, and percentage.',
      discovery: 'If 3 people share 5/8 of a pizza equally, what fraction does each get?',
      academy: 'Prove that 5/8 = 0.625 using long division. What pattern emerges?',
      explorer: 'Fractions in cooking: scaling recipes up and down.',
    },
  },
  {
    id: 'plant-growth',
    theme: 'How do plants grow?',
    type: 'observation',
    question: 'What does a plant need to grow?',
    options: ['Only water', 'Only sunlight', 'Water, sunlight, and air', 'Only soil'],
    correctIndex: 2,
    estimatedMinutes: 3,
    ageAdaptations: {
      tiny: 'What does a flower need? ☀️💧',
      early: 'Plants need water and sunlight. What else?',
      lab: 'Name the three inputs of photosynthesis.',
      discovery: 'Write the balanced equation for photosynthesis. Where does the mass come from?',
      academy: 'Explain the light-dependent and light-independent reactions of photosynthesis.',
      explorer: 'How understanding photosynthesis led to the green revolution in agriculture.',
    },
  },
  {
    id: 'gravity-fall',
    theme: 'Why do things fall?',
    type: 'creative',
    question: 'If you drop a feather and a rock on the Moon, which hits first?',
    prompt: 'Think about what gravity does and whether air matters.',
    estimatedMinutes: 3,
    ageAdaptations: {
      tiny: 'Watch things fall! ⬇️',
      early: 'On Earth, a rock falls faster than a feather. Why? What about on the Moon?',
      lab: 'Without air resistance, do heavy and light objects fall at the same rate?',
      discovery: 'Galileo showed all objects fall at the same rate in vacuum. How did he prove this?',
      academy: 'Derive the equation of motion for free fall. Why is g ≈ 9.8 m/s²?',
      explorer: 'Einstein realized gravity is not a force — it is curved spacetime.',
    },
  },
  {
    id: 'water-states',
    theme: 'Water can be solid, liquid, or gas',
    type: 'quiz',
    question: 'At what temperature does water boil at sea level?',
    options: ['50°C', '100°C', '150°C', '200°C'],
    correctIndex: 1,
    estimatedMinutes: 3,
    ageAdaptations: {
      tiny: 'Hot water makes steam! ♨️',
      early: 'When water gets very hot, it turns into steam. At what temperature?',
      lab: 'What happens to water molecules when temperature increases?',
      discovery: 'Why does water boil at lower temperatures on a mountain?',
      academy: 'Explain the phase diagram of water. What is the triple point?',
      explorer: 'How pressure cookers work — and why cooking is harder at high altitude.',
    },
  },
  {
    id: 'number-pattern',
    theme: 'Number patterns',
    type: 'quiz',
    question: 'What comes next: 2, 4, 8, 16, ...?',
    options: ['24', '30', '32', '36'],
    correctIndex: 2,
    estimatedMinutes: 3,
    ageAdaptations: {
      tiny: 'Count by twos! 2, 4, 6... 🔢',
      early: 'Each number is double the previous one. What comes after 16?',
      lab: 'This is 2ⁿ. What is 2⁶? What about 2¹⁰?',
      discovery: 'This pattern appears in cell division, computer memory, and compound interest.',
      academy: 'Prove by induction that the sum of 2⁰ + 2¹ + ... + 2ⁿ = 2ⁿ⁺¹ - 1.',
      explorer: 'Exponential growth: why it is the most powerful force in the universe.',
    },
  },
  {
    id: 'magnet-sort',
    theme: 'What sticks to magnets?',
    type: 'observation',
    question: 'Which of these is attracted to a magnet?',
    options: ['Wood', 'Plastic', 'Iron nail', 'Glass'],
    correctIndex: 2,
    estimatedMinutes: 3,
    ageAdaptations: {
      tiny: 'What does the magnet pick up? 🧲',
      early: 'Try different objects. Which ones stick to the magnet?',
      lab: 'Why is iron magnetic but aluminum is not?',
      discovery: 'What are magnetic domains? Why can you demagnetize a magnet by heating it?',
      academy: 'Explain ferromagnetism using electron spin and exchange interaction.',
      explorer: 'How MRI machines use magnetic fields to see inside your body.',
    },
  },
];

export const WARMUP_STREAK_KEY = 'learnos-warmup-streak';

export function getTodayWarmup(): WarmUpChallenge {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_WARMUPS[dayOfYear % DAILY_WARMUPS.length];
}

export function getStreak(): number {
  const stored = localStorage.getItem(WARMUP_STREAK_KEY);
  if (!stored) return 0;
  try {
    const { count, lastDate } = JSON.parse(stored);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastDate === today) return count;
    if (lastDate === yesterday) return count;
    return 0;
  } catch (e) {
    console.warn('Failed to parse warmup streak', e);
    return 0;
  }
}

export function incrementStreak(): number {
  const current = getStreak();
  const today = new Date().toDateString();
  const newCount = current + 1;
  localStorage.setItem(WARMUP_STREAK_KEY, JSON.stringify({ count: newCount, lastDate: today }));
  return newCount;
}
