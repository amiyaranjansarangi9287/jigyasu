interface AchievementSummary {
  id: string;
  name: string;
  icon: string;
}

interface Props {
  setWorkshopOpen: (open: boolean) => void;
  getCompletedCount: () => number;
  getTotalTime: () => number;
  getCompletedByPillar: (pillarId: string) => number;
  getAchievementProgress: () => { unlocked: number; total: number };
  getUnlockedAchievements: () => AchievementSummary[];
  getLockedAchievements: () => AchievementSummary[];
}

import { useTranslation, Trans } from 'react-i18next';
import { pillars } from '../data/categories';
import { useLocalizedActivities } from '../../hooks/useLocalizedData';
import { useFormatNumber } from '../../hooks/useFormatNumber';

export default function WorkshopPanel({
  setWorkshopOpen,
  getCompletedCount,
  getTotalTime,
  getCompletedByPillar,
  getAchievementProgress,
  getUnlockedAchievements,
  getLockedAchievements
}: Props) {
  const { t } = useTranslation();
  const { activities } = useLocalizedActivities();
  const formatNumber = useFormatNumber();
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setWorkshopOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg glass-panel shadow-2xl animate-slide-in-mobile overflow-y-auto">
        <div className="p-4 border-b border-gray-100/20 dark:border-gray-800/20 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('kidscamp.workshop.title', 'My Progress')}</h2>
          <button
            onClick={() => setWorkshopOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {formatNumber(getCompletedCount())}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('kidscamp.workshop.completed', 'Completed')}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(Math.floor(getTotalTime() / 60))}{t('kidscamp.workshop.minutes', 'm')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('kidscamp.workshop.total_time', 'Total Time')}</div>
            </div>
          </div>

          {/* Pillar Progress */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('kidscamp.workshop.pillar_progress', 'Pillar Progress')}</h3>
            <div className="space-y-3">
              {pillars.map((pillar) => {
                const completed = getCompletedByPillar(pillar.id);
                const total = activities.filter(a => a.pillar === pillar.id).length;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                return (
                  <div key={pillar.id} className="flex items-center gap-3">
                    <span className="text-2xl">{pillar.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        {/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                        <span className="font-medium text-gray-900 dark:text-white">{t(`pillar_${pillar.id}` as any, pillar.name)}</span>
                        <span className="text-gray-500">{formatNumber(completed)}/{formatNumber(total)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('kidscamp.workshop.achievements', 'Achievements')} ({formatNumber(getAchievementProgress().unlocked)}/{formatNumber(getAchievementProgress().total)})
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {getUnlockedAchievements().slice(0, 8).map((achievement) => (
                <div
                  key={achievement.id}
                  className="aspect-square rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 flex items-center justify-center text-2xl"
                  title={achievement.name}
                >
                  {achievement.icon}
                </div>
              ))}
              {getLockedAchievements().slice(0, Math.max(0, 8 - getUnlockedAchievements().length)).map((achievement) => (
                <div
                  key={achievement.id}
                  className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl grayscale opacity-30"
                  title={`Locked: ${achievement.name}`}
                >
                  {achievement.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
