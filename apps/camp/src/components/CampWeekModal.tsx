// CampCraft - Camp Week Modal (Full Week Experience)

import { getCampWeekById } from '../data/campWeeks';
import { getActivityById, Activity } from '../data/activities';
import { useCampWeekProgress } from '../hooks/useCampWeekProgress';


interface CampWeekModalProps {
  weekId: string;
  onClose: () => void;
  onStartActivity: (activity: Activity) => void;
  getActivityStatus: (id: string) => 'not-started' | 'in-progress' | 'completed';
}

export default function CampWeekModal({
  weekId,
  onClose,
  onStartActivity,
  getActivityStatus
}: CampWeekModalProps) {
  const week = getCampWeekById(weekId);
  const { progress, startWeek, completeDay, isCompleted } = useCampWeekProgress(weekId);

  if (!week) {
    return null;
  }

  // Start week on first interaction
  if (!progress.startedAt) {
    startWeek();
  }

  const completedDaysCount = progress.completedDays.length;
  const progressPercentage = (completedDaysCount / 5) * 100;

  const handleStartDayActivity = (day: typeof week.days[0]) => {
    const activity = getActivityById(day.activityId);
    if (activity) {
      onStartActivity(activity);
    } else {
      // Fallback: Try to find a similar activity in the same pillar
      console.warn(`Activity ${day.activityId} not found, looking for alternative in ${day.pillar}`);
    }
  };

  const getDayStatus = (dayNum: number) => {
    if (progress.completedDays.includes(dayNum)) return 'completed';
    const day = week.days.find(d => d.day === dayNum);
    if (day) {
      const activityStatus = getActivityStatus(day.activityId);
      if (activityStatus === 'completed') {
        // Mark day as completed if activity is completed
        if (!progress.completedDays.includes(dayNum)) {
          completeDay(dayNum);
        }
        return 'completed';
      }
      if (activityStatus === 'in-progress') return 'in-progress';
    }
    return 'not-started';
  };

  const getNextDay = () => {
    for (let i = 1; i <= 5; i++) {
      if (!progress.completedDays.includes(i)) {
        return i;
      }
    }
    return null;
  };

  const nextDay = getNextDay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
        {/* Header with gradient */}
        <div className={`relative p-6 bg-gradient-to-r ${week.color} overflow-hidden`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex items-start gap-4">
            <div className="text-6xl">{week.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{week.name}</h2>
                {isCompleted && (
                  <span className="px-2 py-1 rounded-full bg-white/20 text-white text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Completed!
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm mb-3">{week.description}</p>
              
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-white font-medium text-sm">
                  {completedDaysCount}/5 days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Days Grid */}
          <div className="grid gap-4 mb-6">
            {week.days.map((day) => {
              const activity = getActivityById(day.activityId);
              const status = getDayStatus(day.day);
              const isShowcase = day.day === week.showcaseDay;
              const isNext = nextDay === day.day;

              return (
                <div
                  key={day.day}
                  className={`relative p-4 rounded-2xl border-2 transition-all ${
                    status === 'completed'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : isNext
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 ring-2 ring-orange-200 dark:ring-orange-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {isShowcase && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold shadow-lg">
                      ⭐ Showcase
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Day Number */}
                    <div
                      className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                        status === 'completed'
                          ? 'bg-green-500 text-white'
                          : isNext
                          ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {status === 'completed' ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <>
                          <span className="text-xs font-medium opacity-70">Day</span>
                          <span className="text-xl font-bold">{day.day}</span>
                        </>
                      )}
                    </div>

                    {/* Activity Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">
                          {day.pillar === 'toybox' ? '🧸' :
                           day.pillar === 'sciencelab' ? '🔬' :
                           day.pillar === 'artstudio' ? '🎨' : '🌿'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 capitalize">
                          {day.pillar}
                        </span>
                      </div>
                      <h4 className={`font-bold mb-1 ${
                        status === 'completed'
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {day.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {day.description}
                      </p>
                      {activity && (
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.difficulty} • {activity.timeToMake} • Ages {activity.ageRange}
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => handleStartDayActivity(day)}
                      className={`flex-shrink-0 btn text-sm ${
                        status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : isNext
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      {status === 'completed' ? '✓ Done' :
                       status === 'in-progress' ? '▶ Continue' :
                       isNext ? '🚀 Start' : 'Preview'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Materials for the Week */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
              <span>📦</span> Materials for This Week
            </h4>
            <div className="flex flex-wrap gap-2">
              {week.materials.map((material, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 text-sm"
                >
                  {material}
                </span>
              ))}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-3">
              💡 Tip: Gather all materials at the start of the week for a smoother experience!
            </p>
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                Week Complete!
              </h4>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Amazing job completing {week.name}! You've earned the {week.icon} badge!
              </p>
              <button onClick={onClose} className="btn btn-primary">
                Continue Exploring
              </button>
            </div>
          )}

          {/* Next Day CTA */}
          {!isCompleted && nextDay && (
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-300">Ready for your next activity?</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  Day {nextDay}: {week.days.find(d => d.day === nextDay)?.title}
                </p>
              </div>
              <button
                onClick={() => {
                  const day = week.days.find(d => d.day === nextDay);
                  if (day) handleStartDayActivity(day);
                }}
                className="btn btn-primary"
              >
                🚀 Start Day {nextDay}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
