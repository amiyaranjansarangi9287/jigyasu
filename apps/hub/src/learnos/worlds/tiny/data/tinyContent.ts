// src/worlds/tiny/data/tinyContent.ts

import type { TinyModuleMetadata } from '../types/tiny.types';

export const TINY_MODULES: TinyModuleMetadata[] = [
  {
    id: 'tap-world',
    emoji: '🐾',
    sceneBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    companion: 'bunny',
    gardenItem: 'animal_flower',
    gardenEmoji: '🌸',
  },
  {
    id: 'color-mixer',
    emoji: '🎨',
    sceneBg: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
    companion: 'chameleon',
    gardenItem: 'color_splash',
    gardenEmoji: '🌈',
  },
  {
    id: 'shape-sorter',
    emoji: '🔷',
    sceneBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    companion: 'elephant',
    gardenItem: 'shape_sculpture',
    gardenEmoji: '⭐',
  },
  {
    id: 'animal-orchestra',
    emoji: '🎵',
    sceneBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    companion: 'peacock',
    gardenItem: 'music_butterfly',
    gardenEmoji: '🦋',
  },
  {
    id: 'bubble-world',
    emoji: '🫧',
    sceneBg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    companion: 'otter',
    gardenItem: 'glass_bubble',
    gardenEmoji: '🔮',
  },
  {
    id: 'weather-maker',
    emoji: '⛅',
    sceneBg: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)',
    companion: 'bear',
    gardenItem: 'weather_vane',
    gardenEmoji: '🌦️',
  },
  {
    id: 'farm-friends',
    emoji: '🐄',
    sceneBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    companion: 'chick',
    gardenItem: 'animal_home',
    gardenEmoji: '🏡',
  },
  {
    id: 'day-and-night',
    emoji: '🌅',
    sceneBg: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
    companion: 'firefly',
    gardenItem: 'lantern',
    gardenEmoji: '🏮',
  },
];

export const TAP_ANIMALS = [
  { emoji: '🐘', sound: { freq: 60, type: 'sine' as OscillatorType, duration: 0.8 }, color: '#9CA3AF', label: 'elephant' },
  { emoji: '🦁', sound: { freq: 120, type: 'sawtooth' as OscillatorType, duration: 0.4 }, color: '#D97706', label: 'lion' },
  { emoji: '🦋', sound: { freq: 800, type: 'triangle' as OscillatorType, duration: 0.2 }, color: '#EC4899', label: 'butterfly' },
  { emoji: '🐸', sound: { freq: 180, type: 'square' as OscillatorType, duration: 0.15 }, color: '#22C55E', label: 'frog' },
  { emoji: '🐦', sound: { freq: 1200, type: 'triangle' as OscillatorType, duration: 0.2 }, color: '#3B82F6', label: 'bird' },
  { emoji: '🐄', sound: { freq: 80, type: 'sine' as OscillatorType, duration: 0.6 }, color: '#92400E', label: 'cow' },
  { emoji: '🐑', sound: { freq: 400, type: 'sine' as OscillatorType, duration: 0.3 }, color: '#F3F4F6', label: 'sheep' },
  { emoji: '🦒', sound: { freq: 90, type: 'sine' as OscillatorType, duration: 0.5 }, color: '#F59E0B', label: 'giraffe' },
  { emoji: '🐠', sound: { freq: 300, type: 'sine' as OscillatorType, duration: 0.1 }, color: '#F97316', label: 'fish' },
  { emoji: '🐢', sound: { freq: 50, type: 'sine' as OscillatorType, duration: 1.0 }, color: '#4ADE80', label: 'turtle' },
  { emoji: '🐝', sound: { freq: 240, type: 'sawtooth' as OscillatorType, duration: 0.2 }, color: '#FCD34D', label: 'bee' },
  { emoji: '🐇', sound: { freq: 600, type: 'triangle' as OscillatorType, duration: 0.15 }, color: '#FCA5A5', label: 'rabbit' },
];

export const MIXER_COLORS = {
  red: { hex: '#FF4444', rgb: { r: 255, g: 68, b: 68 } },
  blue: { hex: '#4444FF', rgb: { r: 68, g: 68, b: 255 } },
  yellow: { hex: '#FFDD00', rgb: { r: 255, g: 221, b: 0 } },
} as const;

