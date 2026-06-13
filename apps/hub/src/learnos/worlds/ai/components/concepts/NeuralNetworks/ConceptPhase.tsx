import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import {
  BrainIllustration,
  NeuronsPassingNotesIllustration,
  NeuralNetworkIllustration,
  LearningFromExamplesIllustration,
} from '../../illustrations';

interface ConceptPhaseProps {
  onComplete: () => void;
}

const storyPages: StoryPage[] = [
  {
    title: "Your Amazing Brain! 🧠",
    content: "Hey there, explorer! Did you know you have something incredible inside your head? It's your brain! And inside your brain, there are billions of tiny helpers called neurons. They work together every single day to help you think, dream, remember your favorite songs, and even recognize your best friend's face!",
    illustration: <BrainIllustration />,
    image: "/images/nn-story-1.jpg",
    pixelMood: "excited",
    highlight: "Your brain has billions of neurons - tiny helpers that work together!"
  },
  {
    title: "How Neurons Talk to Each Other 💬",
    content: "Imagine you're in class and you want to tell your friend a secret. You write a note and pass it along, right? That's exactly how neurons work! One neuron sends a message to the next, and then to the next, until the message gets where it needs to go. Pretty cool teamwork, isn't it?",
    illustration: <NeuronsPassingNotesIllustration />,
    image: "/images/nn-story-2.jpg",
    pixelMood: "teaching",
    highlight: "Neurons pass messages to each other, just like passing notes in class!"
  },
  {
    title: "Computers Can Learn Too! 🤖",
    content: "Here's where it gets really exciting! Some super smart scientists thought: 'What if we could teach computers to learn like our brains do?' So they created something amazing - artificial neurons! These are like tiny math helpers inside computers that can learn patterns, just like you learn to recognize letters and numbers!",
    illustration: <NeuralNetworkIllustration />,
    image: "/images/nn-story-3.jpg",
    pixelMood: "curious",
    highlight: "Artificial neurons are computer helpers inspired by your brain!"
  },
  {
    title: "What is a Neural Network? 🕸️",
    content: "When we connect lots of these artificial neurons together, we create a Neural Network! Think of it like building a super team. One neuron alone can't do much, but when millions work together? They can recognize faces in photos, process speech, and even help cars drive themselves! Teamwork makes the dream work!",
    illustration: <NeuralNetworkIllustration />,
    image: "/images/nn-story-4.jpg",
    pixelMood: "celebrating",
    highlight: "A Neural Network is a team of artificial neurons working together!"
  },
  {
    title: "Learning from Examples 📚",
    content: "Here's the magical part - neural networks are trained using examples, in a way that's inspired by how you learn! Remember how you learned what a cat looks like? You saw lots of cats! Neural networks are shown thousands of cat pictures, and they adjust their patterns to recognize cats better - the pointy ears, the whiskers, the fuzzy fur. The more examples they process, the better they get at recognizing patterns!",
    illustration: <LearningFromExamplesIllustration />,
    image: "/images/nn-story-5.jpg",
    pixelMood: "teaching",
    highlight: "Neural networks are trained by processing lots and lots of examples!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer
      pages={storyPages}
      conceptColor="bg-gradient-to-r from-purple-500 to-pink-500"
      conceptEmoji="🧠"
      onComplete={onComplete}
    />
  );
}
