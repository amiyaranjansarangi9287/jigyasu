import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import { WordMapIllustration } from '../../illustrations';

interface ConceptPhaseProps {
  onComplete: () => void;
}

const storyPages: StoryPage[] = [
  {
    title: "Words Have Meaning! 📝",
    content: "When you hear 'dog', you think of a furry friend that barks and loves belly rubs! When you hear 'cat', you think of a furry friend that meows and loves naps! Both are pets, but they're different. You understand this instantly - but how can we help computers understand it too?",
    pixelMood: "curious",
    highlight: "Words have meanings and relationships that computers need to understand!"
  },
  {
    title: "Computers Only See Numbers! 🔢",
    content: "Here's a fun fact - computers don't understand words like we do. They only understand numbers! To a computer, 'cat' is just some letters. So how do we help computers understand that 'cat' and 'kitten' are related, but 'cat' and 'spaceship' aren't? We need a clever trick!",
    pixelMood: "thinking",
    highlight: "We need to turn words into numbers that capture their meaning!"
  },
  {
    title: "Introducing Embeddings! ✨",
    content: "Embeddings are like magic coordinates! They turn each word into a list of numbers - like a location on a treasure map. The amazing part? Similar words get similar numbers, so they're close together on the map! 'Happy' and 'joyful' would be neighbors, while 'happy' and 'refrigerator' would be far apart!",
    illustration: <WordMapIllustration />,
    pixelMood: "excited",
    highlight: "Embeddings are number-coordinates that capture word meanings!"
  },
  {
    title: "The Word Map 🗺️",
    content: "Imagine a magical map where similar things live close together. 'Dog' and 'cat' are both pets, so they're neighbors on this map! 'Car' and 'truck' are both vehicles, so they're neighbors too! But 'dog' and 'car'? They're in completely different neighborhoods! This map is what embeddings create!",
    illustration: <WordMapIllustration />,
    pixelMood: "teaching",
    highlight: "Similar words = close together. Different words = far apart!"
  },
  {
    title: "Why Embeddings Are Amazing 🎯",
    content: "Embeddings help AI understand that 'happy' and 'joyful' mean almost the same thing. They help search engines find what you're looking for even if you use different words! They're used everywhere - in voice assistants, recommendation systems, and language translators. Pretty powerful, right?",
    illustration: <WordMapIllustration />,
    pixelMood: "celebrating",
    highlight: "Embeddings help AI understand synonyms and related concepts!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer
      pages={storyPages}
      conceptColor="bg-gradient-to-r from-indigo-500 to-violet-500"
      conceptEmoji="🗺️"
      onComplete={onComplete}
    />
  );
}
