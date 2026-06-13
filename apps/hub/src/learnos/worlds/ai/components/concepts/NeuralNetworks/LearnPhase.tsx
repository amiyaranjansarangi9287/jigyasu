import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';

interface LearnPhaseProps {
  onComplete: () => void;
}

interface Neuron {
  id: string;
  x: number;
  y: number;
  layer: number;
  activation: number;
}

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activations, setActivations] = useState<Record<string, number>>({});
  
  const layers = [3, 4, 4, 2]; // Input, Hidden1, Hidden2, Output
  
  const neurons: Neuron[] = [];
  layers.forEach((count, layerIndex) => {
    for (let i = 0; i < count; i++) {
      neurons.push({
        id: `${layerIndex}-${i}`,
        x: 80 + layerIndex * 140,
        y: 80 + i * 70 + (4 - count) * 35,
        layer: layerIndex,
        activation: 0,
      });
    }
  });
  
  const connections: { from: string; to: string }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (let i = 0; i < layers[l]; i++) {
      for (let j = 0; j < layers[l + 1]; j++) {
        connections.push({ from: `${l}-${i}`, to: `${l + 1}-${j}` });
      }
    }
  }

  const steps = [
    {
      title: "The Input Layer 📥",
      description: "This is where information enters the neural network. Like your eyes seeing an image or your ears hearing a sound!",
      highlightLayer: 0,
    },
    {
      title: "Hidden Layers 🔮",
      description: "These magical middle layers find patterns! Each neuron looks for something specific - maybe edges, shapes, or colors.",
      highlightLayer: 1,
    },
    {
      title: "More Hidden Processing 🧩",
      description: "The deeper we go, the more complex patterns neurons can recognize. Simple shapes become faces, letters become words!",
      highlightLayer: 2,
    },
    {
      title: "The Output Layer 📤",
      description: "Finally! The network gives us an answer. 'This is a cat!' or 'This number is 7!' - the result of all that teamwork!",
      highlightLayer: 3,
    },
    {
      title: "Watch It Flow! ✨",
      description: "Now let's watch information flow through the entire network. See how each layer lights up in order!",
      highlightLayer: -1,
      animate: true,
    },
  ];

  useEffect(() => {
    if (step === 4 && !isAnimating) {
      setIsAnimating(true);
      animateFlow();
    }
  }, [step]);

  const animateFlow = async () => {
    for (let l = 0; l < layers.length; l++) {
      const newActivations: Record<string, number> = { ...activations };
      for (let i = 0; i < layers[l]; i++) {
        newActivations[`${l}-${i}`] = Math.random() * 0.5 + 0.5;
      }
      setActivations(prev => ({ ...prev, ...newActivations }));
      await new Promise(r => setTimeout(r, 600));
    }
    setIsAnimating(false);
  };

  const getNeuron = (id: string) =>neurons.find(n => n.id === id)!;
  const currentStep = steps[step];

  return (<div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🔮 How Neural Networks Work</h2>
          <p className="text-blue-100 mt-1">{t('auto.learning.s910_watch_and_learn', 'Watch and learn!')}</p>
        </div>

        <div className="p-6">
          {/* Visualization */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 mb-6">
            <svg viewBox="0 0 600 350" className="w-full">
              {/* Connections */}
              {connections.map(({ from, to }) => {
                const fromN = getNeuron(from);
                const toN = getNeuron(to);
                const isHighlighted = 
                  currentStep.highlightLayer === fromN.layer ||
                  currentStep.highlightLayer === toN.layer ||
                  (activations[from] && activations[to]);
                
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={fromN.x}
                    y1={fromN.y}
                    x2={toN.x}
                    y2={toN.y}
                    stroke={isHighlighted ? "#a78bfa" : "#334155"}
                    strokeWidth={isHighlighted ? 2 : 1}
                    opacity={isHighlighted ? 0.8 : 0.3}
                    className="transition-all duration-300"
                  />
                );
              })}
              
              {/* Neurons */}
              {neurons.map((neuron) => {
                const isHighlighted = currentStep.highlightLayer === neuron.layer;
                const activation = activations[neuron.id] || 0;
                
                return (
                  <g key={neuron.id}>
                    <circle
                      cx={neuron.x}
                      cy={neuron.y}
                      r={20}
                      fill={activation > 0 ? `rgba(168, 85, 247, ${activation})` : isHighlighted ? "#a855f7" : "#475569"}
                      stroke={isHighlighted || activation > 0 ? "#c4b5fd" : "#64748b"}
                      strokeWidth={2}
                      className="transition-all duration-300"
                    />
                    {(isHighlighted || activation >0) && (<circle
                        cx={neuron.x}
                        cy={neuron.y}
                        r={25}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth={2}
                        opacity={0.5}
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
              
              {/* Layer Labels */}
              {['Input', 'Hidden 1', 'Hidden 2', 'Output'].map((label, i) => (
                <text
                  key={i}
                  x={80 + i * 140}
                  y={320}
                  textAnchor="middle"
                  fill={currentStep.highlightLayer === i ? "#a855f7" : "#94a3b8"}
                  className="text-sm font-medium"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>

          {/* Explanation */}
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              {currentStep.title}
            </h3>
            <p className="text-purple-700">
              {currentStep.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setStep(s => s - 1);
                setActivations({});
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
                    i === step ? "bg-purple-500 scale-125" : i < step ? "bg-purple-300" : "bg-gray-300"
                  )}
                />
              ))}
            </div>

            {step === steps.length - 1 ? (
              <button
                onClick={onComplete}
                disabled={isAnimating}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50"
              >Now let me try! 🧸</button>) : (<button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-3 rounded-xl font-medium bg-purple-500 text-white hover:bg-purple-600 transition-all"
              >{t('auto.learning.s911_next', 'Next →')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
