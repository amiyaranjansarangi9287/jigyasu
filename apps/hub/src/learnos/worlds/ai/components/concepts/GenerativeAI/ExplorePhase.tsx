import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';

interface ExplorePhaseProps { onComplete: () => void; }

const promptParts = {
  subject: ['a cat', 'a dragon', 'a robot', 'a unicorn', 'a castle'],
  style: ['in watercolor style', 'as pixel art', 'like a cartoon', 'in neon colors', 'as a sketch'],
  setting: ['in space', 'underwater', 'in a forest', 'on a cloud', 'in a city'],
  mood: ['happy and bright', 'mysterious', 'magical', 'cozy', 'epic'],
};

const resultEmojis: Record<string, string> = {
  'a cat': '🐱', 'a dragon': '🐉', 'a robot': '🤖', 'a unicorn': '🦄', 'a castle': '🏰',
};

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [hasExplored, setHasExplored] = useState(false);

  const prompt = Object.values(selected).filter(Boolean).join(', ');
  const completeness = Object.keys(selected).length;

  const handleGenerate = async () => {
    if (completeness < 2) return;
    setIsGenerating(true);
    setGenerated(false);
    await new Promise(r => setTimeout(r, 2000));
    setGenerated(true);
    setIsGenerating(false);
    setHasExplored(true);
  };

  const mainEmoji = resultEmojis[selected.subject] || '✨';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-fuchsia-500 to-purple-500 p-4 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">🧸 Prompt-to-Art Studio</h2>
          <p className="text-fuchsia-100 mt-1 text-sm">Build a prompt and see AI create!</p>
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
            Pick options to build your image prompt. This is how real AI art generators work!
          </p>

          {/* Prompt Builder */}
          <div className="space-y-4 mb-6">
            {Object.entries(promptParts).map(([category, options]) => (
              <div key={category}>
                <label className="text-sm font-bold text-gray-700 capitalize mb-2 block">
                  {category === 'subject' ? '🎯 Subject' : category === 'style' ? '🎨 Style' : category === 'setting' ? '📍 Setting' : '💫 Mood'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {options.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelected({ ...selected, [category]: option })}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        selected[category] === option
                          ? "bg-fuchsia-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-fuchsia-100"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Preview */}
          <div className="bg-slate-900 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-fuchsia-400 text-sm font-medium">{t('auto.learning.s896_your_prompt', 'Your Prompt:')}</span>
              <span className="text-gray-400 text-xs">{completeness}/4 parts</span>
            </div>
            <p className={cn("text-white font-mono text-sm min-h-[40px]", !prompt && "text-gray-500 italic")}>
              {prompt || "Select options above..."}
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={completeness < 2 || isGenerating}
            className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 mb-4 transition-all"
          >
            {isGenerating ? '🎨 Creating...' : completeness < 2 ? 'Select at least 2 options' : '✨ Generate Art!'}
          </button>

          {/* Result */}
          {(isGenerating || generated) && (
            <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-2xl p-6 mb-4 text-center">
              {isGenerating ? (
                <div>
                  <div className="text-4xl animate-spin inline-block mb-3">🎨</div>
                  <p className="text-fuchsia-700 animate-pulse">AI is creating your art...</p>
                </div>) : (<div>
                  <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-gradient-to-br from-fuchsia-200 to-purple-200 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-7xl sm:text-8xl">{mainEmoji}</span>
                  </div>
                  <p className="text-fuchsia-700 font-medium">✨ "{prompt}"</p>
                  <p className="text-gray-500 text-sm mt-2">
                    In a real AI generator, this would be a detailed image!
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-xl mb-4">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Real AI art</strong> works just like this! You describe what you want 
              in a prompt, and AI generates a unique image. The better your prompt, the better the result!
            </p>
          </div>

          <div className="flex justify-end">
            <button onClick={onComplete} className={cn("px-6 py-3 rounded-xl font-medium transition-all", hasExplored ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:shadow-lg hover:scale-105" : "bg-gray-200 text-gray-500")}>Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
