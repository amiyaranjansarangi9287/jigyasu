// src/worlds/lab/types/lab.types.ts

export type LabModule =
  | 'circuit-builder'
  | 'fraction-kitchen'
  | 'ecosystem-sandbox'
  | 'force-lab'
  | 'weather-station'
  | 'timeline-explorer'
  | 'code-story'
  | 'multiplication-lab'
  | 'buoyancy-lab'
  | 'lever-explorer'
  | 'statistics-playground'
  | 'human-body'
  | 'panchabhutas'
  | 'states-of-matter'
  | 'gravity'
  | 'water-cycle'
  | 'photosynthesis'
  | 'digestive-system'
  | 'solar-system'
  | 'blood-circulation'
  | 'cell-explorer'
  | 'newtons-laws'
  | 'magnets'
  | 'electricity'
  | 'light-shadows'
  | 'sound-waves'
  | 'float-sink'
  | 'plant-growth'
  | 'day-night'
  | 'moon-phases'
  | 'atoms'
  | 'simple-machines'
  | 'shapes'
  | 'number-line'
  | 'fractions'
  | 'multiplication'
  | 'pi'
  | 'pythagorean'
  | 'senses'
  | 'habitats'
  | 'food-chain';

export type JigyasuGuideEmotion =
  | 'idle'
  | 'appearing'
  | 'speaking'
  | 'curious'
  | 'celebrating'
  | 'thinking'
  | 'departing';

export type LabSubject =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'math'
  | 'earth-science'
  | 'computer-science';

export type CertificationLevel = 'explorer' | 'scientist' | 'expert';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LabModuleMetadata {
  id: LabModule;
  emoji: string;
  title: string;
  subject: LabSubject;
  color: string;
  bgColor: string;
  path: string;
  realWorldConnection: string;
  toyboxProject?: string;
  difficulty: DifficultyLevel;
  tags: string[];
}

export interface EcosystemOrganism {
  id: string;
  type: 'sun' | 'plant' | 'herbivore' | 'carnivore' | 'decomposer';
  emoji: string;
  name: string;
  population: number;
  maxPopulation: number;
  growthRate: number;
  foodSources: string[];
}

export interface ForceScenario {
  id: string;
  surface: 'ice' | 'carpet' | 'sand' | 'rock';
  surfaceEmoji: string;
  frictionCoefficient: number;
  boxEmoji: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  emoji: string;
  subject: LabSubject;
  description: string;
  isIndian?: boolean;
}

export interface LabProgress {
  circuitsCompleted: number;
  seriesDiscovered: boolean;
  parallelDiscovered: boolean;
  recipesSolved: number;
  highestScalingFactor: number;
  ecosystemsBuilt: number;
  cascadeObserved: boolean;
  experimentsDone: number;
  frictionDiscovered: boolean;
  fEqualsMADiscovered: boolean;
  predictionsCorrect: number;
  predictionsTotal: number;
  accuracyBadge: boolean;
  eventsPlaced: number;
  timelineCompleted: boolean;
  certifications: Record<LabModule | 'panchabhutas', CertificationLevel | null>;
  // LZ-B fields
  codeStoriesCompleted: number;
  ifThenDiscovered: boolean;
  loopsDiscovered: boolean;
  multiplicationArraysDone: number;
  patternsDiscovered: string[];
  buoyancyObjectsTested: string[];
  densityConceptGrasped: boolean;
  leverChallengesCompleted: number;
  mechanicalAdvantageFound: boolean;
  statsDatasets: string[];
  meanMedianModeMastered: boolean;
  bodySystemsExplored: string[];
  allSystemsExplored: boolean;
  crossConceptsUnlocked: string[];
  crossConceptsFound: number;
  lumoInteractions: number;
  hintsUsed: number;
  wrongAnswersBeforeCorrect: number;
  totalSessions: number;
  totalMinutes: number;
  lastSessionAt: number;
  updatedAt: number;
}

export interface MultiplicationArray {
  rows: number;
  cols: number;
  emoji: string;
  context: string;
  indianContext: boolean;
}

export interface LeverChallenge {
  id: string;
  description: string;
  leftWeight: number;
  rightWeight: number;
  goalSide: 'left' | 'right' | 'balanced';
  difficulty: 1 | 2 | 3;
  class: 1 | 2 | 3;
  emoji: string;
  realWorldExample: string;
}

export interface ScalableRecipe {
  id: string;
  name: string;
  emoji: string;
  baseServings: number;
  targetServings: number;
  ingredients: { name: string; emoji: string; baseAmount: number; unit: string; }[];
  isIndian: boolean;
  difficulty: 1 | 2 | 3;
}

export interface WeatherScenario {
  id: string;
  name: string;
  emoji: string;
  readings: { temperature: number; humidity: number; pressure: number; windSpeed: number; cloudCover: number; };
  correctPrediction: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'windy';
  explanation: string;
}

export interface CodeChallenge {
  id: string;
  title: string;
  story: string;
  characterEmoji: string;
  sceneEmoji: string;
  difficulty: 1 | 2 | 3;
  availableBlocks: string[];
  goal: string;
  hint: string;
  solutionBlocks: string[];
}

export interface BuoyancyObject {
  id: string;
  name: string;
  emoji: string;
  mass: number;
  volume: number;
  density: number;
  floats: boolean;
  material: string;
}

export interface StatisticsDataset {
  id: string;
  name: string;
  emoji: string;
  data: number[];
  context: string;
  unit: string;
  isIndian: boolean;
}

export interface BodySystem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  organs: { id: string; name: string; emoji: string; fact: string }[];
  function: string;
  interestingFact: string;
}

export interface CrossConceptBridge {
  id: string;
  module1: string;
  module2: string;
  bridgeMessage: string;
  emoji: string;
}
