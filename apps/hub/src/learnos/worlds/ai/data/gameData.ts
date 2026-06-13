// Data for mini-games — pulls from all AI concepts

export interface TermPair {
  term: string;
  definition: string;
  emoji: string;
  category: string;
}

export interface TrueFalseItem {
  statement: string;
  isTrue: boolean;
  explanation: string;
  category: string;
}

// Matching game pairs
export const matchingPairs: TermPair[] = [
  { term: 'Neural Network', definition: 'A team of artificial neurons that learn patterns', emoji: '🧠', category: 'Neural Networks' },
  { term: 'Neuron', definition: 'A tiny helper that passes messages', emoji: '⚡', category: 'Neural Networks' },
  { term: 'Token', definition: 'A small piece of text that LLMs process', emoji: '🧩', category: 'LLM' },
  { term: 'LLM', definition: 'Large Language Model — predicts the next word', emoji: '💬', category: 'LLM' },
  { term: 'Attention', definition: 'How Transformers connect related words', emoji: '🎯', category: 'Transformers' },
  { term: 'Transformer', definition: 'AI that reads all words at once', emoji: '🤖', category: 'Transformers' },
  { term: 'RAG', definition: 'Retrieval-Augmented Generation', emoji: '📚', category: 'RAG' },
  { term: 'Retrieval', definition: 'Searching for relevant documents', emoji: '🔍', category: 'RAG' },
  { term: 'Embedding', definition: 'Numbers that represent word meanings', emoji: '🗺️', category: 'Embeddings' },
  { term: 'Pixel', definition: 'Tiny colored square in an image', emoji: '🎨', category: 'Computer Vision' },
  { term: 'Prompt', definition: 'What you type or say to ask AI', emoji: '✨', category: 'Prompt Engineering' },
  { term: 'Bias', definition: 'When AI treats people unfairly', emoji: '⚖️', category: 'AI Ethics' },
  { term: 'Agent', definition: 'The learner in Reinforcement Learning', emoji: '🎮', category: 'Reinforcement Learning' },
  { term: 'Reward', definition: 'Points for good actions in RL', emoji: '⭐', category: 'Reinforcement Learning' },
  { term: 'Diffusion', definition: 'Creating images from noise step by step', emoji: '🌀', category: 'Generative AI' },
  { term: 'Deepfake', definition: 'AI-generated fake video of real people', emoji: '🎭', category: 'AI Safety' },
  { term: 'Guardrail', definition: 'Safety rules built into AI', emoji: '🛡️', category: 'AI Safety' },
  { term: 'Generative AI', definition: 'AI that creates new content', emoji: '🎨', category: 'Generative AI' },
];

// Word scramble words
export const scrambleWords = [
  { word: 'NEURON', hint: 'Tiny brain helper', emoji: '🧠' },
  { word: 'TOKEN', hint: 'Piece of text for LLMs', emoji: '🧩' },
  { word: 'PROMPT', hint: 'What you ask AI', emoji: '✨' },
  { word: 'ROBOT', hint: 'AI agent or machine', emoji: '🤖' },
  { word: 'PIXEL', hint: 'Tiny dot in an image', emoji: '🎨' },
  { word: 'REWARD', hint: 'Points in RL', emoji: '⭐' },
  { word: 'BIAS', hint: 'Unfair AI behavior', emoji: '⚖️' },
  { word: 'LAYER', hint: 'Part of a neural network', emoji: '🧠' },
  { word: 'EMBED', hint: 'Turn words to numbers', emoji: '🗺️' },
  { word: 'AGENT', hint: 'RL learner', emoji: '🎮' },
  { word: 'MODEL', hint: 'Trained AI program', emoji: '💬' },
  { word: 'SAFETY', hint: 'Keeping AI helpful', emoji: '🛡️' },
];

// True/False speed round
export const trueFalseItems: TrueFalseItem[] = [
  { statement: 'Neural networks are inspired by the human brain', isTrue: true, explanation: 'They mimic how neurons in your brain pass messages!', category: 'Neural Networks' },
  { statement: 'LLMs read one word at a time', isTrue: false, explanation: 'Transformers-based LLMs process all words at once!', category: 'LLM' },
  { statement: 'Tokens are always full words', isTrue: false, explanation: 'Long words get split into smaller token pieces!', category: 'LLM' },
  { statement: 'RAG helps AI access up-to-date information', isTrue: true, explanation: 'RAG retrieves current documents before answering!', category: 'RAG' },
  { statement: 'Similar words are far apart in embedding space', isTrue: false, explanation: 'Similar words are CLOSE together in embedding space!', category: 'Embeddings' },
  { statement: 'Computer Vision helps machines understand images', isTrue: true, explanation: 'CV teaches computers to "see" and recognize objects!', category: 'Computer Vision' },
  { statement: 'A vague prompt gives better results than a specific one', isTrue: false, explanation: 'Specific, clear prompts always get better results!', category: 'Prompt Engineering' },
  { statement: 'AI is always 100% correct', isTrue: false, explanation: 'AI makes mistakes! Always verify its answers.', category: 'AI Ethics' },
  { statement: 'RL agents learn from rewards and penalties', isTrue: true, explanation: 'That\'s the core idea of Reinforcement Learning!', category: 'Reinforcement Learning' },
  { statement: 'Generative AI can create images from text', isTrue: true, explanation: 'Tools like DALL-E create images from text prompts!', category: 'Generative AI' },
  { statement: 'Deepfakes are always easy to spot', isTrue: false, explanation: 'Deepfakes are getting very realistic and hard to detect!', category: 'AI Safety' },
  { statement: 'You should share personal info with AI chatbots', isTrue: false, explanation: 'Never share addresses, passwords, or phone numbers!', category: 'AI Safety' },
  { statement: 'Attention helps Transformers understand context', isTrue: true, explanation: 'Attention connects related words across sentences!', category: 'Transformers' },
  { statement: 'Hidden layers in neural networks find patterns', isTrue: true, explanation: 'Hidden layers detect increasingly complex patterns!', category: 'Neural Networks' },
  { statement: 'Diffusion models start with a clear image and add noise', isTrue: false, explanation: 'They start with noise and REMOVE it to create images!', category: 'Generative AI' },
];

// Shuffle helper
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function scrambleWord(word: string): string {
  const letters = word.split('');
  let scrambled = shuffle(letters).join('');
  // Make sure it's actually scrambled
  while (scrambled === word && word.length > 1) {
    scrambled = shuffle(letters).join('');
  }
  return scrambled;
}
