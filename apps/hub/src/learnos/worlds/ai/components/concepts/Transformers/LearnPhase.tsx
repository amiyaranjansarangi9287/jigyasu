import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';

interface LearnPhaseProps {
  onComplete: () => void;
}

const attentionExamples = [
  {
    sentence: ["The", "cat", "sat", "because", "it", "was", "tired"],
    attentionPairs: [
      { from: 4, to: 1, strength: 0.9, explanation: "'it' refers to 'cat'" },
      { from: 6, to: 1, strength: 0.5, explanation: "'tired' describes the 'cat'" },
    ],
  },
  {
    sentence: ["I", "love", "samosa", "because", "it", "tastes", "delicious"],
    attentionPairs: [
      { from: 4, to: 2, strength: 0.9, explanation: "'it' refers to 'samosa'" },
      { from: 6, to: 2, strength: 0.6, explanation: "'delicious' describes 'samosa'" },
    ],
  },
  {
    sentence: ["The", "dog", "chased", "the", "ball", "and", "caught", "it"],
    attentionPairs: [
      { from: 7, to: 4, strength: 0.85, explanation: "'it' refers to 'ball'" },
      { from: 6, to: 1, strength: 0.7, explanation: "'caught' relates to 'dog'" },
    ],
  },
];

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [exampleIndex, setExampleIndex] = useState(0);
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const [showAllConnections, setShowAllConnections] = useState(false);

  const example = attentionExamples[exampleIndex];

  const getWordAttention = (wordIndex: number) => {
    return example.attentionPairs.filter(
      p => p.from === wordIndex || p.to === wordIndex
    );
  };

  const getConnectionOpacity = (pair: typeof example.attentionPairs[0]) => {
    if (showAllConnections) return pair.strength;
    if (hoveredWord === null) return 0.1;
    if (pair.from === hoveredWord || pair.to === hoveredWord) return pair.strength;
    return 0.05;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🔮 Understanding Attention</h2>
          <p className="text-orange-100 mt-1">{t('auto.learning.s956_see_how_words_connect_to_each_other', 'See how words connect to each other!')}</p>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-orange-800 text-center">
              👆 <strong>{t('auto.learning.s957_hover_over_words', 'Hover over words')}</strong> to see their attention connections!
            </p>
          </div>

          {/* Attention Visualization */}
          <div className="bg-slate-900 rounded-2xl p-8 mb-6">
            {/* Connection Lines (SVG) */}
            <div className="relative mb-8">
              <svg className="absolute inset-0 w-full h-20 pointer-events-none" style={{ top: '50px' }}>
                {example.attentionPairs.map((pair, i) => {
                  const fromX = (pair.from / (example.sentence.length - 1)) * 100;
                  const toX = (pair.to / (example.sentence.length - 1)) * 100;
                  const opacity = getConnectionOpacity(pair);
                  
                  return (
                    <g key={i}>
                      <path
                        d={`M ${fromX}% 0 Q ${(fromX + toX) / 2}% 60 ${toX}% 0`}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth={3 * pair.strength}
                        opacity={opacity}
                        className="transition-opacity duration-300"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Words */}
            <div className="flex justify-around items-center relative z-10">
              {example.sentence.map((word, i) => {
                const attention = getWordAttention(i);
                const isHighlighted = hoveredWord === i || 
                  (hoveredWord !== null && attention.some(a =>a.from === hoveredWord || a.to === hoveredWord));
                
                return (<button
                    key={i}
                    onMouseEnter={() => setHoveredWord(i)}
                    onMouseLeave={() => setHoveredWord(null)}
                    className={cn(
                      "px-3 py-2 rounded-lg font-medium transition-all",
                      isHighlighted
                        ? "bg-orange-500 text-white scale-110"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    )}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <div className="mt-8 min-h-[60px]">
              {hoveredWord !== null && getWordAttention(hoveredWord).length >0 && (<div className="bg-slate-800 rounded-xl p-4 text-center">
                  {getWordAttention(hoveredWord).map((pair, i) => (
                    <p key={i} className="text-orange-300">
                      💡 {pair.explanation}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowAllConnections(!showAllConnections)}
              className={cn(
                "px-4 py-2 rounded-xl font-medium transition-all",
                showAllConnections
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-100"
              )}
            >
              {showAllConnections ? "🔗 Showing All Connections" : "👆 Hover Mode"}
            </button>
          </div>

          {/* Example Selector */}
          <div className="flex justify-center gap-2 mb-6">
            {attentionExamples.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setExampleIndex(i);
                  setHoveredWord(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium transition-all",
                  exampleIndex === i
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Sentence {i + 1}
              </button>
            ))}
          </div>

          {/* Key Insight */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-orange-800 mb-2">🧠 Key Insight:</h3>
            <p className="text-orange-700">
              Attention helps Transformers understand that pronouns like "it" refer back to earlier nouns.
              This is how they understand context and meaning in sentences!
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transition-all hover:scale-105"
            >Now let me try! 🧸</button>
          </div>
        </div>
      </div>
    </div>
  );
}
