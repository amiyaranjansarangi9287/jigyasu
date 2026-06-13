import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps {
  onComplete: () => void;
}

const pledgeItems = [
  { id: 1, text: "I will always verify AI's answers before using them", icon: "🔍" },
  { id: 2, text: "I will be honest about when I use AI", icon: "💬" },
  { id: 3, text: "I will never share personal information with AI", icon: "🔒" },
  { id: 4, text: "I will think about whether AI is being fair", icon: "⚖️" },
  { id: 5, text: "I will use AI to help, not to cheat", icon: "📚" },
  { id: 6, text: "I will be kind in how I use AI", icon: "💜" },
];

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [signedItems, setSignedItems] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);

  const toggleItem = (id: number) => {
    setSignedItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const allSigned = signedItems.length === pledgeItems.length;

  const createCertificate = () => {
    if (allSigned && name.trim()) {
      setShowCertificate(true);
    }
  };

  if (showCertificate) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-yellow-100 via-white to-rose-100 rounded-3xl shadow-xl overflow-hidden p-8">
          {/* Certificate */}
          <div className="bg-white rounded-2xl border-8 border-double border-yellow-400 p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Certificate of AI Ethics</h2>
            <p className="text-gray-600 mb-6">{t('auto.learning.s873_this_certifies_that', 'This certifies that')}</p>
            <p className="text-4xl font-bold text-rose-600 mb-6">
              {name}
            </p>
            <p className="text-gray-600 mb-6">
              has pledged to use AI responsibly, ethically, and kindly.
            </p>
            
            <div className="flex justify-center gap-4 mb-6">
              {['🌟', '⚖️', '💜', '🛡️', '✨'].map((emoji, i) => (
                <span key={i} className="text-3xl">{emoji}</span>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">
              Issued by AI Explorers • Good AI Citizen
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onComplete}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >Continue to Quiz! 🎮</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🧸 AI Ethics Pledge</h2>
          <p className="text-rose-100 mt-1">Make your promise to use AI responsibly!</p>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-600 mb-6">
            Check each box to make your pledge as a responsible AI user:
          </p>

          {/* Pledge Items */}
          <div className="space-y-3 mb-6">
            {pledgeItems.map(item => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left",
                  signedItems.includes(item.id)
                    ? "bg-green-50 border-green-500"
                    : "bg-gray-50 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  signedItems.includes(item.id)
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                )}>
                  {signedItems.includes(item.id) && (
                    <span className="text-white text-lg">✓</span>
                  )}
                </div>
                <span className="text-2xl">{item.icon}</span>
                <span className={cn(
                  "font-medium",
                  signedItems.includes(item.id) ? "text-green-700" : "text-gray-700"
                )}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{t('auto.learning.s874_pledge_progress', 'Pledge Progress')}</span>
              <span className="text-rose-600 font-medium">
                {signedItems.length}/{pledgeItems.length}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
                style={{ width: `${(signedItems.length / pledgeItems.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Name Input */}
          {allSigned && (
            <div className="mb-6 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sign your pledge with your name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name here..."
                className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-500 focus:outline-none text-lg"
              />
            </div>
          )}

          {/* Create Certificate Button */}
          <button
            onClick={createCertificate}
            disabled={!allSigned || !name.trim()}
            className={cn(
              "w-full py-4 rounded-xl font-bold transition-all",
              allSigned && name.trim()
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg hover:scale-[1.02]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
          >
            {!allSigned
              ? `Check all ${pledgeItems.length - signedItems.length} remaining items`
              : !name.trim()
              ? "Enter your name to continue"
              : "🏆 Create My Certificate!"}
          </button>
        </div>
      </div>
    </div>
  );
}
