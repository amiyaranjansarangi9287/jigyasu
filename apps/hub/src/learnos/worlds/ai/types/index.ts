export type LearningPhase = 'concept' | 'learn' | 'explore' | 'play';

export interface Concept {
  id: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
  analogy: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
