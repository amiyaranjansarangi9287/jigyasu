import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { useTranslation } from 'react-i18next';

interface LearnPhaseProps {
  onComplete: () => void;
}

export default function LearnPhase({ onComplete }: LearnPhaseProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Agent, Environment, Reward", type: "diagram" },
    { title: "The Learning Loop", type: "loop" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-lime-500 p-4 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">🔮 How Reinforcement Learning Works</h2>
          <p className="text-emerald-100 mt-1 text-sm sm:text-base">{steps[step].title}</p>
        </div>

        <div className="p-4 sm:p-6">
          {step === 0 && (
            <div>
              <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                Every RL system has these three parts working together!
              </p>

              <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 mb-6">
                <svg viewBox="0 0 300 200" className="w-full max-w-md mx-auto">
                  {/* Agent */}
                  <g>
                    <rect x="110" y="10" width="80" height="50" rx="10" fill="#10b981" />
                    <text x="150" y="30" fontSize="18" textAnchor="middle">🤖</text>
                    <text x="150" y="48" fontSize="11" textAnchor="middle" fill="white" fontWeight="bold">{t('auto.learning.s944_agent', 'Agent')}</text>
                  </g>
                  
                  {/* Environment */}
                  <g>
                    <rect x="110" y="130" width="80" height="50" rx="10" fill="#3b82f6" />
                    <text x="150" y="150" fontSize="18" textAnchor="middle">🌍</text>
                    <text x="150" y="170" fontSize="11" textAnchor="middle" fill="white" fontWeight="bold">{t('auto.learning.s945_environment', 'Environment')}</text>
                  </g>
                  
                  {/* Action arrow (down) */}
                  <g>
                    <line x1="130" y1="60" x2="130" y2="130" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#rlArrow)" />
                    <text x="100" y="100" fontSize="10" fill="#fbbf24" textAnchor="end">{t('auto.learning.s946_action', 'Action')}</text>
                  </g>
                  
                  {/* Reward arrow (up) */}
                  <g>
                    <line x1="170" y1="130" x2="170" y2="60" stroke="#10b981" strokeWidth="3" markerEnd="url(#rlArrow2)" />
                    <text x="200" y="100" fontSize="10" fill="#10b981">{t('auto.learning.s947_reward', 'Reward')}</text>
                  </g>
                  
                  {/* State label */}
                  <g>
                    <text x="225" y="100" fontSize="10" fill="#60a5fa">{t('auto.learning.s948_state', 'State')}</text>
                    <path d="M195,130 Q230,120 195,60" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4" />
                  </g>
                  
                  <defs>
                    <marker id="rlArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#fbbf24" />
                    </marker>
                    <marker id="rlArrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#10b981" />
                    </marker>
                  </defs>
                </svg>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[
                  { emoji: '🤖', title: 'Agent', desc: 'The learner that makes decisions', color: 'bg-emerald-50 border-emerald-200' },
                  { emoji: '🌍', title: 'Environment', desc: 'The world the agent explores', color: 'bg-blue-50 border-blue-200' },
                  { emoji: '⭐', title: 'Reward', desc: 'Points for good choices!', color: 'bg-yellow-50 border-yellow-200' },
                ].map((item, i) => (
                  <div key={i} className={cn("p-4 rounded-xl border-2 text-center", item.color)}>
                    <span className="text-3xl">{item.emoji}</span>
                    <p className="font-bold text-gray-800 mt-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                The agent keeps trying and learning from the results!
              </p>

              <div className="grid sm:grid-cols-4 gap-3 mb-6">
                {[
                  { emoji: '👀', title: 'Observe', desc: 'See the current state', num: 1 },
                  { emoji: '🤔', title: 'Decide', desc: 'Pick an action', num: 2 },
                  { emoji: '⚡', title: 'Act', desc: 'Do the action', num: 3 },
                  { emoji: '📊', title: 'Learn', desc: 'Get reward, update', num: 4 },
                ].map((item, i) => (
                  <div key={i} className="bg-gradient-to-b from-emerald-50 to-white rounded-xl p-4 text-center border-2 border-emerald-100">
                    <div className="w-8 h-8 mx-auto bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm mb-2">
                      {item.num}
                    </div>
                    <span className="text-2xl">{item.emoji}</span>
                    <p className="font-bold text-gray-800 text-sm mt-1">{item.title}</p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                <p className="text-emerald-700">
                  🔄 <strong>{t('auto.learning.s949_key_insight', 'Key Insight:')}</strong> This loop repeats thousands or millions of times! 
                  Each time, the agent gets a tiny bit better. That's the power of RL!
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-4 sm:px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
            >← Back</button>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={cn("w-3 h-3 rounded-full transition-all", i === step ? "bg-emerald-500 scale-125" : "bg-gray-300")} />
              ))}
            </div>

            {step === steps.length - 1 ? (
              <button onClick={onComplete} className="px-4 sm:px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:shadow-lg transition-all hover:scale-105">
                Now let me try! 🧸
              </button>) : (<button onClick={() => setStep(s => s + 1)} className="px-4 sm:px-6 py-3 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-all">{t('auto.learning.s950_next', 'Next →')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
