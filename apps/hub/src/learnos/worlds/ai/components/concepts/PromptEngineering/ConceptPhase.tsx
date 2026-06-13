import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import {
  MagicWandIllustration,
  GoodVsBadPromptIllustration,
} from '../../illustrations';

interface ConceptPhaseProps {
  onComplete: () => void;
}

const storyPages: StoryPage[] = [
  {
    title: "Talking to AI! 💬",
    content: "Have you ever talked to an AI assistant like Siri or Alexa? Or maybe used ChatGPT? When you ask AI a question, what you type or say is called a 'prompt'. And here's a secret - HOW you ask makes a huge difference in what answer you get!",
    illustration: <MagicWandIllustration />,
    pixelMood: "excited",
    highlight: "A prompt is what you say or type to ask AI for help!"
  },
  {
    title: "The Magic of Good Questions ✨",
    content: "Imagine asking your friend 'Tell me about animals.' That's pretty vague, right? But if you ask 'What's the fastest animal on land and how fast can it run?' - now that's a great question! The same thing works with AI. Better questions = better answers!",
    illustration: <GoodVsBadPromptIllustration />,
    pixelMood: "teaching",
    highlight: "Clear, specific questions get much better answers from AI!"
  },
  {
    title: "What is Prompt Engineering? 🛠️",
    content: "Prompt Engineering is the art of writing really good prompts! It's like learning the perfect way to ask questions so AI understands exactly what you want. Some people even have jobs doing this! It's a real superpower in the AI age.",
    illustration: <MagicWandIllustration />,
    pixelMood: "curious",
    highlight: "Prompt Engineering = Writing great instructions for AI!"
  },
  {
    title: "The Secret Ingredients 🧪",
    content: "Great prompts often have: 1) Clear instructions (what you want), 2) Context (background info), 3) Examples (show what you mean), and 4) Format (how you want the answer). It's like giving AI a recipe to follow!",
    illustration: <GoodVsBadPromptIllustration />,
    pixelMood: "teaching",
    highlight: "Good prompts include: instructions, context, examples, and format!"
  },
  {
    title: "You Can Learn This! 🚀",
    content: "The amazing thing is, anyone can learn Prompt Engineering - including you! Once you understand how to talk to AI effectively, you can use it to help with homework, create stories, learn new things, and so much more. Let's learn how!",
    illustration: <MagicWandIllustration />,
    pixelMood: "celebrating",
    highlight: "Learning to write good prompts is a superpower for using AI!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer
      pages={storyPages}
      conceptColor="bg-gradient-to-r from-yellow-500 to-orange-500"
      conceptEmoji="✨"
      onComplete={onComplete}
    />
  );
}
