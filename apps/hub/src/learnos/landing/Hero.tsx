import { useTranslation } from 'react-i18next';
import { Button } from '@jigyasu/ui';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-12 md:pt-20 md:pb-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-sm font-bold uppercase tracking-wide text-brand shadow-sm">
              ✨ {t('landing.hero.badge')}
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-slate-900 md:text-6xl">
              {t('landing.hero.title_part1')}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand">{t('landing.hero.title_part2')}</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8 Q 50 1, 100 6 T 198 5"
                    stroke="#ffb074"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              {t('landing.hero.description')}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#worlds"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-brand px-10 py-5 text-xl font-black text-white shadow-xl shadow-orange-300/60 hover:bg-brand-dark transition active:scale-95"
              >
                {t('landing.hero.cta_pick_world')}
                <span className="transition-transform group-hover:translate-x-2 text-2xl">→</span>
              </a>
              <a
                href="#how"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/50 backdrop-blur px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition active:scale-95"
              >
                ▶ {t('landing.hero.cta_see_how')}
              </a>
            </div>

            <dl className="mt-10 flex flex-wrap gap-6 text-sm">
              <div>
                <dt className="text-slate-500">{t('landing.hero.stat_learners')}</dt>
                <dd className="font-display text-2xl font-bold text-slate-900">{t('landing.hero.coming_soon', 'Coming Soon')}</dd>
              </div>
              <div className="border-l border-orange-200 pl-6">
                <dt className="text-slate-500">{t('landing.hero.stat_lessons')}</dt>
                <dd className="font-display text-2xl font-bold text-slate-900">{t('landing.hero.coming_soon', 'Coming Soon')}</dd>
              </div>
              <div className="border-l border-orange-200 pl-6">
                <dt className="text-slate-500">{t('landing.hero.stat_rating')}</dt>
                <dd className="font-display text-2xl font-bold text-slate-900">{t('landing.hero.coming_soon', 'Coming Soon')}</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 p-1 shadow-2xl shadow-orange-300/40 rotate-3">
                <div className="h-full w-full rounded-[2.3rem] bg-white p-6 bg-dots">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">�</span>
                        <span className="font-display font-bold text-slate-800">{t('landing.hero.lesson_label')} 12</span>
                      </div>
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-sm font-bold text-brand">+15 XP</span>
                    </div>
                    <div className="mt-4 flex-1 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-5">
                      <p className="text-sm font-semibold text-slate-500">{t('landing.hero.question_prompt')}</p>
                      <div className="mt-3 flex min-h-32 items-center justify-center text-7xl animate-wiggle">
                        🐘
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {["Moo", "Trumpet", "Bark"].map((w, i) => (
                          <Button
                            key={w}
                            variant={i === 1 ? 'primary' : 'secondary'}
                            size="sm"
                            className="w-full"
                          >
                            {w}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-orange-100">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-orange-400 to-rose-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-500">9/12</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -left-6 hidden rotate-[-8deg] rounded-2xl bg-white p-3 shadow-xl shadow-orange-200/60 sm:block animate-float">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-xl">🎯</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">5-day {t('landing.hero.streak_label')}</p>
                    <p className="text-sm text-slate-500">{t('landing.hero.streak_keep')} 🔥</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -right-4 hidden rotate-[6deg] rounded-2xl bg-white p-3 shadow-xl shadow-orange-200/60 sm:block animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-xl">🏅</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t('landing.hero.badge_label')}</p>
                    <p className="text-sm text-slate-500">{t('landing.hero.badge_unlocked')}</p>
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