export const COLOR_MIXES: Record<string, {
  result: string;
  resultHex: string;
  sound: { freqs: number[]; type: OscillatorType };
  emoji: string;
}> = {
  'red+blue': { result: 'purple', resultHex: '#8844FF', sound: { freqs: [220, 277, 330], type: 'sine' }, emoji: '💜' },
  'blue+red': { result: 'purple', resultHex: '#8844FF', sound: { freqs: [220, 277, 330], type: 'sine' }, emoji: '💜' },
  'blue+yellow': { result: 'green', resultHex: '#44AA44', sound: { freqs: [261, 329, 392], type: 'sine' }, emoji: '💚' },
  'yellow+blue': { result: 'green', resultHex: '#44AA44', sound: { freqs: [261, 329, 392], type: 'sine' }, emoji: '💚' },
  'red+yellow': { result: 'orange', resultHex: '#FF8800', sound: { freqs: [330, 415, 494], type: 'sine' }, emoji: '🧡' },
  'yellow+red': { result: 'orange', resultHex: '#FF8800', sound: { freqs: [330, 415, 494], type: 'sine' }, emoji: '🧡' },
  'red+blue+yellow': { result: 'brown', resultHex: '#8B6914', sound: { freqs: [150, 200, 180], type: 'sawtooth' }, emoji: '🤎' },
};

export const SHAPES = [
  { id: 'circle' as const, emoji: '⭕', color: '#FF6B6B', personality: 'bouncy', soundFreq: 523, idleAnimation: 'bounce' },
  { id: 'square' as const, emoji: '🟦', color: '#4ECDC4', personality: 'sturdy', soundFreq: 392, idleAnimation: 'nod' },
  { id: 'triangle' as const, emoji: '🔺', color: '#FFE66D', personality: 'shy', soundFreq: 659, idleAnimation: 'tremble' },
  { id: 'star' as const, emoji: '⭐', color: '#A855F7', personality: 'dramatic', soundFreq: 784, idleAnimation: 'spin' },
];

export const ORCHESTRA_ANIMALS = [
  { emoji: '🐸', note: 261, label: 'frog', waveform: 'triangle' as OscillatorType, position: { x: 0.15, y: 0.65 } },
  { emoji: '🐮', note: 329, label: 'cow', waveform: 'sine' as OscillatorType, position: { x: 0.30, y: 0.70 } },
  { emoji: '🐔', note: 392, label: 'chicken', waveform: 'square' as OscillatorType, position: { x: 0.45, y: 0.68 } },
  { emoji: '🐱', note: 440, label: 'cat', waveform: 'sine' as OscillatorType, position: { x: 0.60, y: 0.65 } },
  { emoji: '🦜', note: 523, label: 'parrot', waveform: 'triangle' as OscillatorType, position: { x: 0.75, y: 0.60 } },
  { emoji: '🐶', note: 659, label: 'dog', waveform: 'square' as OscillatorType, position: { x: 0.85, y: 0.68 } },
];

// === BUBBLE WORLD CONTENT ===

export const BUBBLE_CONTENT = {
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  animals: [
    { emoji: '🐱', sound: 600 },
    { emoji: '🐶', sound: 400 },
    { emoji: '🐰', sound: 700 },
    { emoji: '🦊', sound: 350 },
    { emoji: '🐼', sound: 300 },
    { emoji: '🐨', sound: 280 },
    { emoji: '🦁', sound: 150 },
    { emoji: '🐯', sound: 180 },
  ],
  colors: [
    'rgba(255, 182, 193, 0.65)',
    'rgba(135, 206, 250, 0.65)',
    'rgba(144, 238, 144, 0.65)',
    'rgba(255, 218, 185, 0.65)',
    'rgba(221, 160, 221, 0.65)',
    'rgba(255, 255, 153, 0.65)',
    'rgba(176, 224, 230, 0.65)',
    'rgba(255, 160, 122, 0.65)',
  ],
  typeWeights: {
    animal: 0.40,
    number: 0.30,
    letter: 0.30,
  },
};

