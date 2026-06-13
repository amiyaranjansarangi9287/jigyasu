// HeritageWorld Unified Types

export interface StoryPage {
  text: string;
  verse?: string;
  mood?: 'peaceful' | 'tense' | 'joyful' | 'sad' | 'heroic' | 'mystical';
  visualCue?: string;
  isTeachingMoment?: boolean;
}

export interface StoryQuiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface HeritageStory {
  id: string;
  collection: 'gita' | 'ramayana' | 'saints' | 'odisha';
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  ageRange: string;
  category: string;
  categoryIcon: string;
  coreValue: string;
  region?: string;
  period?: string;
  color: string;
  gradient: string;
  icon?: string;
  emoji?: string;
  pages: StoryPage[];
  quiz?: StoryQuiz;
  hasImage: boolean;
}

export interface StoryCollection {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  color: string;
  count: number;
}

// Types needed by raw ramayana data files
export interface RamayanaEpisode {
  id: string;
  title: string;
  value: string;
  ageGroup: string;
  kanda: string;
  kandaName?: string;
  characterName: string;
  characterAge?: string;
  characterTrait: string;
  dharmaDilemma: string;
  pages: {
    id?: string;
    text: string;
    mood: string;
    visualCue: string;
  }[];
  quiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}
