import { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';

interface LearnPhaseProps { onComplete: () => void; }

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { title: "Types of Generative AI", type: "types" },
    { title: "Diffusion: From Noise to Image", type: "diffusion" },
  ];

  const runDiffusion = async () => {
    setIsAnimating(true);
    setNoiseLevel(100);
    for (let i = 100; i >= 0; i -= 5) {
      await new Promise(r => setTimeout(r, 100));
      setNoiseLevel(i);
    }
    setIsAnimating(false);
  };

  useEffect(() => {
    if (step === 1) runDiffusion();
  }, [step]);

  // Generate noise dots
  const noiseDots = Array.from({ length: 80 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    opacity: noiseLevel / 100,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-fuchsia-500 to-purple-500 p-4 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">🔮 How Generative AI Works</h2>
          <p className="text-fuchsia-100 mt-1 text-sm sm:text-base">{steps[step].title}</p>
        </div>

        <div className="p-4 sm:p-6">
          {step === 0 && (
            <div>
              <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                Generative AI comes in many flavors — each creates different things!
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { emoji: '📝', title: 'Text Generation', desc: 'ChatGPT, Claude — write stories, answer questions, translate', color: 'bg-blue-50 border-blue-200' },
                  { emoji: '🖼️', title: 'Image Generation', desc: 'DALL-E, Midjourney — create images from text descriptions', color: 'bg-pink-50 border-pink-200' },
                  { emoji: '🎵', title: 'Music Generation', desc: 'Create melodies, songs, and sound effects', color: 'bg-purple-50 border-purple-200' },
                  { emoji: '🎬', title: 'Video Generation', desc: 'Create short videos and animations from text', color: 'bg-orange-50 border-orange-200' },
                ].map((item, i) => (
                  <div key={i} className={cn("p-4 rounded-xl border-2", item.color)}>
                    <span className="text-3xl">{item.emoji}</span>
                    <h3 className="font-bold text-gray-800 mt-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-fuchsia-50 border-l-4 border-fuchsia-500 p-4 rounded-r-xl">
                <p className="text-fuchsia-700 text-sm sm:text-base">
                  💡 <strong>{t('auto.learning.s897_key_idea', 'Key idea:')}</strong> All of these work by learning patterns from existing 
                  data and using those patterns to generate something new!
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
                Watch how a diffusion model turns noise into an image!
              </p>

              {/* Diffusion visualization */}
              <div className="bg-slate-900 rounded-2xl p-6 mb-6">
                <div className="relative w-48 h-48 mx-auto bg-slate-800 rounded-xl overflow-hidden">
                  {/* The image being revealed */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center text-8xl transition-opacity duration-300"
                    style={{ opacity: 1 - noiseLevel / 100 }}
                  >
                    🌸
                  </div>
                  
                  {/* Noise overlay */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    {noiseDots.map((dot, i) => (
                      <circle
                        key={i}
                        cx={dot.x}
                        cy={dot.y}
                        r={dot.size}
                        fill={`rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${dot.opacity})`}
                      />
                    ))}
                  </svg>
                </div>

                {/* Progress */}
                <div className="mt-4 text-center">
                  <div className="text-white text-sm mb-2">
                    {noiseLevel > 80 ? '🌀 Pure noise...' : 
                     noiseLevel > 50 ? '🔮 Shapes forming...' :
                     noiseLevel > 20 ? '✨ Almost there...' :
                     '🎉 Image revealed!'}
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden max-w-xs mx-auto">
                    <div 
                      className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all duration-100"
                      style={{ width: `${100 - noiseLevel}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Noise: {noiseLevel}% → Image: {100 - noiseLevel}%</p>
                </div>

                <button
                  onClick={runDiffusion}
                  disabled={isAnimating}
                  className="w-full mt-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 disabled:opacity-50 text-sm"
                >
                  {isAnimating ? '🔮 Generating...' : '🔄 Run Again'}
                </button>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-xl">
                <p className="text-purple-700 text-sm sm:text-base">
                  🎨 <strong>{t('auto.learning.s898_diffusion_models', 'Diffusion models')}</strong> learn to remove noise step by step. 
                  By reversing the noising process, they create images from scratch!
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="px-4 sm:px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 bg-gray-100 hover:bg-gray-200 text-gray-700">← Back</button>
            <div className="flex gap-2">{steps.map((_, i) => (<div key={i} className={cn("w-3 h-3 rounded-full", i === step ? "bg-fuchsia-500 scale-125" : "bg-gray-300")} />))}</div>
            {step === steps.length - 1 ? (
              <button onClick={onComplete} className="px-4 sm:px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:shadow-lg transition-all hover:scale-105">Now let me try! 🧸</button>) : (<button onClick={() => setStep(s => s + 1)} className="px-4 sm:px-6 py-3 rounded-xl font-medium bg-fuchsia-500 text-white hover:bg-fuchsia-600">{t('auto.learning.s899_next', 'Next →')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
