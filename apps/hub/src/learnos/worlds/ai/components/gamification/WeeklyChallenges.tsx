import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { getWeeklyChallenges, Challenge } from '../../data/challenges';
import { useProgress } from '../../context/ProgressContext';
import { cn } from '../../utils/cn';

export default function WeeklyChallenges() {
  const { t } = useTranslation();
  const { completedConcepts, xp, perfectQuizzes, streak } = useProgress();
  
  const challenges = useMemo(() => getWeeklyChallenges(), []);

  const getChallengeProgress = (challenge: Challenge): { current: number; percentage: number; completed: boolean } => {
    let current = 0;
    
    switch (challenge.type) {
      case 'complete_concepts':
        current = completedConcepts.length;
        break;
      case 'earn_xp':
        current = xp;
        break;
      case 'perfect_quiz':
        current = perfectQuizzes.length;
        break;
      case 'play_games':
        current = 0; // Would need game play tracking
        break;
      case 'streak':
        current = streak;
        break;
    }
    
    const percentage = Math.min((current / challenge.target) * 100, 100);
    return { current: Math.min(current, challenge.target), percentage, completed: current >= challenge.target };
  };

  // Calculate days remaining in the week
  const now = new Date();
  const daysLeft = 7 - now.getDay();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🏆</span>{t('auto.learning.s834_weekly_challenges', 'Weekly Challenges')}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
        </span>
      </div>

      <div className="space-y-3">
        {challenges.map(challenge => {
          const progress = getChallengeProgress(challenge);
          
          return (
            <div
              key={challenge.id}
              className={cn(
                "p-3 rounded-xl border-2 transition-all",
                progress.completed 
                  ? "bg-green-50 border-green-200" 
                  : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{progress.completed ? '✅' : challenge.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn("font-medium text-sm", progress.completed ? "text-green-700" : "text-gray-800")}>
                      {challenge.title}
                    </p>
                    <span className="text-xs text-purple-600 font-medium ml-2">+{challenge.xpReward} XP</span>
                  </div>
                  <p className="text-xs text-gray-500">{challenge.description}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          progress.completed ? "bg-green-500" : "bg-purple-500"
                        )}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {progress.current}/{challenge.target}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
