import { useMemo } from 'react';
import { toys } from '../data/toys';
import type { Toy } from '../data/toys';
import { useBuildStatus } from '../hooks/useBuildStatus';

interface WeeklyChallengeProps {
  onStartBuild: (toy: Toy) => void;
}

export default function WeeklyChallenge({ onStartBuild }: WeeklyChallengeProps) {
  const { getStatus } = useBuildStatus();

  // Deterministic "random" challenge based on week number
  const challengeToy = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
    );
    return toys[weekNumber % toys.length];
  }, []);

  const status = getStatus(challengeToy.id);
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in-progress';

  // Days left in week
  const daysLeft = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    return 7 - dayOfWeek;
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-800 dark:via-purple-800 dark:to-indigo-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/4 right-1/4 text-6xl opacity-10 animate-float select-none">🎯</div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-white/90">Weekly Challenge</span>
              <span className="text-xs text-white/60">• {daysLeft} days left</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Build This Week's Challenge!
            </h2>
            <p className="text-lg text-white/70 mb-6 max-w-lg">
              Complete the {challengeToy.name} and earn the exclusive{' '}
              <span className="text-amber-300 font-semibold">🏆 Challenger Badge</span>!
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {isCompleted ? (
                <div className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-full flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Challenge Completed!
                </div>
              ) : (
                <button
                  onClick={() => onStartBuild(challengeToy)}
                  className="px-6 py-3 bg-white text-violet-700 font-bold rounded-full hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {isInProgress ? '▶ Continue Challenge' : '🔨 Accept Challenge'}
                </button>
              )}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/10 rounded-full text-white/80 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  challengeToy.difficulty === 'Easy' ? 'bg-emerald-500/30 text-emerald-200' :
                  challengeToy.difficulty === 'Medium' ? 'bg-amber-500/30 text-amber-200' :
                  'bg-red-500/30 text-red-200'
                }`}>
                  {challengeToy.difficulty}
                </span>
                <span>•</span>
                <span>{challengeToy.timeToMake}</span>
              </div>
            </div>
          </div>

          {/* Challenge toy card */}
          <div className="w-full max-w-sm">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-3xl opacity-20 blur-lg" />
              
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative">
                  <img
                    src={challengeToy.image}
                    alt={challengeToy.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                    🎯 This Week
                  </div>
                  {isCompleted && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl shadow-xl">
                        ✓
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{challengeToy.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{challengeToy.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-amber-500 font-semibold">⭐ {challengeToy.rating}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{challengeToy.steps.length} steps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