// === WEATHER CONTENT ===

export type WeatherType = 'sun' | 'rain' | 'snow' | 'wind';

export const WEATHER_CONTENT: Record<WeatherType, {
  skyColors: [string, string];
  ambientSoundFreqs: number[];
  emoji: string;
}> = {
  sun: { skyColors: ['#87CEEB', '#B0E0E6'], ambientSoundFreqs: [800, 1200, 1600], emoji: '☀️' },
  rain: { skyColors: ['#708090', '#778899'], ambientSoundFreqs: [200, 300, 400], emoji: '🌧️' },
  snow: { skyColors: ['#E8E8E8', '#D3D3D3'], ambientSoundFreqs: [1000, 1500], emoji: '❄️' },
  wind: { skyColors: ['#B0C4DE', '#ADD8E6'], ambientSoundFreqs: [100, 150, 200], emoji: '💨' },
};

// === FARM CONTENT ===

export interface FarmAnimal {
  emoji: string;
  label: string;
  zone: 'shed' | 'sky' | 'pond' | 'field';
  soundFreq: number;
  soundType: OscillatorType;
  positionHint: { x: number; y: number };
}

export const FARM_ANIMALS: FarmAnimal[] = [
  { emoji: '🐄', label: 'cow', zone: 'shed', soundFreq: 80, soundType: 'sine', positionHint: { x: 0.30, y: 0.62 } },
  { emoji: '🐷', label: 'pig', zone: 'shed', soundFreq: 300, soundType: 'triangle', positionHint: { x: 0.22, y: 0.68 } },
  { emoji: '🐴', label: 'horse', zone: 'shed', soundFreq: 220, soundType: 'sine', positionHint: { x: 0.38, y: 0.60 } },
  { emoji: '🐔', label: 'chicken', zone: 'shed', soundFreq: 400, soundType: 'square', positionHint: { x: 0.26, y: 0.72 } },
  { emoji: '🐦', label: 'sparrow', zone: 'sky', soundFreq: 1200, soundType: 'triangle', positionHint: { x: 0.55, y: 0.18 } },
  { emoji: '🦋', label: 'butterfly', zone: 'sky', soundFreq: 900, soundType: 'sine', positionHint: { x: 0.70, y: 0.22 } },
  { emoji: '🦗', label: 'dragonfly', zone: 'sky', soundFreq: 800, soundType: 'triangle', positionHint: { x: 0.45, y: 0.15 } },
  { emoji: '🐸', label: 'frog', zone: 'pond', soundFreq: 180, soundType: 'square', positionHint: { x: 0.62, y: 0.72 } },
  { emoji: '🦆', label: 'duck', zone: 'pond', soundFreq: 350, soundType: 'sine', positionHint: { x: 0.70, y: 0.68 } },
  { emoji: '🐟', label: 'fish', zone: 'pond', soundFreq: 400, soundType: 'triangle', positionHint: { x: 0.65, y: 0.75 } },
  { emoji: '🐐', label: 'goat', zone: 'field', soundFreq: 260, soundType: 'sine', positionHint: { x: 0.82, y: 0.62 } },
  { emoji: '🐕', label: 'dog', zone: 'field', soundFreq: 350, soundType: 'square', positionHint: { x: 0.88, y: 0.67 } },
  { emoji: '🐇', label: 'rabbit', zone: 'field', soundFreq: 600, soundType: 'triangle', positionHint: { x: 0.78, y: 0.68 } },
];

// === PARENT NOTIFICATION TEMPLATES ===

export const PARENT_NOTIFICATIONS = {
  animal_discovered: (animalLabel: string) =>
    `discovered a ${animalLabel} today!`,
  all_colors_mixed: () =>
    `mixed all three primary colors and discovered purple, green, and orange!`,
  all_shapes_matched: () =>
    `matched all four shapes perfectly!`,
  orchestra_complete: () =>
    `made all the animals sing together in harmony!`,
  night_discovered: () =>
    `discovered what happens when the sun goes to sleep — night time!`,
  farm_complete: () =>
    `found every single animal on the farm!`,
  great_session: (minutes: number) =>
    `had ${minutes} minutes of wonderful discovery today!`,
};
