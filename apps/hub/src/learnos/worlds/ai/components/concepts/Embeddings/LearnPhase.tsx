import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';

interface LearnPhaseProps {
  onComplete: () => void;
}

// Simplified 2D embedding positions for visualization
const words = [
  { word: "dog", x: 20, y: 30, category: "animals" },
  { word: "cat", x: 25, y: 35, category: "animals" },
  { word: "puppy", x: 22, y: 28, category: "animals" },
  { word: "kitten", x: 27, y: 33, category: "animals" },
  { word: "car", x: 70, y: 70, category: "vehicles" },
  { word: "truck", x: 75, y: 68, category: "vehicles" },
  { word: "bus", x: 72, y: 75, category: "vehicles" },
  { word: "happy", x: 50, y: 15, category: "emotions" },
  { word: "joyful", x: 52, y: 18, category: "emotions" },
  { word: "sad", x: 55, y: 85, category: "emotions" },
  { word: "samosa", x: 15, y: 75, category: "food" },
  { word: "dosa", x: 18, y: 78, category: "food" },
];

const categoryColors: Record<string, string> = {
  animals: "bg-pink-500",
  vehicles: "bg-blue-500",
  emotions: "bg-yellow-500",
  food: "bg-green-500",
};

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  const selectedWordData = words.find(w => w.word === selectedWord);

  // Calculate distances from selected word
  const getDistance = (w1: typeof words[0], w2: typeof words[0]) => {
    return Math.sqrt(Math.pow(w1.x - w2.x, 2) + Math.pow(w1.y - w2.y, 2));
  };

  const sortedByDistance = selectedWordData
    ? [...words]
        .filter(w => w.word !== selectedWord)
        .sort((a, b) => getDistance(selectedWordData, a) - getDistance(selectedWordData, b))
    : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🔮 The Word Map</h2>
          <p className="text-indigo-100 mt-1">{t('auto.learning.s892_see_how_words_cluster_by_meaning', 'See how words cluster by meaning!')}</p>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-center">
            <p className="text-indigo-800">
              👆 <strong>{t('auto.learning.s893_click_on_any_word', 'Click on any word')}</strong> to see which words are closest to it!
            </p>
          </div>

          {/* Embedding Space Visualization */}
          <div className="bg-slate-900 rounded-2xl p-4 mb-6 relative" style={{ height: '350px' }}>
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full">
              {[0, 25, 50, 75, 100].map(v => (
                <g key={v}>
                  <line x1={`${v}%`} y1="0" x2={`${v}%`} y2="100%" stroke="#334155" strokeWidth="1" />
                  <line x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="#334155" strokeWidth="1" />
                </g>
              ))}
            </svg>

            {/* Connection lines to selected word */}
            {selectedWordData && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {sortedByDistance.slice(0, 3).map((w, i) => (
                  <line
                    key={w.word}
                    x1={`${selectedWordData.x}%`}
                    y1={`${selectedWordData.y}%`}
                    x2={`${w.x}%`}
                    y2={`${w.y}%`}
                    stroke={i === 0 ? "#22c55e" : i === 1 ? "#eab308" : "#ef4444"}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                ))}
              </svg>
            )}

            {/* Words */}
            {words.map((w) => {
              const isSelected = selectedWord === w.word;
              const rank = sortedByDistance.findIndex(sw =>sw.word === w.word);
              
              return (<button
                  key={w.word}
                  onClick={() => setSelectedWord(isSelected ? null : w.word)}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                    "px-3 py-1.5 rounded-full font-medium text-sm",
                    isSelected 
                      ? "bg-white text-slate-900 scale-125 shadow-lg z-20" 
                      : showCategories
                      ? `${categoryColors[w.category]} text-white`
                      : "bg-slate-700 text-white hover:bg-slate-600",
                    rank === 0 && "ring-2 ring-green-400",
                    rank === 1 && "ring-2 ring-yellow-400",
                    rank === 2 && "ring-2 ring-red-400"
                  )}
                  style={{ left: `${w.x}%`, top: `${w.y}%` }}
                >
                  {w.word}
                  {isSelected && <span className="ml-1">📍</span>}
                </button>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-2 left-2 text-xs text-slate-400">
              Similar words are close together
            </div>
          </div>

          {/* Distance Info */}
          {selectedWordData && (
            <div className="bg-slate-100 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-slate-800 mb-3">
                📏 Nearest neighbors to "{selectedWord}":
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {sortedByDistance.slice(0, 3).map((w, i) => (
                  <div
                    key={w.word}
                    className={cn(
                      "p-3 rounded-lg text-center",
                      i === 0 ? "bg-green-100" : i === 1 ? "bg-yellow-100" : "bg-red-100"
                    )}
                  >
                    <span className="text-2xl block mb-1">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </span>
                    <span className="font-bold">{w.word}</span>
                    <span className="text-xs block text-gray-600">
                      Distance: {getDistance(selectedWordData, w).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className={cn(
                "px-4 py-2 rounded-xl font-medium transition-all",
                showCategories
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
              )}
            >
              {showCategories ? "🎨 Showing Categories" : "Show Categories by Color"}
            </button>
          </div>

          {/* Category Legend */}
          {showCategories && (
            <div className="flex justify-center gap-4 mb-6">
              {Object.entries(categoryColors).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className={cn("w-4 h-4 rounded-full", color)} />
                  <span className="text-sm text-gray-600 capitalize">{cat}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:shadow-lg transition-all hover:scale-105"
            >Now let me try! 🧸</button>
          </div>
        </div>
      </div>
    </div>
  );
}
