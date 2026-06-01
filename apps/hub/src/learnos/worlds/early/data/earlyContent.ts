// src/worlds/early/data/earlyContent.ts

import type { EarlyModule, Recipe, Pattern, WordSentence } from '../types/early.types';

export interface EarlyModuleMetadata {
  id: EarlyModule;
  emoji: string;
  titleKey: string;
  color: string;
  bgColor: string;
  minAge: number;
  path: string;
}

export const EARLY_MODULES: EarlyModuleMetadata[] = [
  { id: 'story-builder', emoji: '📖', titleKey: 'early.modules.story_builder', color: '#7C3AED', bgColor: '#F5F3FF', minAge: 5, path: 'story-builder' },
  { id: 'number-line', emoji: '🔢', titleKey: 'early.modules.number_line', color: '#0EA5E9', bgColor: '#F0F9FF', minAge: 5, path: 'number-line' },
  { id: 'alphabet-forest', emoji: '🌳', titleKey: 'early.modules.alphabet_forest', color: '#16A34A', bgColor: '#F0FDF4', minAge: 5, path: 'alphabet-forest' },
  { id: 'mini-chef', emoji: '👨‍🍳', titleKey: 'early.modules.mini_chef', color: '#EA580C', bgColor: '#FFF7ED', minAge: 5, path: 'mini-chef' },
  { id: 'pattern-patrol', emoji: '🔍', titleKey: 'early.modules.pattern_patrol', color: '#DB2777', bgColor: '#FDF2F8', minAge: 5, path: 'pattern-patrol' },
  { id: 'word-scramble', emoji: '✏️', titleKey: 'early.modules.word_scramble', color: '#D97706', bgColor: '#FFFBEB', minAge: 6, path: 'word-scramble' },
  { id: 'plant-growth', emoji: '🌱', titleKey: 'early.modules.plant_growth', color: '#15803D', bgColor: '#F0FDF4', minAge: 5, path: 'plant-growth' },
  { id: 'water-cycle', emoji: '🌧️', titleKey: 'early.modules.water_cycle', color: '#0284C7', bgColor: '#F0F9FF', minAge: 5, path: 'water-cycle' },
  { id: 'habitat-heroes', emoji: '🌍', titleKey: 'early.modules.habitat_heroes', color: '#0F766E', bgColor: '#F0FDFA', minAge: 5, path: 'habitat-heroes' },
  { id: 'shadow-detective', emoji: '🔦', titleKey: 'early.modules.shadow_detective', color: '#4338CA', bgColor: '#EEF2FF', minAge: 6, path: 'shadow-detective' },
  { id: 'magnet-explorer', emoji: '🧲', titleKey: 'early.modules.magnet_explorer', color: '#BE123C', bgColor: '#FFF1F2', minAge: 6, path: 'magnet-explorer' },
  { id: 'coin-counter', emoji: '💰', titleKey: 'early.modules.coin_counter', color: '#B45309', bgColor: '#FFFBEB', minAge: 6, path: 'coin-counter' },
];

// === STORY BUILDER ===
export const STORY_CHARACTERS = [
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘' },
  { id: 'monkey', name: 'Monkey', emoji: '🐒' },
  { id: 'fish', name: 'Fish', emoji: '🐟' },
];

export const STORY_PLACES = [
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊' },
  { id: 'mountain', name: 'Mountain', emoji: '⛰️' },
  { id: 'farm', name: 'Farm', emoji: '🏡' },
];

export const STORY_PROBLEMS = [
  { id: 'lost', name: 'Got Lost', emoji: '🗺️' },
  { id: 'hungry', name: 'Was Hungry', emoji: '🍎' },
  { id: 'scared', name: 'Was Scared', emoji: '🌩️' },
  { id: 'lonely', name: 'Was Lonely', emoji: '💙' },
];

export const STORY_PANEL_TEMPLATES = [
  { template: 'Once upon a time, {character} lived in a beautiful {place}.', emoji: '🌅' },
  { template: 'One day, {character} {problem}.', emoji: '😮' },
  { template: '{character} felt very sad and sat down to think.', emoji: '💭' },
  { template: 'Then {character} saw something unusual nearby!', emoji: '👀' },
  { template: 'With a little courage, {character} tried something new.', emoji: '✨' },
  { template: 'And everything worked out! {character} was so happy!', emoji: '🎉' },
];

