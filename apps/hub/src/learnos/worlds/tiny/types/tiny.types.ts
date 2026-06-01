// src/worlds/tiny/types/tiny.types.ts

export type TinyModule =
  | 'tap-world'
  | 'color-mixer'
  | 'shape-sorter'
  | 'animal-orchestra'
  | 'bubble-world'
  | 'weather-maker'
  | 'farm-friends'
  | 'day-and-night';

export type CompanionType =
  | 'bunny'
  | 'chameleon'
  | 'elephant'
  | 'peacock'
  | 'otter'
  | 'bear'
  | 'chick'
  | 'firefly';

export type CompanionEmotion =
  | 'idle'
  | 'happy'
  | 'excited'
  | 'surprised'
  | 'curious'
  | 'sleepy'
  | 'celebrating';

export interface CompanionState {
  type: CompanionType;
  emotion: CompanionEmotion;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  animationFrame: number;
}

export interface TinyModuleMetadata {
  id: TinyModule;
  emoji: string;
  sceneBg: string;
  companion: CompanionType;
  gardenItem: string;
  gardenEmoji: string;
}

export type ColorName =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'green'
  | 'orange'
  | 'brown';

export type WeatherType = 'sun' | 'rain' | 'snow' | 'wind';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'star';

export interface TinyProgress {
  animalsDiscovered: string[];
  totalTaps: number;
  colorsMixed: ColorName[];
  shapesMatched: ShapeType[];
  roundsCompleted: number;
  animalsPlayed: string[];
  groupPerformanceCount: number;
  bubblesPopped: number;
  lettersEncountered: string[];
  numbersEncountered: number[];
  weathersDiscovered: WeatherType[];
  farmAnimalsFound: string[];
  farmCompleted: boolean;
  nightDiscovered: boolean;
  fullCyclesCompleted: number;
  lastSessionAt: number;
  totalSessions: number;
  totalPlayMinutes: number;
  gardenItems: GardenItem[];
  updatedAt: number;
}

export interface GardenItem {
  id: string;
  itemType: string;
  itemEmoji: string;
  unlockedAt: number;
  module: TinyModule;
}
