import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps {
  onComplete: () => void;
}

const images = [
  { emoji: '🐕', name: 'Dog', category: 'Animal' },
  { emoji: '🐈', name: 'Cat', category: 'Animal' },
  { emoji: '🚗', name: 'Car', category: 'Vehicle' },
  { emoji: '🚌', name: 'Bus', category: 'Vehicle' },
  { emoji: '🍎', name: 'Apple', category: 'Food' },
  { emoji: '🍕', name: 'Samosa', category: 'Food' },
  { emoji: '🌳', name: 'Tree', category: 'Nature' },
  { emoji: '🌸', name: 'Flower', category: 'Nature' },
];

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [targetCategory, setTargetCategory] = useState('Animal');
  const [showResults, setShowResults] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const categories = ['Animal', 'Vehicle', 'Food', 'Nature'];

  const toggleImage = (index: number) => {
    if (showResults) return;
    
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const checkAnswers = () => {
    setShowResults(true);
    setHasPlayed(true);
  };

  const resetGame = () => {
    setSelectedImages([]);
    setShowResults(false);
    setTargetCategory(categories[(categories.indexOf(targetCategory) + 1) % categories.length]);
  };

  const correctAnswers = images
    .map((img, i) => img.category === targetCategory ? i : -1)
    .filter(i => i !== -1);

  const score = selectedImages.filter(i =>images[i].category === targetCategory).length;
  const total = correctAnswers.length;

  return (<div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🧸 Image Classification Game</h2>
          <p className="text-teal-100 mt-1">Be the AI! Find all the {targetCategory}s!</p>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="bg-teal-50 rounded-xl p-4 mb-6 text-center">
            <p className="text-teal-800 font-medium">
              🎯 Challenge: Click all images that show a <span className="font-bold text-teal-600">{targetCategory}</span>!
            </p>
            <p className="text-teal-600 text-sm mt-1">
              This is what Computer Vision AI does - sorts images by category!
            </p>
          </div>

          {/* Category Selector */}
          <div className="flex justify-center gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setTargetCategory(cat);
                  setSelectedImages([]);
                  setShowResults(false);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all",
                  targetCategory === cat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-teal-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {images.map((img, i) => {
              const isSelected = selectedImages.includes(i);
              const isCorrect = img.category === targetCategory;
              
              let borderStyle = "border-gray-200";
              if (showResults) {
                if (isCorrect && isSelected) borderStyle = "border-green-500 bg-green-50";
                else if (isCorrect && !isSelected) borderStyle = "border-orange-500 bg-orange-50";
                else if (!isCorrect && isSelected) borderStyle = "border-red-500 bg-red-50";
              } else if (isSelected) {
                borderStyle = "border-teal-500 bg-teal-50";
              }

              return (
                <button
                  key={i}
                  onClick={() => toggleImage(i)}
                  className={cn(
                    "aspect-square rounded-xl border-4 flex flex-col items-center justify-center transition-all",
                    borderStyle,
                    !showResults && "hover:scale-105 hover:border-teal-300"
                  )}
                >
                  <span className="text-4xl mb-1">{img.emoji}</span>
                  <span className="text-xs text-gray-600">{img.name}</span>
                  {showResults && isCorrect && (
                    <span className="text-green-600 text-xs">✓ {img.category}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Results */}
          {showResults && (
            <div className={cn(
              "rounded-xl p-4 mb-6 text-center",
              score === total ? "bg-green-100" : "bg-orange-100"
            )}>
              <p className={cn(
                "font-bold text-lg",
                score === total ? "text-green-700" : "text-orange-700"
              )}>
                {score === total 
                  ? `🎉 Perfect! You found all ${total} ${targetCategory}s!`
                  : `You found ${score} of ${total} ${targetCategory}s!`
                }
              </p>
              <button
                onClick={resetGame}
                className="mt-3 px-4 py-2 bg-white rounded-lg font-medium hover:bg-gray-50"
              >{t('auto.learning.s882_try_another_category', 'Try Another Category →')}</button>
            </div>
          )}

          {/* Check Button */}
          {!showResults && (
            <button
              onClick={checkAnswers}
              disabled={selectedImages.length === 0}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50"
            >✅ Check My Answers!</button>
          )}

          {/* Tip */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
            <p className="text-yellow-800">
              💡 <strong>You're doing what AI does!</strong>Computer Vision sorts millions 
              of images into categories - you just did it with 8!</p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                hasPlayed
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500"
              )}
            >Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
