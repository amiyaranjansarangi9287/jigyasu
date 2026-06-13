import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import { PrivacyShieldIllustration, BalanceScaleIllustration } from '../../illustrations';

interface ConceptPhaseProps { onComplete: () => void; }

const storyPages: StoryPage[] = [
  {
    title: "Keeping AI Safe! 🛡️",
    content: "AI is like a superpower — and every superpower needs safety measures! Just like cars have seatbelts and bikes have helmets, AI needs special protections called 'guardrails' to make sure it stays helpful and doesn't cause problems.",
    illustration: <PrivacyShieldIllustration />,
    pixelMood: "teaching",
    highlight: "AI Safety = making sure AI stays helpful, harmless, and honest!"
  },
  {
    title: "AI Can Be Tricked! 🎭",
    content: "Here's something surprising — you can sometimes trick AI into saying wrong or silly things! People have found ways to make AI ignore its rules. That's why AI companies work really hard to build strong guardrails. It's like building a fence to keep things safe!",
    pixelMood: "thinking",
    highlight: "Guardrails prevent AI from being tricked into doing harmful things."
  },
  {
    title: "Deepfakes & Fake Content 🔍",
    content: "AI can now create fake videos of real people, fake news articles, and fake voices! These are called 'deepfakes'. It's getting harder to tell what's real and what's AI-made. That's why it's super important to check your sources and think critically about what you see online.",
    illustration: <BalanceScaleIllustration />,
    pixelMood: "curious",
    highlight: "Always question: Is this real? Who made it? Can I verify it?"
  },
  {
    title: "When to Ask an Adult 👨‍👩‍👧",
    content: "If AI ever says something that makes you feel uncomfortable, confused, or scared — tell an adult you trust! If someone sends you AI content that seems wrong or harmful, don't keep it to yourself. Adults can help you figure out what's safe and what's not.",
    pixelMood: "teaching",
    highlight: "When in doubt, always ask a trusted adult for help!"
  },
  {
    title: "You're the Safety Expert! ⭐",
    content: "Now you know about AI safety, you can help keep everyone safe! Share what you've learned with friends. Think before you share AI content. And remember — the most important safety feature is YOU. A smart, thoughtful person using AI responsibly!",
    illustration: <PrivacyShieldIllustration />,
    pixelMood: "celebrating",
    highlight: "You are the best safety feature — think, verify, and stay smart!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer pages={storyPages} conceptColor="bg-gradient-to-r from-sky-500 to-blue-600" conceptEmoji="🛡️" onComplete={onComplete} />
  );
}
