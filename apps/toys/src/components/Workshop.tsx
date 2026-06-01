import { useMemo } from 'react';
import { toys } from '../data/toys';
import type { Toy } from '../data/toys';
import { useBuildStatus } from '../hooks/useBuildStatus';
import { useAchievements } from '../hooks/useAchievements';

interface WorkshopProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToy: (toy: Toy) => void;
  onStartBuild: (toy: Toy) => void;
}

export default function Workshop({ isOpen, onClose, onSelectToy, onStartBuild }: WorkshopProps) {
  const { getStatus, allProgress } = useBuildStatus();
  const { achievements, progress: achievementProgress } = useAchievements();

  const stats = useMemo(() => {
    const completed = Object.values(allProgress).filter((p) => p.completedAt);
    const inProgress = Object.values(allProgress).filter(
      (p) => p.startedAt && !p.completedAt
    );
    const totalTime = Object.values(allProgress).reduce(
      (sum, p) => sum + (p.elapsedSeconds || 0),
      0
    );
    const totalStepsCompleted = Object.values(allProgress).reduce(
      (sum, p) => sum + (p.completedSteps?.length || 0),
      0
    );

    return {
      completedCount: completed.length,
      inProgressCount: inProgress.length,
      totalTime,
      totalStepsCompleted,
    };
  }, [allProgress]);

  const completedToys = useMemo(() => {
    return toys.filter((t) => getStatus(t.id) === 'completed');
  }, [getStatus]);

  const inProgressToys = useMemo(() => {
    return toys.filter((t) => getStatus(t.id) === 'in-progress');
  }, [getStatus]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
              🏠
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Workshop</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your building journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">{stats.completedCount}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Builds Completed</div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-3">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${(stats.completedCount / toys.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-3xl font-extrabold text-amber-500">{stats.inProgressCount}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-3xl font-extrabold text-emerald-500">{formatTime(stats.totalTime)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Time</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-3xl font-extrabold text-indigo-500">{stats.totalStepsCompleted}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Steps Done</div>
          </div>
        </div>

        {/* In Progress */}
        {inProgressToys.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-sm">⏳</span>
              Continue Building
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressToys.map((toy) => {
                const p = allProgress[toy.id];
                const stepPercent = ((p?.completedSteps?.length || 0) / toy.steps.length) * 100;
                return (
                  <div
                    key={toy.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4 p-4">
                      <img
                        src={toy.image}
                        alt={toy.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{toy.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {p?.completedSteps?.length || 0} of {toy.steps.length} steps
                        </p>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${stepPercent}%` }}
                          />
                        </div>
                        <button
                          onClick={() => onStartBuild(toy)}
                          className="mt-3 px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full hover:bg-amber-600 transition-colors"
                        >
                          ▶ Continue
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Completed Builds */}
        {completedToys.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-sm">✅</span>
              Completed ({completedToys.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {completedToys.map((toy) => {
                const p = allProgress[toy.id];
                return (
                  <button
                    key={toy.id}
                    onClick={() => onSelectToy(toy)}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-left"
                  >
                    <div className="relative">
                      <img
                        src={toy.image}
                        alt={toy.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Built
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{toy.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ⏱ {formatTime(p?.elapsedSeconds || 0)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Achievements */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center text-sm">🏆</span>
              Achievements
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {achievementProgress.unlocked}/{achievementProgress.total} unlocked
            </span>
          </div>

          {/* Unlocked */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Unlocked</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {unlockedAchievements.map((a) => (
                  <div
                    key={a.id}
                    className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{a.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{a.description}</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2">
                      {new Date(a.unlockedAt!).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked */}
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Locked</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {lockedAchievements.map((a) => (
                <div
                  key={a.id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 opacity-60"
                >
                  <div className="text-2xl mb-2 grayscale">🔒</div>
                  <h4 className="font-bold text-gray-500 dark:text-gray-400 text-sm">{a.name}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{a.condition}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Empty state */}
        {stats.completedCount === 0 && stats.inProgressCount === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔨</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Start Your Journey!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven't built any toys yet. Browse our collection and start your first project!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg transition-all"
            >
              Browse Toys →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
