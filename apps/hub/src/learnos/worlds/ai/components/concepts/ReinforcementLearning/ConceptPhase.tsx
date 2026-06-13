import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import { PuppyTrainingIllustration, RLLoopIllustration, GridWorldIllustration } from '../../illustrations';

interface ConceptPhaseProps { onComplete: () => void; }

const storyPages: StoryPage[] = [
  {
    title: "Training a Puppy! 🐕",
    content: "Have you ever trained a pet? When a puppy sits on command, you give it a treat! When it chews your shoes... no treat. Over time, the puppy learns which behaviors earn rewards. This simple idea is the foundation of Reinforcement Learning!",
    illustration: <PuppyTrainingIllustration />,
    pixelMood: "excited",
    highlight: "Reinforcement Learning = learning from rewards and penalties!"
  },
  {
    title: "Try, Fail, Learn, Repeat 🔄",
    content: "Imagine learning to ride a bike. You fall, get up, try again. Each time you stay balanced a little longer! Reinforcement Learning works the same way. The AI tries something, sees what happens, and adjusts. Failure isn't bad — it's how you learn!",
    illustration: <RLLoopIllustration />,
    pixelMood: "thinking",
    highlight: "AI learns by trying things over and over, getting better each time!"
  },
  {
    title: "The Three Key Parts 🧩",
    content: "Every RL system has three parts: the Agent (the learner — like our puppy), the Environment (the world it lives in), and the Reward (treats for good actions, nothing for bad ones). The agent explores the environment and learns which actions lead to rewards!",
    illustration: <RLLoopIllustration />,
    pixelMood: "teaching",
    highlight: "Agent + Environment + Reward = Reinforcement Learning!"
  },
  {
    title: "RL Is Everywhere! 🌍",
    content: "Video game characters that learn to beat levels? Reinforcement Learning! Robots learning to walk? RL! Self-driving cars learning traffic rules? RL again! Even the recommendation system suggesting your next favorite video uses ideas from RL!",
    illustration: <GridWorldIllustration />,
    pixelMood: "celebrating",
    highlight: "Games, robots, and self-driving cars all use Reinforcement Learning!"
  },
  {
    title: "You Already Know RL! 🧠",
    content: "Here's a secret — you've been doing Reinforcement Learning your whole life! Touching something hot? Ouch! You learned not to do that. Studying hard for a test? Good grade! You learned that studying works. Your brain is the ultimate RL machine!",
    illustration: <PuppyTrainingIllustration />,
    pixelMood: "excited",
    highlight: "Your brain learns from rewards and consequences every day!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer pages={storyPages} conceptColor="bg-gradient-to-r from-emerald-500 to-lime-500" conceptEmoji="🎮" onComplete={onComplete} />
  );
}