// === NUMBER LINE ===
export interface NumberLineProblem {
  startNumber: number;
  direction: 'forward' | 'backward';
  steps: number;
  answer: number;
  emoji: string;
  difficulty: 1 | 2 | 3;
}

export const NUMBER_LINE_PROBLEMS: NumberLineProblem[] = [
  { startNumber: 0, direction: 'forward', steps: 3, answer: 3, emoji: '🐸', difficulty: 1 },
  { startNumber: 2, direction: 'forward', steps: 4, answer: 6, emoji: '🦘', difficulty: 1 },
  { startNumber: 1, direction: 'forward', steps: 5, answer: 6, emoji: '🐇', difficulty: 1 },
  { startNumber: 5, direction: 'forward', steps: 3, answer: 8, emoji: '🐒', difficulty: 1 },
  { startNumber: 0, direction: 'forward', steps: 7, answer: 7, emoji: '🦁', difficulty: 1 },
  { startNumber: 8, direction: 'forward', steps: 5, answer: 13, emoji: '🐘', difficulty: 2 },
  { startNumber: 10, direction: 'forward', steps: 8, answer: 18, emoji: '🦒', difficulty: 2 },
  { startNumber: 5, direction: 'backward', steps: 3, answer: 2, emoji: '🐢', difficulty: 2 },
  { startNumber: 10, direction: 'backward', steps: 4, answer: 6, emoji: '🦊', difficulty: 2 },
  { startNumber: 2, direction: 'backward', steps: 5, answer: -3, emoji: '🐧', difficulty: 3 },
  { startNumber: 0, direction: 'backward', steps: 4, answer: -4, emoji: '🐳', difficulty: 3 },
  { startNumber: -2, direction: 'forward', steps: 6, answer: 4, emoji: '🦋', difficulty: 3 },
];

// === ALPHABET ===
export interface AlphabetLetterContent {
  letter: string;
  items: { word: string; emoji: string; animation: 'bounce' | 'float' | 'spin' | 'grow' | 'wiggle' }[];
  phonemeSound: string;
}

