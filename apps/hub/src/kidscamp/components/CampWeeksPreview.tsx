// CampCraft - Camp Weeks Preview Section

import { campWeeks } from '../data/campWeeks';
import { useReveal } from '../hooks/useReveal';
import { useTranslation } from 'react-i18next';

interface CampWeeksPreviewProps {
  onSelectWeek: (weekId: string) => void;
  getWeekStatus: (weekId: string) => 'not-started' | 'in-progress' | 'completed';
}

export default function CampWeeksPreview({ onSelectWeek, getWeekStatus }: CampWeeksPreviewProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const { t } = useTranslation();

  const getStatusBadge = (weekId: string) => {
    const status = getWeekStatus(weekId);
    if (status === 'completed') {
      return (
        <span className="px-2 py-1 rounded-full bg-green-500 text-white text-sm font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>{t('camp_weeks.completed', 'Completed')}</span>
      );
    }
    if (status === 'in-progress') {
      return (
        <span className="px-2 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">{t('camp_weeks.in_progress', 'In Progress')}</span>
      );
    }
    return null;
  };

  const getButtonText = (weekId: string) => {
    const status = getWeekStatus(weekId);
    if (status === 'completed') return t('camp_weeks.do_again', 'Do Again');
    if (status === 'in-progress') return t('camp_weeks.continue', 'Continue');
    return t('camp_weeks.start_week', 'Start Week');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 rounded-full px-4 py-2 mb-4">
            <span className="text-xl">📅</span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">{t('camp_weeks.project_weeks', 'Project Weeks')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('camp_weeks.structured_journeys', 'Structured Project Journeys')}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">{t('camp_weeks.follow_curated', 'Follow our curated 5-day project plans. Perfect for school breaks, weekends, or whenever you need structured hands-on fun!')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {campWeeks.map((week, index) => (
            <div
              key={week.id}
              className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Header with gradient */}
              <div className={`relative p-6 bg-gradient-to-r ${week.color}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{week.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{t(`kidscamp.campWeeks.${week.id}.name`, week.name)}</h3>
                      <p className="text-white/80 text-sm">{t('camp_weeks.days_of_activities', '5 days of activities')}</p>
                    </div>
                  </div>
                  {getStatusBadge(week.id)}
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {t(`kidscamp.campWeeks.${week.id}.description`, week.description)}
                </p>

                {/* Day preview */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
                  {week.days.map((day) => (
                    <div
                      key={day.day}
                      className="flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t('camp_weeks.day', 'Day')} {day.day}</span>
                      <span className="text-lg">
                        {day.pillar === 'toybox' ? '🧸' : 
                         day.pillar === 'sciencelab' ? '🔬' :
                         day.pillar === 'artstudio' ? '🎨' : '🌿'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Age badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {week.ageRange === 'all' ? t('camp_weeks.all_ages', 'All ages') : `${t('camp_weeks.ages', 'Ages')} ${week.ageRange}`}
                  </span>
                  <button
                    onClick={() => onSelectWeek(week.id)}
                    className="btn btn-primary text-sm px-4 py-2"
                  >
                    {getButtonText(week.id)}
                  </button>
                </div>
              </div>

              {/* Hover glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${week.color} pointer-events-none`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('kidscamp.camp_weeks.earn_champion', 'Complete all 4 Project Weeks to earn the 🏆 Summer Champion badge!')}
          </p>
        </div>
      </div>
    </section>
  );
}
