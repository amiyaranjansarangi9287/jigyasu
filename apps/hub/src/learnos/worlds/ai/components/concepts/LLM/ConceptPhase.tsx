import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import {
  BookwormIllustration,
  TokensIllustration,
  PredictionIllustration,
} from '../../illustrations';

interface ConceptPhaseProps {
  onComplete: () => void;
}

const storyPages: StoryPage[] = [
  {
    title: "Meet Your Super Reader Friend! 📚",
    content: "Imagine having a friend who LOVES to read - and I mean really loves it! This friend has read millions of books, websites, stories, and articles. They've read about dinosaurs, samosa recipes, space adventures, and everything in between! That's kind of what a Large Language Model is - a super reader that remembers patterns from everything it's read!",
    illustration: <BookwormIllustration />,
    image: "/images/llm-story-1.jpg",
    pixelMood: "excited",
    highlight: "LLMs have learned from reading more text than any person ever could!"
  },
  {
    title: "Spotting Patterns in Words 🔤",
    content: "Here's something fun - when you hear 'The cat sat on the...', your brain probably thinks 'mat' or 'chair', right? Not 'purple' or 'running'! That's because you've learned how words fit together. LLMs learn the same patterns! By reading so much, they know which words usually go together. Pretty smart, huh?",
    illustration: <PredictionIllustration />,
    image: "/images/llm-story-2.jpg",
    pixelMood: "thinking",
    highlight: "LLMs learn patterns - which words like to hang out together!"
  },
  {
    title: "What's a Token? 🧩",
    content: "Here's a cool secret - LLMs don't read whole words at once! They break text into smaller pieces called 'tokens'. It's like breaking a chocolate bar into squares! 'Hello' might be one token, but 'unbelievable' might become 'un' + 'believ' + 'able' - three tokens! This helps them handle any word, even made-up ones!",
    illustration: <TokensIllustration />,
    image: "/images/llm-story-3.jpg",
    pixelMood: "teaching",
    highlight: "Tokens are word-pieces - like puzzle pieces that make up sentences!"
  },
  {
    title: "The Guessing Game 🎯",
    content: "Now here's the really cool part! LLMs are amazing at guessing what word comes next. If you say 'I love to eat...', they might guess 'samosa' or 'kulfi'. They don't just randomly guess - they calculate which words are most likely based on everything they've learned. It's like being really good at finishing someone's sentences!",
    illustration: <PredictionIllustration />,
    pixelMood: "curious",
    highlight: "LLMs predict the next word, one word at a time - like a guessing game!"
  },
  {
    title: "What Does LLM Mean? 🤖",
    content: "LLM stands for 'Large Language Model'. 'Large' because it knows SO much. 'Language' because it works with words and text. 'Model' because it's a computer program that learned patterns! When you chat with AI assistants, you're talking to an LLM. And now you know how it works! How cool is that?",
    illustration: <BookwormIllustration />,
    pixelMood: "celebrating",
    highlight: "LLM = Large Language Model - super smart text prediction systems!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer
      pages={storyPages}
      conceptColor="bg-gradient-to-r from-blue-500 to-cyan-500"
      conceptEmoji="💬"
      onComplete={onComplete}
    />
  );
}