export const ALPHABET_CONTENT: AlphabetLetterContent[] = [
  { letter: 'A', phonemeSound: 'Aaa', items: [{ word: 'Apple', emoji: '🍎', animation: 'bounce' }, { word: 'Ant', emoji: '🐜', animation: 'wiggle' }, { word: 'Arrow', emoji: '➡️', animation: 'float' }] },
  { letter: 'B', phonemeSound: 'Buh', items: [{ word: 'Ball', emoji: '⚽', animation: 'bounce' }, { word: 'Butterfly', emoji: '🦋', animation: 'float' }, { word: 'Bear', emoji: '🐻', animation: 'wiggle' }] },
  { letter: 'C', phonemeSound: 'Kuh', items: [{ word: 'Cat', emoji: '🐱', animation: 'wiggle' }, { word: 'Cake', emoji: '🎂', animation: 'grow' }, { word: 'Cloud', emoji: '☁️', animation: 'float' }] },
  { letter: 'D', phonemeSound: 'Duh', items: [{ word: 'Dog', emoji: '🐶', animation: 'bounce' }, { word: 'Duck', emoji: '🦆', animation: 'wiggle' }, { word: 'Diamond', emoji: '💎', animation: 'spin' }] },
  { letter: 'E', phonemeSound: 'Eeh', items: [{ word: 'Elephant', emoji: '🐘', animation: 'grow' }, { word: 'Egg', emoji: '🥚', animation: 'bounce' }, { word: 'Earth', emoji: '🌍', animation: 'spin' }] },
  { letter: 'F', phonemeSound: 'Fuh', items: [{ word: 'Fish', emoji: '🐟', animation: 'float' }, { word: 'Flower', emoji: '🌸', animation: 'grow' }, { word: 'Frog', emoji: '🐸', animation: 'bounce' }] },
  { letter: 'G', phonemeSound: 'Guh', items: [{ word: 'Goat', emoji: '🐐', animation: 'wiggle' }, { word: 'Grapes', emoji: '🍇', animation: 'bounce' }, { word: 'Guitar', emoji: '🎸', animation: 'spin' }] },
  { letter: 'H', phonemeSound: 'Huh', items: [{ word: 'Horse', emoji: '🐴', animation: 'bounce' }, { word: 'Hat', emoji: '🎩', animation: 'spin' }, { word: 'Honey', emoji: '🍯', animation: 'grow' }] },
  { letter: 'I', phonemeSound: 'Ih', items: [{ word: 'Ice cream', emoji: '🍦', animation: 'grow' }, { word: 'Island', emoji: '🏝️', animation: 'float' }, { word: 'Igloo', emoji: '🏔️', animation: 'bounce' }] },
  { letter: 'J', phonemeSound: 'Juh', items: [{ word: 'Jar', emoji: '🫙', animation: 'bounce' }, { word: 'Jellyfish', emoji: '🪼', animation: 'float' }, { word: 'Juice', emoji: '🧃', animation: 'grow' }] },
  { letter: 'K', phonemeSound: 'Kuh', items: [{ word: 'Kite', emoji: '🪁', animation: 'float' }, { word: 'Koala', emoji: '🐨', animation: 'wiggle' }, { word: 'Key', emoji: '🔑', animation: 'spin' }] },
  { letter: 'L', phonemeSound: 'Luh', items: [{ word: 'Lion', emoji: '🦁', animation: 'bounce' }, { word: 'Lemon', emoji: '🍋', animation: 'grow' }, { word: 'Ladybug', emoji: '🐞', animation: 'float' }] },
  { letter: 'M', phonemeSound: 'Muh', items: [{ word: 'Monkey', emoji: '🐒', animation: 'wiggle' }, { word: 'Moon', emoji: '🌙', animation: 'float' }, { word: 'Mango', emoji: '🥭', animation: 'grow' }] },
  { letter: 'N', phonemeSound: 'Nuh', items: [{ word: 'Nest', emoji: '🪺', animation: 'bounce' }, { word: 'Night', emoji: '🌃', animation: 'float' }, { word: 'Nose', emoji: '👃', animation: 'wiggle' }] },
  { letter: 'O', phonemeSound: 'Oh', items: [{ word: 'Owl', emoji: '🦉', animation: 'spin' }, { word: 'Orange', emoji: '🍊', animation: 'bounce' }, { word: 'Ocean', emoji: '🌊', animation: 'float' }] },
  { letter: 'P', phonemeSound: 'Puh', items: [{ word: 'Parrot', emoji: '🦜', animation: 'wiggle' }, { word: 'Pizza', emoji: '🍕', animation: 'grow' }, { word: 'Penguin', emoji: '🐧', animation: 'bounce' }] },
  { letter: 'Q', phonemeSound: 'Kwuh', items: [{ word: 'Queen', emoji: '👸', animation: 'spin' }, { word: 'Quail', emoji: '🐦', animation: 'float' }, { word: 'Question', emoji: '❓', animation: 'bounce' }] },
  { letter: 'R', phonemeSound: 'Ruh', items: [{ word: 'Rabbit', emoji: '🐰', animation: 'bounce' }, { word: 'Rainbow', emoji: '🌈', animation: 'grow' }, { word: 'Rocket', emoji: '🚀', animation: 'float' }] },
  { letter: 'S', phonemeSound: 'Sss', items: [{ word: 'Sun', emoji: '☀️', animation: 'spin' }, { word: 'Star', emoji: '⭐', animation: 'float' }, { word: 'Snake', emoji: '🐍', animation: 'wiggle' }] },
  { letter: 'T', phonemeSound: 'Tuh', items: [{ word: 'Tiger', emoji: '🐯', animation: 'bounce' }, { word: 'Tree', emoji: '🌳', animation: 'grow' }, { word: 'Turtle', emoji: '🐢', animation: 'wiggle' }] },
  { letter: 'U', phonemeSound: 'Uh', items: [{ word: 'Umbrella', emoji: '☂️', animation: 'float' }, { word: 'Unicorn', emoji: '🦄', animation: 'spin' }, { word: 'Up', emoji: '⬆️', animation: 'bounce' }] },
  { letter: 'V', phonemeSound: 'Vuh', items: [{ word: 'Van', emoji: '🚐', animation: 'wiggle' }, { word: 'Volcano', emoji: '🌋', animation: 'grow' }, { word: 'Violin', emoji: '🎻', animation: 'spin' }] },
  { letter: 'W', phonemeSound: 'Wuh', items: [{ word: 'Wolf', emoji: '🐺', animation: 'bounce' }, { word: 'Watermelon', emoji: '🍉', animation: 'grow' }, { word: 'Wind', emoji: '💨', animation: 'float' }] },
  { letter: 'X', phonemeSound: 'Ex', items: [{ word: 'X-ray', emoji: '🔬', animation: 'spin' }, { word: 'Xylophone', emoji: '🎵', animation: 'bounce' }, { word: 'Fox', emoji: '🦊', animation: 'wiggle' }] },
  { letter: 'Y', phonemeSound: 'Yuh', items: [{ word: 'Yak', emoji: '🐃', animation: 'bounce' }, { word: 'Yellow', emoji: '💛', animation: 'grow' }, { word: 'Yo-yo', emoji: '🪀', animation: 'spin' }] },
  { letter: 'Z', phonemeSound: 'Zzz', items: [{ word: 'Zebra', emoji: '🦓', animation: 'wiggle' }, { word: 'Zoom', emoji: '💨', animation: 'float' }, { word: 'Zoo', emoji: '🦁', animation: 'bounce' }] },
];

