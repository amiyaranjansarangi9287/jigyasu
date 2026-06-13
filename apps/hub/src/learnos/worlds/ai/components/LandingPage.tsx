import { useTranslation } from 'react-i18next';
import { concepts } from '../data/concepts';
import { cn } from '../utils/cn';
import PixelMascot from './story/PixelMascot';
import { useProgress } from '../context/ProgressContext';
import LevelDisplay from './gamification/LevelDisplay';
import StreakDisplay from './gamification/StreakDisplay';
import BadgeDisplay from './gamification/BadgeDisplay';
import PixelTips from './gamification/PixelTips';
import WeeklyChallenges from './gamification/WeeklyChallenges';

interface LandingPageProps {
  onSelectConcept: (conceptId: string) => void;
  completedConcepts?: string[];
  onGames?: () => void;
}

export default function LandingPage({ onSelectConcept, onGames }: LandingPageProps) {
  const { t } = useTranslation();
  const {
    level,
    xp,
    streak,
    completedConcepts,
    earnedBadges,
    unlockedBadges,
  } = useProgress();

  const completionPercentage = Math.round((completedConcepts.length / concepts.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pixel Welcome */}
          <div className="mb-4 flex justify-center">
            <PixelMascot 
              mood={completedConcepts.length >= concepts.length ? 'celebrating' : 'waving'} 
              size="lg" 
              message={
                completedConcepts.length === 0 
                  ? t('auto.landingpage.ready_explore', 'Ready to explore AI? 🚀') 
                  : completedConcepts.length >= concepts.length
                  ? t('auto.landingpage.ai_master', "You're an AI Master! 🏆")
                  : `${concepts.length - completedConcepts.length} ${t('auto.landingpage.adventures_left', 'adventures left!')}`
              }
            />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {completedConcepts.length === 0 ? t('auto.landingpage.welcome_explorer', 'Welcome, Explorer!') : t('auto.landingpage.welcome_back', 'Welcome Back!')}
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {completedConcepts.length === 0 
              ? t('auto.landingpage.discover_ai', "Ready to discover the amazing world of AI? Let's learn together!")
              : t('auto.landingpage.continue_adventure', 'Continue your AI learning adventure!')
            }
          </p>
        </div>
      </section>

      {/* Progress & Stats Section */}
      <section className="pb-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Level */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('auto.learning.s798_your_level', 'Your Level')}</h3>
                <LevelDisplay level={level} xp={xp} size="sm" />
              </div>
              
              {/* Journey Progress */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('auto.learning.s799_journey_progress', 'Journey Progress')}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        {completedConcepts.length}/{concepts.length} {t('auto.landingpage.concepts', 'concepts')}
                      </span>
                      <span className="text-purple-600 font-bold">{completionPercentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Streak */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('auto.learning.s800_learning_streak', 'Learning Streak')}</h3>
                <StreakDisplay streak={streak} size="md" />
              </div>
            </div>
            
            {/* Recent Badges */}
            {unlockedBadges.length >0 && (<div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {t('auto.landingpage.recent_badges', 'Recent Badges')} ({earnedBadges.length} {t('auto.landingpage.earned', 'earned')})
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {unlockedBadges.slice(0, 6).map(badge => (
                    <BadgeDisplay
                      key={badge.id}
                      badge={badge}
                      earned={true}
                      size="sm"
                    />
                  ))}
                  {earnedBadges.length >6 && (<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-500 text-sm font-medium">
                      +{earnedBadges.length - 6}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Learning Journey Explanation - Show only for new users */}
      {completedConcepts.length === 0 && (
        <section className="pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">{t('auto.landingpage.your_journey', '🗺️ Your Learning Journey')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '📖', label: t('auto.landingpage.phase_story', 'Story'), desc: t('auto.landingpage.desc_listen', 'Listen & learn'), color: 'from-pink-50 to-rose-50' },
                  { icon: '🔮', label: t('auto.landingpage.phase_discover', 'Discover'), desc: t('auto.landingpage.desc_see', 'See how it works'), color: 'from-purple-50 to-violet-50' },
                  { icon: '🧸', label: t('auto.landingpage.phase_explore', 'Explore'), desc: t('auto.landingpage.desc_try', 'Try it yourself'), color: 'from-blue-50 to-cyan-50' },
                  { icon: '🎮', label: t('auto.landingpage.phase_play', 'Play'), desc: t('auto.landingpage.desc_test', 'Test your skills'), color: 'from-green-50 to-emerald-50' },
                ].map((phase, i) => (
                  <div key={i} className={cn(
                    "flex flex-col items-center p-4 rounded-xl bg-gradient-to-b bg-white shadow-sm",
                  )}>
                    <span className="text-2xl mb-1">{phase.icon}</span>
                    <span className="font-semibold text-gray-800 text-sm">{phase.label}</span>
                    <span className="text-xs text-gray-500">{phase.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Concept Selection */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Weekly Challenges + Mini-Games */}
          {completedConcepts.length >0 && (<div className="grid sm:grid-cols-2 gap-4 mb-6">
              <WeeklyChallenges />
              {onGames && (
                <button
                  onClick={onGames}
                  className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-5 text-white text-left hover:shadow-xl transition-all hover:scale-[1.01] group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-1">{t('auto.landingpage.mini_games', '🎮 Mini-Games')}</h3>
                    <p className="text-white/80 text-sm">{t('auto.landingpage.mini_games_desc', 'Match, scramble & speed challenges!')}</p>
                  </div>
                  <span className="text-3xl self-end group-hover:scale-125 transition-transform mt-4">→</span>
                </button>
              )}
            </div>
          )}
          

          
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
            🎯 {completedConcepts.length === 0 ? t('auto.landingpage.choose_adventure', 'Choose Your First Adventure!') : t('auto.landingpage.continue_learning', 'Continue Learning')}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {completedConcepts.length === 0 
              ? t('auto.landingpage.pick_topic', 'Pick any topic that sounds exciting!')
              : `${concepts.length - completedConcepts.length} ${t('auto.landingpage.adventures_waiting', 'adventures waiting for you!')}`
            }
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {concepts.map((concept) => {
              const isCompleted = completedConcepts.includes(concept.id);
              
              return (
                <button
                  key={concept.id}
                  onClick={() => onSelectConcept(concept.id)}
                  className={cn(
                    "group relative bg-white rounded-2xl p-5 shadow-md hover:shadow-xl",
                    "transform hover:-translate-y-1 transition-all duration-300",
                    "border-2 text-left overflow-hidden",
                    isCompleted 
                      ? "border-green-200 hover:border-green-400" 
                      : "border-transparent hover:border-purple-200"
                  )}
                >
                  {/* Completed badge */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      ✓
                    </div>
                  )}
                  
                  {/* Background gradient on hover */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity",
                    concept.color
                  )} />
                  
                  <div className="relative z-10">
                    <span className="text-4xl group-hover:scale-110 transition-transform inline-block mb-2">
                      {concept.emoji}
                    </span>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {concept.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {concept.description}
                    </p>
                    
                    <div className="mt-3 flex items-center text-purple-500 font-medium text-sm group-hover:text-purple-700">
                      {isCompleted ? t('auto.landingpage.review', '🔄 Review') : t('auto.landingpage.start', '▶️ Start')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pixel Tips */}
      <section className="pb-6 px-4">
        <div className="max-w-5xl mx-auto">
          <PixelTips />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <PixelMascot mood="excited" size="sm" />
          </div>
          <p className="text-purple-100 text-lg mb-2">
            {t('auto.landingpage.expert_beginner', '"Every expert was once a beginner!"')}
          </p>
          <p className="text-sm text-purple-200">
            {t('auto.landingpage.footer_message', 'Take your time, have fun, and remember - asking questions is how we learn! 💜')}
          </p>
        </div>
      </footer>
    </div>
  );
}
