import { useTranslation } from 'react-i18next';

const PARENT_FEATURES = [
  "landing.parents.safe",
  "landing.parents.educational",
  "landing.parents.transparent",
  "landing.parents.privacy",
];

export default function ParentsPanel() {
  const { t } = useTranslation();

  return (
    <section id="parents" className="mx-auto max-w-6xl px-5 py-16">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl md:p-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold uppercase tracking-wider text-orange-200">
              👨‍👩‍👧 {t('landing.parents.title')}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
              {t('landing.parents.subtitle')}
            </h2>
            <p className="mt-4 text-slate-300">
              {t('landing.parents.safe_desc')}
            </p>

            <ul className="mt-6 space-y-3">
              {PARENT_FEATURES.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-slate-200">{t(key)} — {t(`${key}_desc`)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/privacy" className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-brand-dark transition">
                {t('landing.footer.privacy')}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl bg-white/95 p-8 text-slate-800 shadow-2xl rotate-1">
              <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-slate-500">{t('weekly_summary', 'Weekly Summary')}</p>
                <p className="font-display text-lg font-bold">{t('landing.hero.coming_soon', 'Coming Soon')}</p>
                <p className="text-sm text-slate-600">{t('weekly_summary_desc', "Track your child's learning journey with detailed progress reports, time spent, and achievements.")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
