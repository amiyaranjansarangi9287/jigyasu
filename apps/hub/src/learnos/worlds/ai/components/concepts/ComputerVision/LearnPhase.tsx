import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface LearnPhaseProps {
  onComplete: () => void;
}

// Simulated pixel grid for demonstration
const createPixelGrid = (emoji: string): string[][] => {
  const grids: Record<string, string[][]> = {
    '😀': [
      ['🟨', '🟨', '🟨', '🟨', '🟨'],
      ['🟨', '⬛', '🟨', '⬛', '🟨'],
      ['🟨', '🟨', '🟨', '🟨', '🟨'],
      ['🟨', '⬛', '⬛', '⬛', '🟨'],
      ['🟨', '🟨', '🟨', '🟨', '🟨'],
    ],
    '🐱': [
      ['⬜', '🟫', '⬜', '🟫', '⬜'],
      ['🟫', '🟫', '🟫', '🟫', '🟫'],
      ['🟫', '🟢', '🟫', '🟢', '🟫'],
      ['🟫', '🟫', '⬛', '🟫', '🟫'],
      ['🟫', '⬜', '🟫', '⬜', '🟫'],
    ],
    '🚗': [
      ['⬜', '🟥', '🟥', '🟥', '⬜'],
      ['🟥', '🟦', '🟥', '🟦', '🟥'],
      ['🟥', '🟥', '🟥', '🟥', '🟥'],
      ['⬜', '⬛', '⬜', '⬛', '⬜'],
      ['⬜', '⬜', '⬜', '⬜', '⬜'],
    ],
  };
  return grids[emoji] || grids['😀'];
};

const detectionExamples = [
  { image: '😀', label: 'Face', detected: ['Face: 98%', 'Smile: Yes', 'Eyes: 2'] },
  { image: '🐱', label: 'Cat', detected: ['Cat: 95%', 'Animal: Yes', 'Ears: Pointy'] },
  { image: '🚗', label: 'Car', detected: ['Car: 97%', 'Vehicle: Yes', 'Wheels: 4'] },
];

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [selectedExample, setSelectedExample] = useState(0);
  const [showDetection, setShowDetection] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = [
    { title: "Pixels: The Building Blocks", type: "pixels" },
    { title: "How AI Sees Images", type: "detection" },
  ];

  const example = detectionExamples[selectedExample];
  const pixelGrid = createPixelGrid(example.image);

  const runDetection = async () => {
    setIsAnalyzing(true);
    setShowDetection(false);
    await new Promise(r => setTimeout(r, 1500));
    setShowDetection(true);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🔮 How Computer Vision Works</h2>
          <p className="text-teal-100 mt-1">{steps[step].title}</p>
        </div>

        <div className="p-6">
          {step === 0 && (
            <div>
              <p className="text-center text-gray-600 mb-6">
                Every image is made of tiny squares called pixels. Click on different images to see their pixels!
              </p>

              {/* Image Selector */}
              <div className="flex justify-center gap-4 mb-6">
                {detectionExamples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedExample(i)}
                    className={cn(
                      "w-20 h-20 rounded-xl text-4xl flex items-center justify-center transition-all",
                      selectedExample === i
                        ? "bg-teal-100 ring-4 ring-teal-500 scale-110"
                        : "bg-gray-100 hover:bg-teal-50"
                    )}
                  >
                    {ex.image}
                  </button>
                ))}
              </div>

              {/* Pixel Grid */}
              <div className="bg-slate-900 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-8">
                  {/* Original */}
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">{t('auto.learning.s883_original_image', 'Original Image')}</p>
                    <div className="text-8xl">{example.image}</div>
                  </div>
                  
                  <div className="text-4xl text-teal-400">→</div>
                  
                  {/* Pixelated */}
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">{t('auto.learning.s884_pixel_view', 'Pixel View')}</p>
                    <div className="grid grid-cols-5 gap-1">
                      {pixelGrid.map((row, i) =>row.map((pixel, j) => (<div
                            key={`${i}-${j}`}
                            className="w-8 h-8 flex items-center justify-center text-lg rounded animate-pulse"
                            style={{ animationDelay: `${(i + j) * 0.1}s` }}
                          >
                            {pixel}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 rounded-xl p-4">
                <p className="text-teal-700">
                  💡 <strong>{t('auto.learning.s885_fun_fact', 'Fun fact:')}</strong> A typical phone photo has millions of pixels! 
                  AI looks at patterns in these pixels to understand what's in the image.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-center text-gray-600 mb-6">
                Watch how AI analyzes an image and detects what's in it!
              </p>

              {/* Image Selector */}
              <div className="flex justify-center gap-4 mb-6">
                {detectionExamples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedExample(i);
                      setShowDetection(false);
                    }}
                    className={cn(
                      "w-16 h-16 rounded-xl text-3xl flex items-center justify-center transition-all",
                      selectedExample === i
                        ? "bg-teal-100 ring-2 ring-teal-500"
                        : "bg-gray-100 hover:bg-teal-50"
                    )}
                  >
                    {ex.image}
                  </button>
                ))}
              </div>

              {/* Detection Demo */}
              <div className="bg-slate-900 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="relative">
                      <div className="text-8xl">{example.image}</div>
                      {showDetection && (
                        <div className="absolute inset-0 border-4 border-green-400 rounded-xl animate-pulse" />
                      )}
                    </div>
                  </div>

                  {showDetection && (
                    <div className="bg-slate-800 rounded-xl p-4">
                      <p className="text-green-400 font-bold mb-2">✅ Detected:</p>
                      {example.detected.map((item, i) => (
                        <p key={i} className="text-white text-sm">{item}</p>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={runDetection}
                  disabled={isAnalyzing}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50"
                >
                  {isAnalyzing ? '🔍 Analyzing...' : '🔍 Analyze Image'}
                </button>
              </div>

              <div className="bg-teal-50 rounded-xl p-4">
                <p className="text-teal-700">
                  🎯 <strong>{t('auto.learning.s886_this_is_computer_vision', 'This is Computer Vision!')}</strong>AI looks at the pixels, 
                  finds patterns, and tells us what it sees - just like that!</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
            >← Back</button>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    i === step ? "bg-teal-500 scale-125" : i < step ? "bg-teal-300" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            {step === steps.length - 1 ? (
              <button
                onClick={onComplete}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg transition-all hover:scale-105"
              >Now let me try! 🧸</button>) : (<button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-3 rounded-xl font-medium bg-teal-500 text-white hover:bg-teal-600 transition-all"
              >{t('auto.learning.s887_next', 'Next →')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
