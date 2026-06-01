// src/worlds/tiny/companions/firefly.ts
// Firefly companion for Day and Night — glows at night

export const FIREFLY = {
  emoji: '✨',
  nightEmoji: '✨',
  dayEmoji: '🪲',
  defaultPosition: { x: 0.85, y: 0.55 },
  size: 44,
  idleBounceFreq: 3.0,
  happyBounceHeight: 15,
  celebrationSpinSpeed: 6,
} as const;
