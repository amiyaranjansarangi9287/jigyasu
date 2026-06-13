import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';

interface LearnPhaseProps {
  onComplete: () => void;
}

const tokenExamples = [
  { text: "Hello", tokens: ["Hello"] },
  { text: "Cat", tokens: ["Cat"] },
  { text: "Unhappy", tokens: ["Un", "happy"] },
  { text: "I love samosa!", tokens: ["I", " love", " samosa", "!"] },
  { text: "Neural networks are amazing", tokens: ["Neural", " networks", " are", " amazing"] },
];

const predictionDemo = [
  { prompt: "The sun is", options: ["shining", "bright", "yellow", "hot"], best: 0 },
  { prompt: "I like to eat", options: ["samosa", "food", "delicious", "running"], best: 0 },
  { prompt: "Cats and dogs are", options: ["pets", "animals", "friends", "purple"], best: 1 },
];

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedTokens, setAnimatedTokens] = useState<string[]>([]);
  const [predictionStep, setPredictionStep] = useState(0);
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);

  const steps = [
    { title: "Breaking Text into Tokens 🧩", type: "tokenization" },
    { title: "Token Animation ✨", type: "animation" },
    { title: "Predicting the Next Word 🎯", type: "prediction" },
  ];

  useEffect(() => {
    if (step === 1 && !isAnimating) {
      animateTokenization();
    }
  }, [step]);

  const animateTokenization = async () => {
    setIsAnimating(true);
    const tokens = ["AI", " is", " really", " cool", "!"];
    
    for (let i = 0; i < tokens.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setAnimatedTokens(prev => [...prev, tokens[i]]);
    }
    setIsAnimating(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🔮 How LLMs Work</h2>
          <p className="text-blue-100 mt-1">{steps[step].title}</p>
        </div>

        <div className="p-6">
          {/* Step 0: Tokenization */}
          {step === 0 && (
            <div>
              <p className="text-gray-600 mb-6 text-center">
                Click on any example to see how text is broken into tokens!
              </p>
              <div className="grid gap-4 mb-6">
                {tokenExamples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedToken(i)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      selectedToken === i 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">"{example.text}"</span>
                      <span className="text-blue-500">→</span>
                      <div className="flex gap-1">
                        {example.tokens.map((token, j) => (
                          <span
                            key={j}
                            className={cn(
                              "px-2 py-1 rounded text-sm font-mono",
                              selectedToken === i 
                                ? "bg-blue-500 text-white animate-pulse" 
                                : "bg-gray-200 text-gray-700"
                            )}
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-blue-700">
                  💡 Notice how some words stay whole, but longer words get split into pieces!
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Animation */}
          {step === 1 && (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Watch as text gets broken into tokens one by one!
              </p>
              
              <div className="bg-slate-900 rounded-2xl p-8 mb-6">
                <div className="text-xl text-white mb-4 font-mono">"AI is really cool!"</div>
                <div className="text-gray-400 mb-4">⬇️ Becomes ⬇️</div>
                <div className="flex justify-center gap-2 flex-wrap min-h-[40px]">
                  {animatedTokens.map((token, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg font-mono animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-purple-700">
                  🧩 Each colored box is a token - the building blocks LLMs use to understand text!
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Prediction */}
          {step === 2 && (
            <div>
              <p className="text-gray-600 mb-6 text-center">
                Try predicting like an LLM! What word comes next?
              </p>
              
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 mb-6">
                <div className="text-center text-white mb-4">
                  <span className="text-xl">{predictionDemo[predictionStep].prompt}</span>
                  <span className="text-blue-400 animate-pulse ml-2">___?</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {predictionDemo[predictionStep].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPrediction(i)}
                      disabled={selectedPrediction !== null}
                      className={cn(
                        "p-3 rounded-xl font-medium transition-all",
                        selectedPrediction === null
                          ? "bg-slate-700 text-white hover:bg-blue-600"
                          : i === predictionDemo[predictionStep].best
                          ? "bg-green-500 text-white"
                          : selectedPrediction === i
                          ? "bg-red-500 text-white"
                          : "bg-slate-700 text-gray-400"
                      )}
                    >
                      {option}
                      {selectedPrediction !== null && i === predictionDemo[predictionStep].best && " ✓"}
                    </button>
                  ))}
                </div>
              </div>

              {selectedPrediction !== null && (
                <div className={cn(
                  "p-4 rounded-xl mb-4",
                  selectedPrediction === predictionDemo[predictionStep].best
                    ? "bg-green-50 text-green-700"
                    : "bg-orange-50 text-orange-700"
                )}>
                  {selectedPrediction === predictionDemo[predictionStep].best
                    ? "🎉 Great prediction! LLMs calculate probabilities for each word!"
                    : "🤔 Close! LLMs would choose differently based on what they learned."}
                </div>
              )}

              {selectedPrediction !== null && predictionStep < predictionDemo.length - 1 && (
                <button
                  onClick={() => {
                    setPredictionStep(s => s + 1);
                    setSelectedPrediction(null);
                  }}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
                >{t('auto.learning.s905_try_another', 'Try Another →')}</button>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => {
                setStep(s => s - 1);
                setAnimatedTokens([]);
                setSelectedPrediction(null);
                setPredictionStep(0);
              }}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
            >← Back</button>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    i === step ? "bg-blue-500 scale-125" : i < step ? "bg-blue-300" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            {step === steps.length - 1 ? (
              <button
                onClick={onComplete}
                disabled={selectedPrediction === null}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50"
              >Now let me try! 🧸</button>) : (<button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-3 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all"
              >{t('auto.learning.s906_next', 'Next →')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
