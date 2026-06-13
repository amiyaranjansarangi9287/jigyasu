import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';

interface ExplorePhaseProps {
  onComplete: () => void;
}

const sentences = [
  "The dog ate its food quickly",
  "She gave him the book yesterday",
  "The robot learned to speak English",
];

export default function ExplorePhase({
  onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [selectedSentence, setSelectedSentence] = useState(0);
  const [attentionMatrix, setAttentionMatrix] = useState<number[][]>([]);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [hasExplored, setHasExplored] = useState(false);

  const words = sentences[selectedSentence].split(" ");

  // Generate random but sensible attention when selecting a sentence
  const generateAttention = () => {
    const n = words.length;
    const matrix: number[][] = [];
    
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j < n; j++) {
        // Create some meaningful patterns
        if (i === j) {
          row.push(0.8 + Math.random() * 0.2); // Self-attention is high
        } else if (Math.abs(i - j) === 1) {
          row.push(0.4 + Math.random() * 0.3); // Adjacent words have some attention
        } else {
          row.push(Math.random() * 0.4); // Random for others
        }
      }
      matrix.push(row);
    }
    
    setAttentionMatrix(matrix);
    setHasExplored(true);
  };

  const getColor = (value: number) => {
    const r = Math.round(249 * value);
    const g = Math.round(115 * value);
    const b = Math.round(22 * value);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🧸 Attention Matrix Explorer</h2>
          <p className="text-orange-100 mt-1">{t('auto.learning.s952_build_and_explore_attention_patterns', 'Build and explore attention patterns!')}</p>
        </div>

        <div className="p-6">
          {/* Sentence Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auto.learning.s953_choose_a_sentence', 'Choose a sentence:')}</label>
            <div className="flex flex-wrap gap-2">
              {sentences.map((sentence, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedSentence(i);
                    setAttentionMatrix([]);
                    setSelectedWord(null);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedSentence === i
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                  )}
                >
                  "{sentence}"
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-6">
            <button
              onClick={generateAttention}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
            >✨ Generate Attention Pattern</button>
          </div>

          {/* Attention Matrix */}
          {attentionMatrix.length >0 && (<div className="bg-slate-900 rounded-2xl p-6 mb-6 overflow-x-auto">
              <p className="text-center text-gray-400 mb-4">
                Click on any cell to see attention strength!
              </p>
              
              <div className="inline-block min-w-full">
                {/* Header Row */}
                <div className="flex mb-2">
                  <div className="w-20 h-8" />
                  {words.map((word, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-16 h-8 flex items-center justify-center text-xs font-medium truncate px-1",
                        selectedWord === i ? "text-orange-400" : "text-gray-400"
                      )}
                    >
                      {word}
                    </div>
                  ))}
                </div>

                {/* Matrix Rows */}
                {words.map((rowWord, i) => (
                  <div key={i} className="flex mb-1">
                    <div 
                      className={cn(
                        "w-20 h-12 flex items-center justify-end pr-2 text-xs font-medium truncate",
                        selectedWord === i ? "text-orange-400" : "text-gray-400"
                      )}
                    >
                      {rowWord}
                    </div>
                    {attentionMatrix[i].map((value, j) => (
                      <button
                        key={j}
                        onClick={() => setSelectedWord(selectedWord === i && selectedWord === j ? null : i)}
                        onMouseEnter={() => setSelectedWord(i)}
                        className={cn(
                          "w-16 h-12 rounded-lg m-0.5 flex items-center justify-center text-xs font-bold transition-all",
                          "hover:scale-110 hover:z-10"
                        )}
                        style={{ 
                          backgroundColor: getColor(value),
                          color: value > 0.5 ? 'white' : '#1e293b'
                        }}
                      >
                        {(value * 100).toFixed(0)}%
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <span className="text-gray-400 text-sm">{t('auto.learning.s954_low_attention', 'Low Attention')}</span>
                <div className="flex">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((v, i) => (
                    <div
                      key={i}
                      className="w-8 h-4"
                      style={{ backgroundColor: getColor(v) }}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">{t('auto.learning.s955_high_attention', 'High Attention')}</span>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="bg-orange-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-orange-800 mb-2">{t('auto.worlds_ai_components_concepts_Transformers_ExplorePhase.what_you_re_seeing', "📊 What You're Seeing:")}</h3>
            <ul className="text-orange-700 space-y-2">
              <li>• Each row shows how much one word "pays attention" to all other words</li>
              <li>• Brighter colors = more attention</li>
              <li>• Words often pay high attention to themselves (diagonal)</li>
              <li>• Related words (like pronouns and their nouns) also have high attention!</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                hasExplored
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500"
              )}
            >Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
