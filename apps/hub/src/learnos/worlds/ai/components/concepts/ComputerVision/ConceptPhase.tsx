import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import {
  RobotEyesIllustration,
  PixelGridIllustration,
} from '../../illustrations';

interface ConceptPhaseProps {
  onComplete: () => void;
}

const storyPages: StoryPage[] = [
  {
    title: "Teaching Robots to See! 👁️",
    content: "You use your eyes every day to see the world around you - your friends' faces, your favorite toys, even this screen! But did you know we can teach computers to 'see' too? It's called Computer Vision, and it's like giving robots their very own eyes!",
    illustration: <RobotEyesIllustration />,
    pixelMood: "excited",
    highlight: "Computer Vision teaches machines to understand what they see in pictures and videos!"
  },
  {
    title: "Pictures Are Made of Tiny Dots! 🎨",
    content: "Here's a cool secret - every picture on a screen is made of millions of tiny colored squares called pixels! When you zoom in really close on any image, you can see them. Computers look at these pixels to understand what's in a picture. It's like a giant puzzle!",
    illustration: <PixelGridIllustration />,
    pixelMood: "teaching",
    highlight: "Pixels are tiny colored squares that make up every digital image!"
  },
  {
    title: "Finding Patterns in Pixels 🔍",
    content: "Just like you learned to recognize letters by seeing them many times, computers learn to recognize things in pictures! They notice patterns - like 'cats usually have pointy ears and whiskers' or 'cars have wheels'. The more pictures they see, the smarter they get!",
    illustration: <RobotEyesIllustration />,
    pixelMood: "thinking",
    highlight: "AI learns to recognize objects by finding patterns in lots of pictures!"
  },
  {
    title: "Computer Vision Is Everywhere! 📱",
    content: "You've probably already used Computer Vision today! When you use a face filter on a photo, unlock a phone with your face, or when your camera focuses on people - that's all Computer Vision! It's in self-driving cars, video games, and even helps doctors look at X-rays!",
    pixelMood: "celebrating",
    highlight: "Face filters, phone cameras, and self-driving cars all use Computer Vision!"
  },
  {
    title: "What Can Computer Vision Do? 🎯",
    content: "Computer Vision can do amazing things! It can recognize faces, read text in photos, detect if someone is smiling, find objects in videos, and even help robots navigate around obstacles. It's like giving superpowers to machines!",
    illustration: <RobotEyesIllustration />,
    pixelMood: "excited",
    highlight: "Computer Vision helps machines see, understand, and interact with the visual world!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer
      pages={storyPages}
      conceptColor="bg-gradient-to-r from-teal-500 to-cyan-500"
      conceptEmoji="👁️"
      onComplete={onComplete}
    />
  );
}
