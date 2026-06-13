import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import { AIArtistIllustration, DiffusionIllustration, CreativeTypesIllustration } from '../../illustrations';

interface ConceptPhaseProps { onComplete: () => void; }

const storyPages: StoryPage[] = [
  {
    title: "AI That Creates! 🎨",
    content: "Most AI we've learned about so far analyzes things — it recognizes cats in photos or predicts the next word. But Generative AI is different — it CREATES brand new things! Images, music, stories, videos — things that never existed before. It's like giving a computer imagination!",
    illustration: <AIArtistIllustration />,
    pixelMood: "excited",
    highlight: "Generative AI creates new content — images, text, music, and more!"
  },
  {
    title: "How Does It Create? 🪄",
    content: "Remember how neural networks learn patterns? Generative AI takes this to the next level! It learns patterns from millions of examples, then uses those patterns to create something new. It's like an artist who studied thousands of paintings and can now paint in any style!",
    illustration: <CreativeTypesIllustration />,
    pixelMood: "teaching",
    highlight: "Gen AI learns patterns, then uses them to create something brand new!"
  },
  {
    title: "From Noise to Art ✨",
    content: "One amazing technique is called Diffusion. Imagine starting with a TV screen full of static (random dots). Slowly, step by step, the AI removes noise and shapes it into a beautiful picture! It's like a sculptor chipping away at marble to reveal a statue inside.",
    illustration: <DiffusionIllustration />,
    pixelMood: "curious",
    highlight: "Diffusion models start with random noise and gradually create images!"
  },
  {
    title: "Gen AI Is Everywhere! 🌟",
    content: "ChatGPT writes stories and answers questions. DALL-E and Midjourney create amazing images from text descriptions. AI can compose music, design logos, even help write code! You've probably already used or seen Generative AI today without knowing it!",
    illustration: <CreativeTypesIllustration />,
    pixelMood: "celebrating",
    highlight: "Gen AI powers chatbots, image generators, music composers, and more!"
  },
  {
    title: "Creating Responsibly 🤝",
    content: "With great creative power comes great responsibility! We should always be honest about what's AI-generated, respect artists' original work, and use Gen AI as a creative partner — not a replacement for human creativity. Your ideas plus AI = amazing things!",
    illustration: <AIArtistIllustration />,
    pixelMood: "teaching",
    highlight: "Use Gen AI as a creative partner, always honestly and responsibly!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer pages={storyPages} conceptColor="bg-gradient-to-r from-fuchsia-500 to-purple-500" conceptEmoji="🎨" onComplete={onComplete} />
  );
}
