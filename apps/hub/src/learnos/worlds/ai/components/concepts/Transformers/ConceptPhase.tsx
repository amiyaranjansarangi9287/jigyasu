import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import {
  DetectiveIllustration,
  AttentionIllustration,
} from '../../illustrations';

interface ConceptPhaseProps {
  onComplete: () => void;
}

const storyPages: StoryPage[] = [
  {
    title: "The Super Detective! 🔍",
    content: "Imagine a super detective who has an amazing power - they can look at ALL the clues in a mystery at the exact same time! While other detectives look at clues one by one, this detective sees the whole picture instantly. That's the superpower of Transformers!",
    illustration: <DetectiveIllustration />,
    image: "/images/transformer-story-1.jpg",
    pixelMood: "excited",
    highlight: "Transformers can look at all parts of a sentence at once!"
  },
  {
    title: "The Old Way Was Slow 🐌",
    content: "Before Transformers, computers read text like this: word... by... word... by... word. It was pretty slow! And here's the tricky part - by the time they reached the end of a long sentence, they sometimes forgot what was at the beginning! Not great for understanding stories, right?",
    pixelMood: "thinking",
    highlight: "Reading one word at a time made it hard to understand long sentences."
  },
  {
    title: "The New Way Is Fast! ⚡",
    content: "Transformers changed everything! They can see the ENTIRE sentence at once and understand how every word connects to every other word. It's like having super vision! This makes them incredibly fast and much better at understanding what sentences really mean.",
    illustration: <DetectiveIllustration />,
    pixelMood: "celebrating",
    highlight: "Transformers process whole sentences together - super fast and smart!"
  },
  {
    title: "The Magic of Attention 🎯",
    content: "Here's the coolest part - Transformers have something called 'Attention'. It helps them figure out which words should 'look at' which other words. Like in 'The cat sat because IT was tired' - 'IT' needs to pay attention to 'cat' to know what 'IT' means! Smart, right?",
    illustration: <AttentionIllustration />,
    pixelMood: "teaching",
    highlight: "Attention connects related words, even when they're far apart!"
  },
  {
    title: "Transformers Are Everywhere! 🌍",
    content: "ChatGPT? Powered by Transformers! Google Translate? Transformers! Voice assistants on your phone? You guessed it - Transformers! They're the amazing technology behind most AI that understands language today. And now you know their secret!",
    pixelMood: "celebrating",
    highlight: "Transformers power most AI language tools you use today!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer
      pages={storyPages}
      conceptColor="bg-gradient-to-r from-orange-500 to-red-500"
      conceptEmoji="🤖"
      onComplete={onComplete}
    />
  );
}