// === MINI CHEF ===
export const RECIPES: Recipe[] = [
  { id: 'banana-shake', name: 'Banana Shake', emoji: '🥤', servings: 2, isIndian: false, difficulty: 1, ingredients: [
    { name: 'Bananas', emoji: '🍌', amount: 2, unit: 'pieces' }, { name: 'Milk', emoji: '🥛', amount: 1, unit: 'cup' }, { name: 'Sugar', emoji: '🍬', amount: 1, unit: 'spoon' }] },
  { id: 'dal-rice', name: 'Dal Rice', emoji: '🍛', servings: 4, isIndian: true, difficulty: 2, ingredients: [
    { name: 'Dal', emoji: '🫘', amount: 1, unit: 'cup', visualFraction: '1' }, { name: 'Rice', emoji: '🍚', amount: 2, unit: 'cups', visualFraction: '2' }, { name: 'Turmeric', emoji: '🟡', amount: 1, unit: 'pinch' }, { name: 'Salt', emoji: '🧂', amount: 1, unit: 'spoon', visualFraction: '½' }] },
  { id: 'fruit-salad', name: 'Fruit Salad', emoji: '🍱', servings: 2, isIndian: false, difficulty: 1, ingredients: [
    { name: 'Apple', emoji: '🍎', amount: 1, unit: 'piece' }, { name: 'Banana', emoji: '🍌', amount: 1, unit: 'piece' }, { name: 'Orange', emoji: '🍊', amount: 1, unit: 'piece' }, { name: 'Honey', emoji: '🍯', amount: 1, unit: 'spoon', visualFraction: '½' }] },
  { id: 'chai', name: 'Masala Chai', emoji: '🍵', servings: 2, isIndian: true, difficulty: 2, ingredients: [
    { name: 'Water', emoji: '💧', amount: 1, unit: 'cup' }, { name: 'Milk', emoji: '🥛', amount: 1, unit: 'cup' }, { name: 'Tea leaves', emoji: '🌿', amount: 2, unit: 'spoons' }, { name: 'Sugar', emoji: '🍬', amount: 2, unit: 'spoons' }, { name: 'Ginger', emoji: '🫚', amount: 1, unit: 'piece' }] },
  { id: 'roti-dough', name: 'Roti Dough', emoji: '🫓', servings: 4, isIndian: true, difficulty: 3, ingredients: [
    { name: 'Wheat flour', emoji: '🌾', amount: 2, unit: 'cups' }, { name: 'Water', emoji: '💧', amount: 1, unit: 'cup' }, { name: 'Salt', emoji: '🧂', amount: 1, unit: 'pinch' }, { name: 'Oil', emoji: '🫙', amount: 1, unit: 'spoon' }] },
];

