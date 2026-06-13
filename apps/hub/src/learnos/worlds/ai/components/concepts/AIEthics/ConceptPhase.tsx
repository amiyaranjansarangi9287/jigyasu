import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import {
  BalanceScaleIllustration,
  PrivacyShieldIllustration,
} from '../../illustrations';

interface ConceptPhaseProps {
  onComplete: () => void;
}

const storyPages: StoryPage[] = [
  {
    title: "Being a Good AI Citizen! ⚖️",
    content: "AI is amazing and can help us do incredible things! But like any powerful tool, we need to use it responsibly. Just like there are rules for playing fair in games, there are rules for using AI the right way. Let's learn how to be good AI citizens!",
    illustration: <BalanceScaleIllustration />,
    pixelMood: "teaching",
    highlight: "With great AI power comes great responsibility!"
  },
  {
    title: "AI Can Make Mistakes 🤔",
    content: "Here's something important - AI isn't perfect! It can sometimes give wrong answers, make up facts, or be unfair without meaning to. That's why we always need to double-check what AI tells us, just like we'd check if a friend's answer on homework is correct.",
    pixelMood: "thinking",
    highlight: "Always verify AI's answers - it can make mistakes!"
  },
  {
    title: "Fairness Matters 🤝",
    content: "AI learns from data that humans created, and sometimes that data can be unfair or biased. This means AI might accidentally treat some people differently than others. Scientists are working hard to make AI fairer, but we should always think about whether AI is being fair to everyone.",
    illustration: <BalanceScaleIllustration />,
    pixelMood: "curious",
    highlight: "AI should treat everyone fairly and equally!"
  },
  {
    title: "Honesty About AI 🔍",
    content: "It's important to be honest about when we use AI. If you use AI to help write a story, tell your teacher! If you see an AI-generated picture, don't pretend a person made it. Being honest helps everyone understand what's real and what's AI-created.",
    pixelMood: "teaching",
    highlight: "Be honest about when and how you use AI!"
  },
  {
    title: "Privacy and Safety 🛡️",
    content: "Never share personal information with AI - like your address, phone number, or passwords. And remember, not everything AI creates should be shared. Be kind in how you use AI, and never use it to hurt or trick others. You're the human in charge!",
    illustration: <PrivacyShieldIllustration />,
    pixelMood: "excited",
    highlight: "Keep personal info private and use AI kindly!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer
      pages={storyPages}
      conceptColor="bg-gradient-to-r from-rose-500 to-pink-500"
      conceptEmoji="⚖️"
      onComplete={onComplete}
    />
  );
}
