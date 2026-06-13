import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps {
  onComplete: () => void;
}

const wordPredictions: Record<string, { word: string; prob: number }[]> = {
  "The cat sat on the": [
    { word: "mat", prob: 0.35 },
    { word: "floor", prob: 0.25 },
    { word: "chair", prob: 0.20 },
    { word: "bed", prob: 0.15 },
    { word: "table", prob: 0.05 },
  ],
  "I love to eat": [
    { word: "samosa", prob: 0.28 },
    { word: "food", prob: 0.22 },
    { word: "kulfi", prob: 0.20 },
    { word: "chocolate", prob: 0.18 },
    { word: "vegetables", prob: 0.12 },
  ],
  "The sky is": [
    { word: "blue", prob: 0.40 },
    { word: "clear", prob: 0.25 },
    { word: "beautiful", prob: 0.15 },
    { word: "dark", prob: 0.12 },
    { word: "cloudy", prob: 0.08 },
  ],
  "My favorite color is": [
    { word: "blue", prob: 0.30 },
    { word: "red", prob: 0.25 },
    { word: "green", prob: 0.20 },
    { word: "purple", prob: 0.15 },
    { word: "yellow", prob: 0.10 },
  ],
};

const prompts = Object.keys(wordPredictions);

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [customText, setCustomText] = useState("");
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasExplored, setHasExplored] = useState(false);

  const predictions = wordPredictions[selectedPrompt];

  const generateResponse = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGeneratedTokens([]);
    setHasExplored(true);

    // Simulate token-by-token generation
    const response = predictions.map(p => p.word);
    const selectedWords = response.slice(0, 3 + Math.floor(Math.random() * 2));
    
    for (const word of selectedWords) {
      await new Promise(r => setTimeout(r, 400));
      setGeneratedTokens(prev => [...prev, word]);
    }
    
    setIsGenerating(false);
  };

  const handleWordClick = (word: string) => {
    setCustomText(prev => prev + " " + word);
    setHasExplored(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🧸 Word Prediction Playground</h2>
          <p className="text-cyan-100 mt-1">{t('auto.learning.s901_see_how_llms_predict_the_next_word', 'See how LLMs predict the next word!')}</p>
        </div>

        <div className="p-6">
          {/* Prompt Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auto.learning.s902_choose_a_starting_phrase', 'Choose a starting phrase:')}</label>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setGeneratedTokens([]);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedPrompt === prompt
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                  )}
                >
                  "{prompt}..."
                </button>
              ))}
            </div>
          </div>

          {/* Prediction Visualization */}
          <div className="bg-slate-900 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <span className="text-white text-lg">{selectedPrompt}</span>
              <span className="text-blue-400 ml-2">
                {generatedTokens.length > 0 
                  ? generatedTokens.join(" ") 
                  : "___"}
              </span>
            </div>

            {/* Probability Bars */}
            <div className="space-y-3">
              <p className="text-gray-400 text-sm text-center mb-4">
                Possible next words (with probability):
              </p>
              {predictions.map((pred, i) => (
                <button
                  key={i}
                  onClick={() => handleWordClick(pred.word)}
                  className="w-full group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-right text-white font-medium group-hover:text-blue-400 transition-colors">
                      {pred.word}
                    </span>
                    <div className="flex-1 h-8 bg-slate-700 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${pred.prob * 100}%` }}
                      >
                        <span className="text-white text-sm font-medium">
                          {(pred.prob * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={generateResponse}
              disabled={isGenerating}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isGenerating ? "Generating... ✨" : "Generate Completion 🚀"}
            </button>
          </div>

          {/* Build Your Own */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-blue-800 mb-2">✏️ Your Custom Sentence</h3>
            <p className="text-blue-600 text-sm mb-3">
              Click words above to build your own sentence!
            </p>
            <div className="bg-white rounded-xl p-4 min-h-[60px] border-2 border-blue-200">
              {customText || <span className="text-gray-400">{t('auto.learning.s903_click_words_to_add_them_here', 'Click words to add them here...')}</span>}
            </div>
            {customText && (
              <button
                onClick={() => setCustomText("")}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >{t('auto.learning.s904_clear', 'Clear')}</button>
            )}
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6">
            <p className="text-yellow-800 font-medium">💡 What to notice:</p>
            <ul className="text-yellow-700 text-sm mt-2 space-y-1">
              <li>• The highest probability word is most likely to be chosen</li>
              <li>• But LLMs can pick less likely words for variety!</li>
              <li>• Context matters - different prompts = different predictions</li>
            </ul>
          </div>

          {/* Complete */}
          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                hasExplored
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500"
              )}
            >Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
