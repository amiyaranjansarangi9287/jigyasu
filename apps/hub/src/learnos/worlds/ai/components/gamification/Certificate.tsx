import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { concepts } from '../../data/concepts';
import { cn } from '../../utils/cn';

interface CertificateProps {
  onClose: () => void;
}

export default function Certificate({ onClose }: CertificateProps) {
  const { t } = useTranslation();
  const { completedConcepts, level, xp, unlockedBadges, perfectQuizzes } = useProgress();
  const certRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [showCert, setShowCert] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const completionPercentage = Math.round((completedConcepts.length / concepts.length) * 100);

  const getCertType = () => {
    if (completedConcepts.length >= concepts.length) return { title: 'AI Master Certificate', tier: 'master', color: 'from-yellow-400 via-amber-500 to-yellow-600', border: 'border-yellow-500' };
    if (completedConcepts.length >= 5) return { title: 'AI Explorer Certificate', tier: 'explorer', color: 'from-purple-400 via-purple-500 to-purple-600', border: 'border-purple-500' };
    return { title: 'AI Beginner Certificate', tier: 'beginner', color: 'from-blue-400 via-blue-500 to-blue-600', border: 'border-blue-500' };
  };

  const cert = getCertType();

  const handlePrint = () => {
    window.print();
  };

  if (!showCert) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50 py-6 px-4">
        <div className="max-w-md mx-auto">
          <button onClick={onClose} className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm">← Back</button>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('auto.learning.s809_generate_your_certificate', 'Generate Your Certificate!')}</h1>
            <p className="text-gray-600 mb-6">
              You've completed {completedConcepts.length} concept{completedConcepts.length !== 1 ? 's' : ''}!
              {completedConcepts.length === 0 ? ' Complete at least one to earn a certificate.' : ''}
            </p>

            {completedConcepts.length >0 && (<>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Your Name (as it will appear on the certificate):
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-lg text-center"
                    maxLength={40}
                  />
                </div>

                <button
                  onClick={() => name.trim() && setShowCert(true)}
                  disabled={!name.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                >✨ Generate Certificate</button>
              </>
            )}

            {completedConcepts.length === 0 && (
              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >{t('auto.learning.s810_start_learning', 'Start Learning →')}</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Controls (hidden on print) */}
        <div className="flex justify-between items-center mb-4" data-print-hide>
          <button onClick={() => setShowCert(false)} className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 text-sm">
            ← Edit Name
          </button>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
              🖨️ Print / Save PDF
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm">{t('auto.learning.s811_close', 'Close')}</button>
          </div>
        </div>

        {/* Certificate */}
        <div ref={certRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative border */}
          <div className={cn("p-2 bg-gradient-to-r", cert.color)}>
            <div className="bg-white rounded-xl p-6 sm:p-10">
              {/* Inner decorative border */}
              <div className={cn("border-4 border-double rounded-xl p-6 sm:p-10", cert.border)}>
                
                {/* Header ornament */}
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-2 text-2xl mb-3">
                    <span>🌟</span><span>🏆</span><span>🌟</span>
                  </div>
                  <p className="text-sm text-gray-500 tracking-[0.3em] uppercase">AI Explorers Academy</p>
                </div>
                
                {/* Title */}
                <h1 className={cn(
                  "text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r bg-clip-text text-transparent",
                  cert.color
                )}>
                  {cert.title}
                </h1>
                
                <p className="text-center text-gray-600 mb-6">{t('auto.learning.s812_this_certifies_that', 'This certifies that')}</p>
                
                {/* Name */}
                <div className="text-center mb-6">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 inline-block px-8">
                    {name}
                  </p>
                </div>
                
                <p className="text-center text-gray-600 mb-8 max-w-md mx-auto">
                  has demonstrated knowledge and understanding of Artificial Intelligence concepts 
                  through the AI Explorers learning platform.
                </p>
                
                {/* Achievements Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{completedConcepts.length}</div>
                    <div className="text-xs text-gray-600">{t('auto.learning.s813_concepts', 'Concepts')}</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{xp.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">{t('auto.learning.s814_xp_earned', 'XP Earned')}</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{unlockedBadges.length}</div>
                    <div className="text-xs text-gray-600">{t('auto.learning.s815_badges', 'Badges')}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{perfectQuizzes.length}</div>
                    <div className="text-xs text-gray-600">{t('auto.learning.s816_perfect_quizzes', 'Perfect Quizzes')}</div>
                  </div>
                </div>

                {/* Topics Completed */}
                <div className="mb-8">
                  <p className="text-center text-sm text-gray-500 mb-3">{t('auto.learning.s817_topics_mastered', 'Topics Mastered:')}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {concepts
                      .filter(c =>completedConcepts.includes(c.id))
                      .map(c => (<span key={c.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          {c.emoji} {c.title}
                        </span>
                      ))
                    }
                  </div>
                </div>

                {/* Earned Badges */}
                {unlockedBadges.length >0 && (<div className="mb-8">
                    <p className="text-center text-sm text-gray-500 mb-3">{t('auto.learning.s818_badges_earned', 'Badges Earned:')}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {unlockedBadges.slice(0, 10).map(badge => (
                        <span key={badge.id} className="text-2xl" title={badge.name}>{badge.emoji}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500">{t('auto.learning.s819_level', 'Level:')}<span className="font-medium text-gray-700">{level.emoji} {level.name}</span></p>
                    <p className="text-sm text-gray-500">{t('auto.learning.s820_completion', 'Completion:')}<span className="font-medium text-gray-700">{completionPercentage}%</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{t('auto.learning.s821_date_issued', 'Date Issued')}</p>
                    <p className="font-medium text-gray-700">{today}</p>
                  </div>
                </div>

                {/* Seal */}
                <div className="flex justify-center mt-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🏆</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Share tip */}
        <p className="text-center text-gray-500 text-sm mt-4" data-print-hide>
          💡 Tip: Click "Print" and choose "Save as PDF" to keep your certificate!
        </p>
      </div>
    </div>
  );
}