// === PATTERNS ===
export const PATTERNS: Pattern[] = [
  { id: 'p1', type: 'AB', sequence: [{ emoji: '🔴' }, { emoji: '🔵' }, { emoji: '🔴' }, { emoji: '🔵' }, { emoji: '🔴' }], missingIndex: 5, difficulty: 1 },
  { id: 'p2', type: 'AB', sequence: [{ emoji: '⭐' }, { emoji: '🌙' }, { emoji: '⭐' }, { emoji: '🌙' }, { emoji: '⭐' }], missingIndex: 5, difficulty: 1 },
  { id: 'p3', type: 'AB', sequence: [{ emoji: '🐱' }, { emoji: '🐶' }, { emoji: '🐱' }, { emoji: '🐶' }], missingIndex: 4, difficulty: 1 },
  { id: 'p4', type: 'ABB', sequence: [{ emoji: '🍎' }, { emoji: '🍌' }, { emoji: '🍌' }, { emoji: '🍎' }, { emoji: '🍌' }], missingIndex: 5, difficulty: 2 },
  { id: 'p5', type: 'ABC', sequence: [{ emoji: '🔴' }, { emoji: '🟡' }, { emoji: '🔵' }, { emoji: '🔴' }, { emoji: '🟡' }], missingIndex: 5, difficulty: 2 },
  { id: 'p6', type: 'ABB', sequence: [{ emoji: '🌸' }, { emoji: '🌿' }, { emoji: '🌿' }, { emoji: '🌸' }, { emoji: '🌿' }], missingIndex: 5, difficulty: 2 },
  { id: 'p7', type: 'size', sequence: [{ emoji: '🐘', size: 'large' }, { emoji: '🐘', size: 'medium' }, { emoji: '🐘', size: 'small' }, { emoji: '🐘', size: 'large' }, { emoji: '🐘', size: 'medium' }], missingIndex: 5, difficulty: 3 },
  { id: 'p8', type: 'color+shape', sequence: [{ emoji: '🔴', size: 'large' }, { emoji: '🔵', size: 'small' }, { emoji: '🔴', size: 'large' }, { emoji: '🔵', size: 'small' }], missingIndex: 4, difficulty: 3 },
];

// === WORD SCRAMBLE ===
export const WORD_SENTENCES: WordSentence[] = [
  { id: 'ws1', words: ['The', 'dog', 'runs', 'fast'], correctOrder: [0, 1, 2, 3], animation: 'dog-running', animationEmoji: '🐕' },
  { id: 'ws2', words: ['The', 'bird', 'flies', 'high'], correctOrder: [0, 1, 2, 3], animation: 'bird-flying', animationEmoji: '🐦' },
  { id: 'ws3', words: ['The', 'fish', 'swims', 'deep'], correctOrder: [0, 1, 2, 3], animation: 'fish-swimming', animationEmoji: '🐟' },
  { id: 'ws4', words: ['A', 'cat', 'sits', 'quietly'], correctOrder: [0, 1, 2, 3], animation: 'cat-sitting', animationEmoji: '🐱' },
  { id: 'ws5', words: ['The', 'sun', 'shines', 'brightly'], correctOrder: [0, 1, 2, 3], animation: 'sun-shining', animationEmoji: '☀️' },
  { id: 'ws6', words: ['Rain', 'falls', 'from', 'clouds'], correctOrder: [0, 1, 2, 3], animation: 'rain-falling', animationEmoji: '🌧️' },
  { id: 'ws7', words: ['The', 'frog', 'jumps', 'into', 'water'], correctOrder: [0, 1, 2, 3, 4], animation: 'frog-jumping', animationEmoji: '🐸' },
  { id: 'ws8', words: ['Stars', 'shine', 'at', 'night'], correctOrder: [0, 1, 2, 3], animation: 'stars-shining', animationEmoji: '⭐' },
  { id: 'ws9', words: ['The', 'monkey', 'climbs', 'the', 'tree'], correctOrder: [0, 1, 2, 3, 4], animation: 'monkey-climbing', animationEmoji: '🐒' },
  { id: 'ws10', words: ['Flowers', 'grow', 'in', 'spring'], correctOrder: [0, 1, 2, 3], animation: 'flowers-growing', animationEmoji: '🌸' },
];

