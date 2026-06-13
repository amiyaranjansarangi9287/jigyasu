import StoryPlayer, { StoryPage } from '../../story/StoryPlayer';
import { useTranslation } from 'react-i18next';
import {
  LibrarianRobotIllustration,
  RAGProcessIllustration,
} from '../../illustrations';

interface ConceptPhaseProps {
  onComplete: () => void;
}

const storyPages: StoryPage[] = [
  {
    title: "The Super Librarian! 📚",
    content: "Imagine asking a librarian a tricky question. A great librarian doesn't just guess - they first find the PERFECT books about your topic, read the important parts, and THEN give you an amazing answer! That's exactly what RAG does for AI. It's like giving AI a library card!",
    illustration: <LibrarianRobotIllustration />,
    image: "/images/rag-story-1.jpg",
    pixelMood: "excited",
    highlight: "RAG = Looking things up BEFORE answering!"
  },
  {
    title: "The Problem: AI Can't Know Everything 🤔",
    content: "Here's a challenge - AI models learned from old information. They don't know today's news, your school's rules, or what happened last week! So how can they answer questions about things they never learned about? It seems impossible... but there's a clever solution!",
    pixelMood: "thinking",
    highlight: "AI models have a 'knowledge cutoff' - they don't know recent things!"
  },
  {
    title: "The Solution: Give AI a Library! 📖",
    content: "What if we gave AI access to the right documents whenever it needs to answer a question? That's RAG! Before answering, the AI searches through documents to find helpful information. It's like having a research assistant who does the homework for you!",
    illustration: <LibrarianRobotIllustration />,
    pixelMood: "celebrating",
    highlight: "RAG gives AI fresh, relevant information when needed!"
  },
  {
    title: "What Does RAG Stand For? 🔤",
    content: "RAG is a fun name! It stands for 'Retrieval-Augmented Generation'. Let me break that down: 'Retrieval' means finding documents (like a librarian finding books). 'Augmented' means enhanced or made better. 'Generation' means creating the answer. Find it, improve it, answer it!",
    illustration: <RAGProcessIllustration />,
    pixelMood: "teaching",
    highlight: "Retrieve → Augment → Generate = Better Answers!"
  },
  {
    title: "RAG in Action! 🚀",
    content: "Here's how RAG works: You ask a question. Step 1: RAG searches for helpful documents. Step 2: It gives those documents to the AI. Step 3: AI reads them and creates an accurate answer. It's like having a super-smart friend who always checks their facts!",
    illustration: <RAGProcessIllustration />,
    pixelMood: "celebrating",
    highlight: "RAG helps AI give accurate, up-to-date answers!"
  },
];

export default function ConceptPhase({ onComplete }: ConceptPhaseProps) {
  const { t } = useTranslation();
  return (
    <StoryPlayer
      pages={storyPages}
      conceptColor="bg-gradient-to-r from-green-500 to-emerald-500"
      conceptEmoji="📚"
      onComplete={onComplete}
    />
  );
}
