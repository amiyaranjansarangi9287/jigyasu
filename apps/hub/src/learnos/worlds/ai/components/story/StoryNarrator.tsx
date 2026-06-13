import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface StoryNarratorProps {
  text: string;
  speed?: number; // ms per character
  onComplete?: () => void;
}

export default function StoryNarrator({
  text, 
  speed = 30,
  onComplete 
}: StoryNarratorProps) {
  const { t } = useTranslation();
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex >= text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, onComplete]);

  // Allow clicking to complete immediately
  const handleClick = () => {
    if (!isComplete) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      onComplete?.();
    }
  };

  return (
    <span 
      onClick={handleClick}
      className="cursor-pointer"
      title="Click to show all text"
    >
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-5 bg-purple-500 ml-1 animate-pulse" />
      )}
    </span>
  );
}
