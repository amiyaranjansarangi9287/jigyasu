import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps {
  onComplete: () => void;
}

interface WordPoint {
  word: string;
  x: number;
  y: number;
}

const initialWords: WordPoint[] = [
  { word: "king", x: 30, y: 25 },
  { word: "queen", x: 35, y: 30 },
  { word: "man", x: 25, y: 40 },
  { word: "woman", x: 30, y: 45 },
];

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [words, setWords] = useState<WordPoint[]>(initialWords);
  const [dragging, setDragging] = useState<string | null>(null);
  const [newWord, setNewWord] = useState("");
  const [hasExplored, setHasExplored] = useState(false);

  const handleMouseDown = (word: string) => {
    setDragging(word);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setWords(words.map(w => 
      w.word === dragging 
        ? { ...w, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
        : w
    ));
    setHasExplored(true);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const addWord = () => {
    if (!newWord.trim() || words.some(w => w.word.toLowerCase() === newWord.toLowerCase())) {
      return;
    }
    
    setWords([...words, {
      word: newWord.trim(),
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50 + (Math.random() - 0.5) * 30,
    }]);
    setNewWord("");
    setHasExplored(true);
  };

  const removeWord = (word: string) => {
    setWords(words.filter(w => w.word !== word));
  };

  // Calculate similarities based on distance
  const getSimilarityPairs = () => {
    const pairs: { word1: string; word2: string; distance: number }[] = [];
    
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j < words.length; j++) {
        const dist = Math.sqrt(
          Math.pow(words[i].x - words[j].x, 2) + 
          Math.pow(words[i].y - words[j].y, 2)
        );
        pairs.push({ word1: words[i].word, word2: words[j].word, distance: dist });
      }
    }
    
    return pairs.sort((a, b) => a.distance - b.distance);
  };

  const pairs = getSimilarityPairs();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🧸 Embedding Playground</h2>
          <p className="text-indigo-100 mt-1">{t('auto.learning.s890_drag_words_to_create_your_own_word_map', 'Drag words to create your own word map!')}</p>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="bg-indigo-50 rounded-xl p-4 mb-6">
            <p className="text-indigo-800 text-center">
              🖱️ <strong>{t('auto.learning.s891_drag_words', 'Drag words')}</strong> to move them around. 
              Place similar words close together!
            </p>
          </div>

          {/* Add Word */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Add a new word..."
              className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addWord()}
            />
            <button
              onClick={addWord}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-all"
            >+ Add</button>
          </div>

          {/* Canvas */}
          <div 
            className="bg-slate-900 rounded-2xl relative mb-6 cursor-crosshair select-none"
            style={{ height: '350px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {[0, 25, 50, 75, 100].map(v => (
                <g key={v}>
                  <line x1={`${v}%`} y1="0" x2={`${v}%`} y2="100%" stroke="#334155" strokeWidth="1" />
                  <line x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="#334155" strokeWidth="1" />
                </g>
              ))}
            </svg>

            {/* Connection lines between close words */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {pairs.slice(0, 3).map((pair, i) => {
                const w1 = words.find(w => w.word === pair.word1)!;
                const w2 = words.find(w =>w.word === pair.word2)!;
                return (<line
                    key={`${pair.word1}-${pair.word2}`}
                    x1={`${w1.x}%`}
                    y1={`${w1.y}%`}
                    x2={`${w2.x}%`}
                    y2={`${w2.y}%`}
                    stroke={i === 0 ? "#22c55e" : i === 1 ? "#eab308" : "#f97316"}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity="0.6"
                  />
                );
              })}
            </svg>

            {/* Words */}
            {words.map((w) => (
              <div
                key={w.word}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2",
                  "px-3 py-1.5 rounded-full font-medium text-sm cursor-grab active:cursor-grabbing",
                  "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
                  "hover:scale-110 transition-transform shadow-lg",
                  dragging === w.word && "scale-125 ring-2 ring-white"
                )}
                style={{ left: `${w.x}%`, top: `${w.y}%` }}
                onMouseDown={() => handleMouseDown(w.word)}
              >
                {w.word}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWord(w.word);
                  }}
                  className="ml-1 opacity-50 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="absolute bottom-2 left-2 text-xs text-slate-400">
              Drag words to arrange them by similarity
            </div>
          </div>

          {/* Similarity Rankings */}
          <div className="bg-slate-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-slate-800 mb-3">📊 Current Similarity Rankings:</h3>
            <div className="space-y-2">
              {pairs.slice(0, 5).map((pair, i) => (
                <div key={`${pair.word1}-${pair.word2}`} className="flex items-center gap-3">
                  <span className="text-lg">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                  </span>
                  <span className="font-medium">
                    "{pair.word1}" ↔ "{pair.word2}"
                  </span>
                  <span className="text-gray-500 text-sm">
                    (distance: {pair.distance.toFixed(1)})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6">
            <h4 className="font-bold text-yellow-800 mb-2">🎯 Challenge:</h4>
            <p className="text-yellow-700">
              Try to arrange the words so that "king" is to "queen" as "man" is to "woman"!
              This is how real embeddings capture relationships!
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                hasExplored
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500"
              )}
            >Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
