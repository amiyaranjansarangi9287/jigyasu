// src/crosscutting/data/conceptGossipContent.ts

export interface ConceptConversation {
  id: string;
  conceptA: string;
  conceptB: string;
  emojiA: string;
  emojiB: string;
  dialogue: string[];
  unlocksWhen: string;
}

export const CONCEPT_GOSSIPS: ConceptConversation[] = [
  {
    id: 'gravity-orbits',
    conceptA: 'Gravity',
    conceptB: 'Orbits',
    emojiA: '🍎',
    emojiB: '🌙',
    dialogue: [
      'Gravity: "I pull everything toward me."',
      'Orbits: "But you let me go around and around!"',
      'Gravity: "That is because you are moving sideways fast enough."',
      'Orbits: "So falling and flying are the same thing?"',
      'Gravity: "Exactly. An orbit is just falling with style."',
    ],
    unlocksWhen: 'After exploring gravity',
  },
  {
    id: 'photosynthesis-respiration',
    conceptA: 'Photosynthesis',
    conceptB: 'Breathing',
    emojiA: '🌿',
    emojiB: '🫁',
    dialogue: [
      'Photosynthesis: "I make food from sunlight, water, and air."',
      'Breathing: "I take in air and release energy from food."',
      'Photosynthesis: "We are opposites! I make sugar, you break it."',
      'Breathing: "And I release the CO₂ that you need!"',
      'Photosynthesis: "We are a perfect team — plants and animals."',
    ],
    unlocksWhen: 'After exploring plants or breathing',
  },
  {
    id: 'fractions-decimals',
    conceptA: 'Fractions',
    conceptB: 'Decimals',
    emojiA: '🍕',
    emojiB: '🔢',
    dialogue: [
      'Fractions: "I show parts of a whole. Like 1/2 of a pizza."',
      'Decimals: "I do the same thing! 1/2 = 0.5"',
      'Fractions: "But I am better for sharing — half is clearer than 0.5!"',
      'Decimals: "But I am better for measuring — 0.75 meters is precise."',
      'Fractions: "We are just different languages for the same idea."',
    ],
    unlocksWhen: 'After exploring fractions',
  },
  {
    id: 'magnetism-electricity',
    conceptA: 'Magnetism',
    conceptB: 'Electricity',
    emojiA: '🧲',
    emojiB: '⚡',
    dialogue: [
      'Magnetism: "I can push and pull without touching."',
      'Electricity: "Me too! But I can also make light and heat."',
      'Magnetism: "Did you know moving me creates you?"',
      'Electricity: "And moving me creates you! We are family."',
      'Magnetism: "Together we are electromagnetism — one of the four fundamental forces."',
    ],
    unlocksWhen: 'After exploring magnetism or electricity',
  },
  {
    id: 'water-cycle-clouds',
    conceptA: 'Water Cycle',
    conceptB: 'Clouds',
    emojiA: '💧',
    emojiB: '☁️',
    dialogue: [
      'Water Cycle: "I move water from ocean to sky to land and back."',
      'Clouds: "I am the sky part of your journey!"',
      'Water Cycle: "You are where water vapor becomes liquid again."',
      'Clouds: "And when I get too heavy, I rain — and you continue."',
      'Water Cycle: "Every raindrop has been through me millions of times."',
    ],
    unlocksWhen: 'After exploring water cycle',
  },
  {
    id: 'evolution-dna',
    conceptA: 'Evolution',
    conceptB: 'DNA',
    emojiA: '🦎',
    emojiB: '🧬',
    dialogue: [
      'Evolution: "I change species over millions of years."',
      'DNA: "I am the instruction manual you edit."',
      'Evolution: "Small changes in you add up to big changes in life."',
      'DNA: "A single letter change in my code can make a new trait."',
      'Evolution: "And if that trait helps survival, I keep it. That is natural selection."',
    ],
    unlocksWhen: 'After exploring evolution',
  },
  {
    id: 'states-matter-temperature',
    conceptA: 'States of Matter',
    conceptB: 'Temperature',
    emojiA: '🧊',
    emojiB: '🌡️',
    dialogue: [
      'States of Matter: "I can be solid, liquid, or gas."',
      'Temperature: "I decide which one you are!"',
      'States of Matter: "Heat me up and I melt. Cool me down and I freeze."',
      'Temperature: "I am really measuring how fast your molecules move."',
      'States of Matter: "So temperature is not a thing — it is motion."',
    ],
    unlocksWhen: 'After exploring states of matter',
  },
  {
    id: 'probability-statistics',
    conceptA: 'Probability',
    conceptB: 'Statistics',
    emojiA: '🎲',
    emojiB: '📊',
    dialogue: [
      'Probability: "I predict what might happen."',
      'Statistics: "I describe what did happen."',
      'Probability: "I say a coin has 50% chance of heads."',
      'Statistics: "I flip it 100 times and count — was it close to 50?"',
      'Probability: "Together we help us understand uncertainty."',
    ],
    unlocksWhen: 'After exploring probability',
  },
  {
    id: 'light-sound',
    conceptA: 'Light',
    conceptB: 'Sound',
    emojiA: '💡',
    emojiB: '🔊',
    dialogue: [
      'Light: "I travel at 300,000 km per second."',
      'Sound: "I travel at only 340 meters per second."',
      'Light: "That is why you see lightning before you hear thunder."',
      'Sound: "But I can travel through walls. You cannot."',
      'Light: "We are both waves — just very different kinds."',
    ],
    unlocksWhen: 'After exploring light or sound',
  },
  {
    id: 'energy-force',
    conceptA: 'Energy',
    conceptB: 'Force',
    emojiA: '⚡',
    emojiB: '💪',
    dialogue: [
      'Energy: "I am the ability to do work."',
      'Force: "I am a push or a pull."',
      'Energy: "When you push something, you transfer energy to it."',
      'Force: "And energy tells you how far that push will go."',
      'Energy: "We are two sides of the same coin — motion and change."',
    ],
    unlocksWhen: 'After exploring force or energy',
  },
];