// === COIN COUNTER (Indian Currency) ===

export interface CoinType {
  value: number;
  emoji: string;
  label: string;
  color: string;
}

export const INDIAN_COINS: CoinType[] = [
  { value: 1, emoji: '💰', label: '₹1', color: '#FFD700' },
  { value: 2, emoji: '💰', label: '₹2', color: '#FFD700' },
  { value: 5, emoji: '💵', label: '₹5', color: '#90EE90' },
  { value: 10, emoji: '💵', label: '₹10', color: '#90EE90' },
];

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  priceInPaise: number;
  priceDisplay: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'pencil', name: 'Pencil', emoji: '✏️', priceInPaise: 200, priceDisplay: '₹2' },
  { id: 'eraser', name: 'Eraser', emoji: '🧹', priceInPaise: 100, priceDisplay: '₹1' },
  { id: 'banana', name: 'Banana', emoji: '🍌', priceInPaise: 500, priceDisplay: '₹5' },
  { id: 'mango', name: 'Mango', emoji: '🥭', priceInPaise: 1000, priceDisplay: '₹10' },
  { id: 'notebook', name: 'Notebook', emoji: '📓', priceInPaise: 1500, priceDisplay: '₹15' },
  { id: 'samosa', name: 'Samosa', emoji: '🥐', priceInPaise: 1000, priceDisplay: '₹10' },
  { id: 'chai', name: 'Chai', emoji: '☕', priceInPaise: 500, priceDisplay: '₹5' },
  { id: 'chocolate', name: 'Chocolate', emoji: '🍫', priceInPaise: 2000, priceDisplay: '₹20' },
];

// === MAGNET CONTENT ===

export interface MagnetObject {
  id: string;
  emoji: string;
  name: string;
  isMagnetic: boolean;
  material: string;
}

export const MAGNET_OBJECTS: MagnetObject[] = [
  { id: 'nail', emoji: '🔩', name: 'Iron Nail', isMagnetic: true, material: 'iron' },
  { id: 'coin', emoji: '🪙', name: 'Coin', isMagnetic: false, material: 'copper' },
  { id: 'spoon', emoji: '🥄', name: 'Steel Spoon', isMagnetic: true, material: 'steel' },
  { id: 'leaf', emoji: '🍃', name: 'Leaf', isMagnetic: false, material: 'plant' },
  { id: 'key', emoji: '🔑', name: 'Iron Key', isMagnetic: true, material: 'iron' },
  { id: 'eraser', emoji: '🧹', name: 'Eraser', isMagnetic: false, material: 'rubber' },
  { id: 'scissors', emoji: '✂️', name: 'Scissors', isMagnetic: true, material: 'steel' },
  { id: 'paper', emoji: '📄', name: 'Paper', isMagnetic: false, material: 'paper' },
  { id: 'thread', emoji: '🧵', name: 'Thread', isMagnetic: false, material: 'cotton' },
  { id: 'pin', emoji: '📌', name: 'Pin', isMagnetic: true, material: 'steel' },
];

// === SHADOW DETECTIVE ===

export interface ShadowChallenge {
  id: string;
  emoji: string;
  objectEmoji: string;
  targetPosition: 'long-left' | 'short' | 'long-right' | 'gone';
  difficulty: 1 | 2 | 3;
}

export const SHADOW_CHALLENGES: ShadowChallenge[] = [
  { id: 'sc1', emoji: '📏', objectEmoji: '🌳', targetPosition: 'long-left', difficulty: 1 },
  { id: 'sc2', emoji: '📐', objectEmoji: '🏠', targetPosition: 'short', difficulty: 1 },
  { id: 'sc3', emoji: '➡️', objectEmoji: '🐘', targetPosition: 'long-right', difficulty: 2 },
  { id: 'sc4', emoji: '✨', objectEmoji: '🌲', targetPosition: 'gone', difficulty: 2 },
];
