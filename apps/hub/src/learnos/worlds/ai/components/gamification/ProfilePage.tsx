import { useTranslation } from 'react-i18next';
import { useProgress } from '../../context/ProgressContext';
import { allBadges } from '../../data/gamification';
import { concepts } from '../../data/concepts';
import BadgeDisplay from './BadgeDisplay';
import LevelDisplay from './LevelDisplay';
import StreakDisplay, { StreakCalendar } from './StreakDisplay';
import { cn } from '../../utils/cn';

interface ProfilePageProps {
  onClose: () => void;
  onCertificate?: () => void;
}

export default function ProfilePage({ onClose, onCertificate }: ProfilePageProps) {
  const { t } = useTranslation();
  const {
    xp,
    level,
    streak,
    completedConcepts,
    earnedBadges,
    quizScores,
    perfectQuizzes,
  } = useProgress();

  const completionPercentage = Math.round((completedConcepts.length / concepts.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('auto.learning.s823_my_progress', 'My Progress')}</h1>
          <div className="flex gap-2">
            {onCertificate && completedConcepts.length >0 && (<button
                onClick={onCertificate}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >📜 Certificate</button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all"
            >← Back</button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Level Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-3">{t('auto.learning.s824_current_level', 'Current Level')}</h2>
            <LevelDisplay level={level} xp={xp} size="md" />
          </div>

          {/* Streak Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-3">{t('auto.learning.s825_learning_streak', 'Learning Streak')}</h2>
            <div className="flex flex-col items-center gap-3">
              <StreakDisplay streak={streak} size="lg" />
              <StreakCalendar streak={streak} />
            </div>
          </div>

          {/* Completion Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-3">{t('auto.learning.s826_journey_progress', 'Journey Progress')}</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {completionPercentage}%
              </div>
              <p className="text-gray-600 text-sm">
                {completedConcepts.length} of {concepts.length} concepts
              </p>
              <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{xp.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{t('auto.learning.s827_total_xp', 'Total XP')}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{earnedBadges.length}</div>
              <div className="text-sm text-gray-600">{t('auto.learning.s828_badges_earned', 'Badges Earned')}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{completedConcepts.length}</div>
              <div className="text-sm text-gray-600">{t('auto.learning.s829_concepts_completed', 'Concepts Completed')}</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">{perfectQuizzes.length}</div>
              <div className="text-sm text-gray-600">{t('auto.learning.s830_perfect_quizzes', 'Perfect Quizzes')}</div>
            </div>
          </div>
        </div>

        {/* Concept Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🎓 Concept Progress</h2>
          <div className="grid gap-3">
            {concepts.map(concept => {
              const isCompleted = completedConcepts.includes(concept.id);
              const quizScore = quizScores.find(s => s.conceptId === concept.id);
              const isPerfect = perfectQuizzes.includes(concept.id);
              
              return (
                <div
                  key={concept.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                    isCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{concept.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-800">{concept.title}</p>
                      {quizScore && (
                        <p className="text-sm text-gray-600">
                          Quiz: {quizScore.score}/{quizScore.total}
                          {isPerfect && ' ⭐'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">✓ Complete</span>) : (<span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm font-medium rounded-full">{t('auto.learning.s831_not_started', 'Not started')}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges - Earned */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            🏆 Earned Badges ({earnedBadges.length}/{allBadges.length})
          </h2>
          
          {earnedBadges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl block mb-2">🎯</span>
              <p>{t('auto.learning.s832_complete_concepts_to_earn_badges', 'Complete concepts to earn badges!')}</p>
            </div>) : (<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {allBadges
                .filter(b =>earnedBadges.includes(b.id))
                .map(badge => (<BadgeDisplay
                    key={badge.id}
                    badge={badge}
                    earned={true}
                    size="md"
                    showDetails
                  />
                ))}
            </div>
          )}
        </div>

        {/* Badges - Locked */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔒 Badges to Unlock</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {allBadges
              .filter(b =>!earnedBadges.includes(b.id))
              .map(badge => (<BadgeDisplay
                  key={badge.id}
                  badge={badge}
                  earned={false}
                  size="md"
                  showDetails
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
